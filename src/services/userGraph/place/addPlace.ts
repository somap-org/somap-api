/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {PlaceRepository} from "../../../repositories/PlaceRepository";
import {Place} from "../../../interfaces/models/place";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserRepository} from "../../../repositories/UserRepository";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event) {
  let responseManager = new ResponseManager();
  let repo = new PlaceRepository();
  let userRepo = new UserRepository();
  let securityManager = new SecurityManager(userRepo, event);

  //Prendi parametri dalla richiesta
  const requestPlace: Place = JSON.parse(event.body);


  if (!await securityManager.isUserLogged() || !await securityManager.isUserCam())
    return responseManager.send(401);

  let userLogged = await userRepo.getUserByCognitoId(event.requestContext?.identity?.cognitoAuthenticationProvider.toString().slice(event.requestContext?.identity?.cognitoAuthenticationProvider.toString().lastIndexOf(':')+1));

  //Costruisce documento da aggiungere nel db
  let addPlace = {
    name: requestPlace.name,
    description: requestPlace.description,
    address: requestPlace.address,
    location: {
      type: 'Point',
      coordinates: [
        parseFloat(requestPlace.coordinates.longitude.toString()),
        parseFloat(requestPlace.coordinates.latitude.toString())
      ]
    },
    camUser: userLogged['_id']
  };

  try {
    let place = await repo.addPlace(addPlace);

    const responsePlace: Place = {
      name: place.name,
      description: place.description,
      address: place.address,
      coordinates: {
        latitude: place.location.coordinates[1],
        longitude: place.location.coordinates[0]
      },
      placeId: place['_id'],
      userCam: {
        userId: place.camUser['_id'],
        userType: place.camUser['userType'],
        username: place.camUser['username'],
        profileImage: place.camUser['profileImage']
      }
    };

    return responseManager.send(200, responsePlace);
  } catch (err) {
    return responseManager.send(501, {err});
  }
}

export async function deletePlace(placeId: string) {
  let repo = new PlaceRepository();
  try {
    await repo.deletePlace(placeId);
    return true;
  } catch (e) {
    return null;
  }

}
