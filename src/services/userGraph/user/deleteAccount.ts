/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {SecurityManager} from "../../../libs/SecurityManager";
import * as CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';

/*
    Questa funzione elimina l'utente loggato
 */
export async function main(event) {
  let responseManager = new ResponseManager();
  let repo = new UserRepository();
  let securityManager = new SecurityManager(repo, event);

  if(!await securityManager.isUserLogged())
    return responseManager.send(401);

  const deleteParams = {
    Username: (await securityManager.getUserLogged()).email,
    UserPoolId: process.env.COGNITO_CLIENT_ID
  }

  try {
    let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
      region: process.env.REGION || 'eu-central-1'
    });

    const result = await cognitoIdentityServiceProvider.adminDeleteUser(deleteParams).promise();
    return result;
  } catch (e) {
    console.log(`error deleting user ${(await securityManager.getUserLogged()).email}: ${e}`)
    throw e;
  }

}
