/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {UserSettings} from "../../../interfaces/models/userSettings";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const userId = event.pathParameters.userId;

    //Prendi parametri dalla richiesta
    const body:UserSettings = JSON.parse(event.body);

    if(!await securityManager.isUserLogged() || !await securityManager.isUserIdLogged())
        return responseManager.send(401);

    //Costruisce documento da aggiungere nel db
    let newUserSettings = {
        enableNotification: body.enableNotification,
        appearInPeopleHere: body.appearInPeopleHere,
        profilePrivacy: body.profilePrivacy
    };

    try {
        let user = await userRepo.editUserSettings(userId, newUserSettings);
        return responseManager.send(200, newUserSettings);
    } catch (err) {
        return responseManager.send(501, {err});
    }
}
