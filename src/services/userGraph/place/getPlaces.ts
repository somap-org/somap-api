/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {PlaceRepository} from "../../../repositories/PlaceRepository";
import {Place} from "../../../interfaces/models/place";
import {PlaceCoordinates} from "../../../interfaces/models/placeCoordinates";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {Places} from "../../../interfaces/models/places";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new PlaceRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);

    // Get search parameters
    let latitude = event.query?.latitude;
    let longitude = event.query?.longitude;
    let range = event.query?.range;

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);

    try {
        let places = await repo.getPlaces(latitude, longitude, range);
        let response:Places = new Array<Place>();

        for (const place of places) {
            let coordinates:PlaceCoordinates = {
                latitude: place.location.coordinates.latitude,
                longitude: place.location.coordinates.longitude
            };
            response.push({
                placeId: place['_id'],
                name: place.name,
                description: place.description,
                address: place.address,
                coordinates: coordinates,
            });
        }
        return responseManager.send(200, response);
    } catch (err) {
        console.log(err);
        return responseManager.send(501, {err});
    }
}
