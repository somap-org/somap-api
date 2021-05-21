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
export async function main(event) {
  let responseManager = new ResponseManager();
  let repo = new PlaceRepository();
  let userRepo = new UserRepository();
  let securityManager = new SecurityManager(userRepo, event);

  console.log(event);

  // Get search parameters
  let latitude = parseFloat(event.queryStringParameters?.latitude);
  let longitude = parseFloat(event.queryStringParameters?.longitude);
  let range = parseInt(event.queryStringParameters?.range);

  if (!await securityManager.isUserLogged())
    return responseManager.send(401);

  try {
    let places = await repo.getPlaces(latitude, longitude, range);
    let response: Places = new Array<Place>();

    for (const place of places) {
      let coordinates: PlaceCoordinates = {
        latitude: place.location.coordinates[1],
        longitude: place.location.coordinates[0]
      };
      response.push({
        placeId: place['_id'],
        name: place.name,
        description: place.description,
        address: place.address,
        coordinates: coordinates,
        userCam: {
          userId: place.camUser['_id'],
          userType: place.camUser['userType'],
          username: place.camUser['username'],
          profileImage: place.camUser['profileImage']
        }
      });
    }
    return responseManager.send(200, response);
  } catch (err) {
    console.log(err);
    return responseManager.send(501, {err});
  }
}
