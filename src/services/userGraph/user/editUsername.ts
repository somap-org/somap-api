/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {SecurityManager} from "../../../libs/SecurityManager";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new UserRepository();
    let securityManager = new SecurityManager(repo, event);

    console.log(event);

    //Take variable from event
    const userId = event.pathParameters.userId;
    const body = JSON.parse(event.body);
    const username = body.username;

    //Check if logged userId is same as path
    if(!await securityManager.isUserIdLogged())
        return responseManager.send(401);

    try{
        let user = await repo.editUsername(userId, username);
        return responseManager.send(200, {username: user.publicProfile.username});
    } catch (err) {
        console.log(err);
        return responseManager.send(501);
    }
}
