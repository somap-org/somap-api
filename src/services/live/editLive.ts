/* eslint-disable */
import ResponseManager from "../../libs/ResponseManager";
import {PlaceRepository} from "../../repositories/PlaceRepository";
import {Place} from "../../interfaces/models/place";
import {SecurityManager} from "../../libs/SecurityManager";
import {UserRepository} from "../../repositories/UserRepository";
import {LiveRepository} from "../../repositories/LiveRepository";
import {Live} from "../../interfaces/models/live";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new LiveRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const placeId = event.pathParameters.placeId;
    const liveId = event.pathParameters.liveId;

    //Prendi parametri dalla richiesta
    const body:Live = JSON.parse(event.body);


    if(!await securityManager.isUserLogged() || !await securityManager.isUserCam() || !await securityManager.isUserCamPlaceOwner())
        return responseManager.send(401);

    //Costruisce documento da aggiungere nel db
    let addLive = {
        createdAt: body.createdAt
    };

    try {
        let live = await repo.editLive(liveId, addLive);

        const response:Live = {
            createdAt: live.createdAt,
            liveUrl: live.liveUrl,
            liveId: live['_id']
        };

        return responseManager.send(200, response);
    } catch (err) {
        return responseManager.send(501, {err});
    }
}

export async function deleteLive(liveId: string){
    let repo = new LiveRepository();
    try {
        await repo.deleteLive(liveId);
        return true;
    } catch (e) {
        return null;
    }

}
