/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {PlaceRepository} from "../../../repositories/PlaceRepository";
import {Place} from "../../../interfaces/models/place";
import {PlaceCoordinates} from "../../../interfaces/models/placeCoordinates";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {ObjectId} from "../../../interfaces/models/objectId";
import {UserPublicProfile} from "../../../interfaces/models/userPublicProfile";

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION || 'us-east-1'});
const signedUrlExpiresSeconds = 60*10;
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new PlaceRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const placeId = event.pathParameters.placeId;

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);

    try {
        let place = await repo.getPlace(placeId);
        let coordinates:PlaceCoordinates = {
            latitude: place.location.coordinates[1],
            longitude: place.location.coordinates[0]
        };

        let presignedUrl = null;
        if (place.camUser['publicProfile']['profileImage']) {
            const params = {
                Bucket: process.env.PHOTOS_BUCKET_S3,
                Key: place.camUser['publicProfile']['profileImage'],
                Expires: signedUrlExpiresSeconds
            };
            presignedUrl = await s3.getSignedUrl('getObject', params);
        }

        let response:Place = {
            placeId: place['_id'],
            currentLiveUrl: place.currentLiveUrl,
            name: place.name,
            description: place.description,
            address: place.address,
            coordinates: coordinates,
            userCam: {
                userId: place.camUser['_id'],
                userType: place.camUser['userType'],
                username: place.camUser['publicProfile']['username'],
                profileImage: presignedUrl
            }
        };
        return responseManager.send(200, response);
    } catch (err) {
        console.log(err);
        return responseManager.send(501, {err});
    }
}
