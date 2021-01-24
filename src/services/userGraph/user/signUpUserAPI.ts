import ResponseManager from "../../../libs/ResponseManager";
import * as CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import moment = require("moment");

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
  let responseManager = new ResponseManager();

  //Take variable from event
  const body = JSON.parse(event.body);

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
      ],
    };
    //console.log('params', params);
    let newCamUser = await cognitoIdentityServiceProvider.signUp(params).promise();

    console.log(newCamUser);

    return responseManager.send(200);
  } catch (err) {
    console.log(err);
    return responseManager.send(501);
  }
}
