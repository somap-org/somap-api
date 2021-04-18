import {UserTypes} from "../../../models/User";
import {UserRepository} from "../../../repositories/UserRepository";
import * as CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';

const referralCodeGenerator = require('referral-code-generator');
var AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION || 'eu-central-1'});

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
  //console.log('START MAIN');
  if (event.request?.userAttributes?.email && event.request?.userAttributes['custom:userType']) {
    //console.log('EMAIL AND USER TYPE FOUND', event.request.userAttributes.email, event.request?.userAttributes['custom:userType']);
    let repo = new UserRepository();
    let user;

    let userPublicProfile = {
      profileImage: "test",
      username: event.request.userAttributes.name,
      followers: 0,
      following: 0,
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
      //console.log('ERRORE: custom:userType non definito o errato');
      return null;
    }

    try {
      let userAdded = await repo.signUpUser(user);
      console.log('USER ADDED', userAdded);

      // Aggiorno campo dell'id utente mongodb in cognito
      let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
        region: process.env.REGION || 'us-east-1'
      });
      var params = {
        UserAttributes: [
          {
            Name: 'custom:userId',
            Value: userAdded['_id'].toString()
          },
        ],
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: event.request.userAttributes.sub
      };
      await cognitoIdentityServiceProvider.adminUpdateUserAttributes(params).promise();

      //Creo un canale nel caso in cui l'utente e' di tipo cam

      if (user.userType === UserTypes.CamUser) {
        // Crea un canale IVS
        const ivs = new AWS.IVS({
          apiVersion: '2020-07-14',
          region: process.env.REGION || 'us-east-1'
        });
        const params = {
          latencyMode: 'LOW',
          name: userAdded['_id'].toString(),
          type: 'STANDARD'
        };
        const result = await ivs.createChannel(params).promise();
        console.log(result);
        let live = await repo.updateLiveInfo(userAdded._id, {
          channel: result.channel.arn,
          streamServerUrl: result.channel.ingestEndpoint,
          streamKey: result.streamKey.value,
          liveUrl: result.channel.playbackUrl
        });
        console.log(live);
      }

      //Invio email all'utente
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
