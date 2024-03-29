import ResponseManager from "../../../libs/ResponseManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {SecurityManager} from "../../../libs/SecurityManager";

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION || 'us-east-1'});
const signedUrlExpiresSeconds = 60*10;
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });

interface EventData {
    fileName: string
}


export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new UserRepository();
    let securityManager = new SecurityManager(repo, event);

    //Take variable from event
    const userId = event.pathParameters.userId;
    const body = JSON.parse(event.body);

    //Check if logged userId is same as path
    if(!await securityManager.isUserIdLogged())
        return responseManager.send(401);

    try{
        const params = { Bucket: process.env.PHOTOS_BUCKET_S3, Key: userId+"/profile-image/"+body.fileName, Expires: signedUrlExpiresSeconds, ContentType: body.fileType};
        const uploadUrl: string = await s3.getSignedUrl('putObject', params);

        if (!uploadUrl) {
            return { error: 'Unable to get presigned upload URL from S3' }
        }

        await repo.editProfileImage(userId, userId+"/profile-image/"+body.fileName);

        return responseManager.send(200, {presignedUrl: uploadUrl});
    } catch (err) {
        console.log(err);
        return responseManager.send(501);
    }
}
