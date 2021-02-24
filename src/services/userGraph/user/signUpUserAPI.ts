import ResponseManager from "../../../libs/ResponseManager";
import * as CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import moment = require("moment");
import {UserRepository} from "../../../repositories/UserRepository";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
  let responseManager = new ResponseManager();
  let userRepository = new UserRepository();

  //Take variable from event
  const body = JSON.parse(event.body);

  if (body.referralCode !== null && body.referralCode !== '' && await userRepository.getUserByReferralCode(body.referralCode) === null)
    return responseManager.send(400, {
      code: "InvalidReferralCode",
      message: "Invalid Referral code"
    });


  try{

    let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
      region: process.env.REGION || 'eu-central-1'
    });
    var params = {
      ClientId: '67kp8e31k2cg4828hp93rurtp3', /* required */
      Password: body.password, /* required */
      Username: body.email, /* required */
      UserAttributes: [
        {
          Name: 'custom:userType',
          Value: body.userType
        },
        {
          Name: 'name',
          Value: body.username
        },
        {
          Name: 'custom:termsConditions',
          Value: moment().format()
        },
        {
          Name: 'custom:privacyCookiePolicy',
          Value: moment().format()
        },
        {
          Name: 'custom:referralCode',
          Value: body.referralCode
        },
      ],
    };
    //console.log('params', params);
    let newCamUser = await cognitoIdentityServiceProvider.signUp(params).promise();

    console.log(newCamUser);

    return responseManager.send(200);
  } catch (err) {
    console.log(err);
    if (err.code==='UsernameExistsException')
      return responseManager.send(400, {
        code: "UsernameExistsException",
        message: "Email already exists"
      });
    return responseManager.send(501);
  }
}
