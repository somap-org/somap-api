/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {UserPublicProfile} from "../../../interfaces/models/userPublicProfile";
import {SecurityManager} from "../../../libs/SecurityManager";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new UserRepository();
    let securityManager = new SecurityManager(repo, event);
    const userId = event.pathParameters.userId;

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);

    try {
        let userPublicProfile = await repo.getUserPublicProfile(userId);
        return responseManager.send(200, userPublicProfile);
    } catch (err) {
        return responseManager.send(501, {err});
    }
}
