import ResponseManager from "../../../libs/ResponseManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {SecurityManager} from "../../../libs/SecurityManager";
import {ActivityRepository} from "../../../repositories/ActivityRepository";

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION || 'us-east-1'});
const signedUrlExpiresSeconds = 60*10;
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

interface EventData {
    fileName: string
}


export async function main(event){
    let responseManager = new ResponseManager();
    let userRepo = new UserRepository();
    let repo = new ActivityRepository();
    let securityManager = new SecurityManager(userRepo, event);

    //Take variable from event
    const placeId = event.pathParameters.placeId;
    const activityId = event.pathParameters.activityId;
    const body = JSON.parse(event.body);

    //Check if logged userId is same as path
    if(!await securityManager.isUserLogged() || !await securityManager.isUserCamPlaceOwner())
        return responseManager.send(401);

    try{
        const params = { Bucket: process.env.PHOTOS_BUCKET_S3, Key: placeId+"/"+activityId+"/cover-image/"+body.fileName, Expires: signedUrlExpiresSeconds, ContentType: body.fileType};
        const uploadUrl: string = await s3.getSignedUrl('putObject', params);

        if (!uploadUrl) {
            return { error: 'Unable to get presigned upload URL from S3' }
        }

        await repo.editActivity(activityId, {
            thumbnail: placeId+"/"+activityId+"/cover-image/"+body.fileName
        });

        return responseManager.send(200, {presignedUrl: uploadUrl});
    } catch (err) {
        console.log(err);
        return responseManager.send(501);
    }
}
