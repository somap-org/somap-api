/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {SecurityManager} from "../../../libs/SecurityManager";
import * as CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import {ActivityRepository} from "../../../repositories/ActivityRepository";
import {LiveRepository} from "../../../repositories/LiveRepository";
import {PlaceRepository} from "../../../repositories/PlaceRepository";

/*
    Questa funzione elimina l'utente loggato
 */
export async function main(event) {
  let responseManager = new ResponseManager();
  let repo = new UserRepository();
  let activityRepository = new ActivityRepository();
  let liveRepository = new LiveRepository();
  let placeRepository = new PlaceRepository();
  let securityManager = new SecurityManager(repo, event);

  if(!await securityManager.isUserLogged())
    return responseManager.send(401);

  const loggedUser = await securityManager.getUserLogged()

  const deleteParams = {
    Username: (await securityManager.getUserLogged()).email,
    UserPoolId: process.env.COGNITO_USER_POOL_ID
  }

  try {
    let cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider({
      region: process.env.REGION || 'eu-central-1'
    });

    const result = await cognitoIdentityServiceProvider.adminDeleteUser(deleteParams).promise();

    if (await securityManager.isUserCam()) {
      const place = await placeRepository.getCamUserPlace(loggedUser)
      await placeRepository.deletePlace(place['_id'])
      await activityRepository.deleteActivityByPlaceId(place['_id'])
      await liveRepository.deleteLiveByPlaceId(place['_id'])
    }

    await repo.deleteUser(loggedUser['_id']);

    return result;
  } catch (e) {
    console.log(`error deleting user ${(await securityManager.getUserLogged()).email}: ${e}`)
    throw e;
  }

}
