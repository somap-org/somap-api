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
var AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION || 'us-east-1'});
const signedUrlExpiresSeconds = 60*10;
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new ActivityRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const placeId = event.pathParameters.placeId;
    const activityId = event.pathParameters.activityId;

    //Prendi parametri dalla richiesta
    const requestActivity:Activity = JSON.parse(event.body);


    if(!await securityManager.isUserLogged() || !await securityManager.isUserCam() || !await securityManager.isUserCamPlaceOwner())
        return responseManager.send(401);

    //Costruisce documento da aggiungere nel db
    let editActivity = {
        name: requestActivity.name,
        description: requestActivity.description,
        date: requestActivity.date,
        place: placeId
    };

    try {
        let activity = await repo.editActivity(activityId, editActivity);

        let presignedUrl = null;
        if (activity.thumbnail) {
            const params = {
                Bucket: process.env.PHOTOS_BUCKET_S3,
                Key: activity.thumbnail,
                Expires: signedUrlExpiresSeconds
            };
            presignedUrl = await s3.getSignedUrl('getObject', params);
        }

        const response:Activity = {
            activityId: activity['_id'],
            name: activity.name,
            description: activity.description,
            date: activity.date,
            thumbnail: presignedUrl
        };

        return responseManager.send(200, response);
    } catch (err) {
        return responseManager.send(501, {err});
    }
}
