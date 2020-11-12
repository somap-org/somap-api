/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {CommentRepository} from "../../../repositories/CommentRepository";
import {NewComment} from "../../../interfaces/models/newComment";
import {Comment} from "../../../interfaces/models/comment";
import {PlaceRepository} from "../../../repositories/PlaceRepository";
import {Place} from "../../../interfaces/models/place";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new PlaceRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const placeId = event.pathParameters.placeId;

    //Prendi parametri dalla richiesta
    const body:Place = JSON.parse(event.body);

    if(!await securityManager.isUserLogged() || !await securityManager.isUserCamPlaceOwner())
        return responseManager.send(401);

    //Costruisce documento da aggiungere nel db
    let newPlace = {
        name: body.name,
        description: body.description,
        address: body.address,
        location: {
            type: 'Point',
            coordinates: [
                body.coordinates.longitude,
                body.coordinates.latitude
            ]
        }
    };

    try {
        let place = await repo.editPlace(placeId, newPlace);

        const responsePlace:Place = {
            name: place.name,
            description: place.description,
            address: place.address,
            coordinates: {
                latitude: place.location.coordinates[1],
                longitude: place.location.coordinates[0]
            },
            placeId: place['_id']
        };
        return responseManager.send(200, responsePlace);
    } catch (err) {
        return responseManager.send(501, {err});
    }
}
