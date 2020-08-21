/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {PlaceRepository} from "../../../repositories/PlaceRepository";
import {Lives} from "../../../interfaces/models/lives";
import {Live} from "../../../interfaces/models/live";
import {LiveRepository} from "../../../repositories/LiveRepository";
import {ActivityRepository} from "../../../repositories/ActivityRepository";
import {Activities} from "../../../interfaces/models/activities";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new ActivityRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const placeId = event.pathParameters.placeId;

    const page = parseInt(event.pathParameters.page) || 1;
    const limit = parseInt(event.pathParameters.limit) || 10;

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);

    try {
        let activities = await repo.getActivies(placeId, page, limit);
        let response:Activities = [];
        activities.map((activity) => {
            response.push({
                activityId: activity['_id'],
                name: activity.name,
                description: activity.description,
                date: activity.date,
                thumbnail: activity.thumbnail
            })
        });
        return responseManager.send(200, response);
    } catch (err) {
        console.log(err);
        return responseManager.send(501, {err});
    }
}
