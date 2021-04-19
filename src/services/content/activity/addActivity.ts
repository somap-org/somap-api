/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {PlaceRepository} from "../../../repositories/PlaceRepository";
import {Place} from "../../../interfaces/models/place";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {LiveRepository} from "../../../repositories/LiveRepository";
import {Live} from "../../../interfaces/models/live";
import {ActivityRepository} from "../../../repositories/ActivityRepository";
import {Activity} from "../../../interfaces/models/activity";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new ActivityRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const placeId = event.pathParameters.placeId;

    //Prendi parametri dalla richiesta
    const requestActivity:Activity = JSON.parse(event.body);


    if(!await securityManager.isUserLogged() || !await securityManager.isUserCam() || !await securityManager.isUserCamPlaceOwner())
        return responseManager.send(401);

    //Costruisce documento da aggiungere nel db
    let addActivity = {
        name: requestActivity.name,
        description: requestActivity.description,
        date: requestActivity.date,
        thumbnail: requestActivity.thumbnail,
        place: placeId
    };

    try {
        let activity = await repo.addActivity(addActivity);

        const response:Activity = {
            activityId: activity['_id'],
            name: activity.name,
            description: activity.description,
            date: activity.date,
            thumbnail: activity.thumbnail
        };

        return responseManager.send(200, response);
    } catch (err) {
        return responseManager.send(501, {err});
    }
}

export async function deleteActivity(activityId: string){
    let repo = new ActivityRepository();
    try {
        await repo.deleteActivity(activityId);
        return true;
    } catch (e) {
        return null;
    }

}
