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
var AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION || 'us-east-1'});
const signedUrlExpiresSeconds = 60*10;
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

/*
    Questa funzione deve restituire l'elenco completo di tutte le attivita' di un place
 */
export async function main(event){
    console.log('RICHIESTA', event);
    let responseManager = new ResponseManager();
    let repo = new ActivityRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const placeId = event.pathParameters.placeId;

    const type = event.queryStringParameters.type;
    const page = parseInt(event.queryStringParameters.page) || 1;
    const limit = parseInt(event.queryStringParameters.limit) || 10;

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);

    try {
        let activities = await repo.getActivies(placeId, type, page, limit);
        console.log(activities);
        let response:Activities = [];
        for (const activity of activities) {
            let presignedUrl = null;
            if (activity.thumbnail) {
                const params = {
                    Bucket: process.env.PHOTOS_BUCKET_S3,
                    Key: activity.thumbnail,
                    Expires: signedUrlExpiresSeconds
                };
                try {
                    presignedUrl = await s3.getSignedUrl('getObject', params);
                } catch (e) {
                    console.log('ERRORE PRESIGNED URL', e)
                }
            }

            response.push({
                activityId: activity['_id'],
                placeId: activity['place'].toString(),
                name: activity.name,
                description: activity.description,
                date: activity.date,
                thumbnail: presignedUrl
            })
        };
        return responseManager.send(200, response);
    } catch (err) {
        console.log(err);
        return responseManager.send(501, {err});
    }
}
