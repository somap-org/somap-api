/* eslint-disable */
import ResponseManager from "../../libs/ResponseManager";
import {SecurityManager} from "../../libs/SecurityManager";
import {UserRepository} from "../../repositories/UserRepository";
import {PlaceRepository} from "../../repositories/PlaceRepository";
import {Lives} from "../../interfaces/models/lives";
import {Live} from "../../interfaces/models/live";
import {LiveRepository} from "../../repositories/LiveRepository";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new LiveRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const placeId = event.pathParameters.placeId;

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);

    try {
        let lives = await repo.getLives(placeId);
        let response:Lives = new Array<Live>();
        lives.map((live) => {
            response.push({
                createdAt: live.createdAt,
                liveId: live['_id']
            })
        });
        return responseManager.send(200, response);
    } catch (err) {
        console.log(err);
        return responseManager.send(501, {err});
    }
}
