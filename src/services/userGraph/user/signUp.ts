import {UserTypes} from "../../../models/User";
import {UserRepository} from "../../../repositories/UserRepository";
import * as CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import {PlaceRepository} from "../../../repositories/PlaceRepository";

const referralCodeGenerator = require('referral-code-generator');
var AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION || 'us-east-1'});

interface CognitoData {
  userName: string;
  request: {
    userAttributes: {
      email: string;
      'custom:userType': string;
      sub: string;
    }
  },
  response: {
    autoConfirmUser: boolean;
    autoVerifyPhone: boolean;
    autoVerifyEmail: boolean;
  }
}

export async function main(event) {
  // Check attributes
  if (event.request?.userAttributes?.email && event.request?.userAttributes['custom:userType']) {
    let repo = new UserRepository();
    let placeRepo = new PlaceRepository();
    let user;

    // Build user document
    let userPublicProfile = {
      profileImage: "test",
      username: event.request.userAttributes.name
    };
    let userSettings = {
      enableNotification: true,
      appearInPeopleHere: true,
      receiveComment: true,
      profilePrivacy: "public"
    };
    user = {
      cognitoId: event.request.userAttributes.sub.toString(),
      email: event.request.userAttributes.email,
      instagram: null,
      facebook: null,
      publicProfile: userPublicProfile,
      settings: userSettings,
      referralCode: referralCodeGenerator.custom('uppercase', 6, 6, event.request.userAttributes.name),
      referralCodeUsed: event.request.userAttributes['custom:referralCode']
    };
    if (event.request.userAttributes['custom:userType'] == "classicUser") {
      user.userType = UserTypes.ClassicUser;
    } else if (event.request.userAttributes['custom:userType'] == "camUser") {
      user.userType = UserTypes.CamUser;
    } else {
      return null;
    }

    try {
      // Add user document in mongodb
      let userAdded = await repo.signUpUser(user);
      console.log('User added', userAdded);

      // Create IVS channel and add place in mongodb if user cam
      let placeAdded = null;
      if (user.userType === UserTypes.CamUser) {
        // Crea un canale IVS
        const ivs = new AWS.IVS({
          apiVersion: '2020-07-14',
          region: process.env.REGION || 'us-east-1'
        });
        const params = {
          latencyMode: 'LOW',
          name: userAdded['_id'].toString(),
          type: 'BASIC'
        };
        const ivsResult = await ivs.createChannel(params).promise();
        let live = await repo.updateLiveInfo(userAdded._id, {
          channel: ivsResult.channel.arn,
          streamServerUrl: ivsResult.channel.ingestEndpoint,
          streamKey: ivsResult.streamKey.value,
          liveUrl: ivsResult.channel.playbackUrl
        });
        console.log("User after live info changed", live);

        // Add place document for cam user
        let addPlace = {
          name: null,
          description: null,
          address: null,
          location: {
            type: 'Point',
            coordinates: [
              0,
              0
            ]
          },
          camUser: userAdded._id
        };
        placeAdded = await placeRepo.addPlace(addPlace);
        console.log("Place added", placeAdded);
      }

      // Update userId and placeId in cognito attributes
      let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
        region: process.env.REGION || 'us-east-1'
      });
      var params = {
        UserAttributes: [
          {
            Name: 'custom:userId',
            Value: userAdded['_id'].toString()
          }
        ],
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: event.request.userAttributes.sub
      };
      if (placeAdded) {
        params.UserAttributes.push({
          Name: 'custom:placeId',
          Value: placeAdded['_id'].toString()
        });
      }
      await cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();


      // Send email to user
      let paramsUserEmail = {
        Destination: { /* required */
          ToAddresses: [
            user.email
          ]
        },
        Source: 'business@somap.app',
        Template: 'CompleteSomapAccount',
        TemplateData: JSON.stringify({
          username: user.publicProfile.username,
          referralCode: user.referralCode
        }),
        ReplyToAddresses: [
          'business@somap.app'
        ],
      };
      await new AWS.SES({apiVersion: '2010-12-01'}).sendTemplatedEmail(paramsUserEmail).promise();

      return userAdded;
    } catch (e) {
      console.log('ERROR ADDING USER', e);
      return null;
    }

  } else {
    console.log('ERROR EMAIL OR USER TYPE NOT FOUND');
    return null;
  }
}

export async function deleteUser(userId: string) {
  let repo = new UserRepository();
  try {
    await repo.deleteUser(userId);
    return true;
  } catch (e) {
    return null;
  }
}
