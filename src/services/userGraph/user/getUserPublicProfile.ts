/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {UserPublicProfile} from "../../../interfaces/models/userPublicProfile";
import {SecurityManager} from "../../../libs/SecurityManager";

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.REGION || 'us-east-1'});
const signedUrlExpiresSeconds = 60*10;
const s3 = new AWS.S3({ apiVersion: "2006-03-01" });
/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new UserRepository();
    let securityManager = new SecurityManager(repo, event);
    const userId = event.pathParameters.userId;

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);

    try {
        let userPublicProfile = await repo.getUserPublicProfile(userId);

        const params = { Bucket: process.env.PHOTOS_BUCKET_S3, Key: userPublicProfile.profileImage, Expires: signedUrlExpiresSeconds};
        userPublicProfile.profileImage = await s3.getSignedUrl('getObject', params);

        return responseManager.send(200, userPublicProfile);
    } catch (err) {
        return responseManager.send(501, {err});
    }
}
