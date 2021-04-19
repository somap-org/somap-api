/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserPublicProfile} from "../../../interfaces/models/userPublicProfile";
import {UserSettings} from "../../../interfaces/models/userSettings";
import {LiveConfiguration} from "../../../interfaces/models/liveConfiguration";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new UserRepository();
    let securityManager = new SecurityManager(repo, event);

    //Take variable from event
    const userId = event.pathParameters.userId;

    //Check if logged userId is same as path
    if(!await securityManager.isUserIdLogged() || !await securityManager.isUserCam())
        return responseManager.send(401);

    let user = await repo.getUser(userId);

    try {
        let response:LiveConfiguration = {
            streamServerUrl: user.streamServerUrl,
            streamKey: user.streamKey,
            liveUrl: user.liveUrl
        };
        return responseManager.send(200, response);
        } catch(err){
       return responseManager.send(501, {err});
    };
}
