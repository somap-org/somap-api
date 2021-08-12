/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {PlaceRepository} from "../../../repositories/PlaceRepository";
import {Place} from "../../../interfaces/models/place";
var AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION || 'us-east-1'});
const signedUrlExpiresSeconds = 60*10;
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    console.log('RICHIESTA', event);
    let responseManager = new ResponseManager();
    let repo = new PlaceRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const placeId = event.pathParameters.placeId;

    //Prendi parametri dalla richiesta
    const body:Place = JSON.parse(event.body);

    if(!await securityManager.isUserLogged() || !await securityManager.isUserCamPlaceOwner(placeId))
        return responseManager.send(401);

    await userRepo.editUsername((await securityManager.getUserLogged())['_id'], body.userCam.username);

    //Costruisce documento da aggiungere nel db
    let newPlace = {
        name: body.name,
        description: body.description,
        address: body.address,
        location: {
            type: 'Point',
            coordinates: [
                parseFloat(body.coordinates.longitude.toString()),
                parseFloat(body.coordinates.latitude.toString())
            ]
        }
    };

    try {
        let place = await repo.editPlace(placeId, newPlace);

        let presignedUrl = null;
        if (place.camUser['publicProfile']['profileImage']) {
            const params = {
                Bucket: process.env.PHOTOS_BUCKET_S3,
                Key: place.camUser['publicProfile']['profileImage'],
                Expires: signedUrlExpiresSeconds
            };
            presignedUrl = await s3.getSignedUrl('getObject', params);
        }
        const responsePlace:Place = {
            name: place.name,
            description: place.description,
            currentLiveUrl: place.currentLiveUrl,
            address: place.address,
            coordinates: {
                latitude: place.location.coordinates[1],
                longitude: place.location.coordinates[0]
            },
            placeId: place['_id'],
            userCam: {
                userId: place.camUser['_id'],
                userType: place.camUser['userType'],
                username: place.camUser['publicProfile']['username'],
                profileImage: presignedUrl
            }
        };
        return responseManager.send(200, responsePlace);
    } catch (err) {
        return responseManager.send(501, {err});
    }
}
