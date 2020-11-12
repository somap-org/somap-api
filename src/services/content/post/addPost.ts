/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {Activity} from "../../../interfaces/models/activity";
import {PostRepository} from "../../../repositories/PostRepository";
import {Post} from "../../../interfaces/models/post";
import {Post as PostModel} from "../../../models/Post";
import {NewPost} from "../../../interfaces/models/newPost";
import moment = require("moment");

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new PostRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);

    const profileId = event.pathParameters.userId;
    const authorId = await userRepo.getUserByCognitoId(event.requestContext?.identity?.cognitoIdentityId);

    //Prendi parametri dalla richiesta
    const body:NewPost = JSON.parse(event.body);

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);
    //Costruisce documento da aggiungere nel db
    let addPost = {
        profile: profileId,
        author: authorId['_id'],
        postedAt: moment().format(),
        body: body.body,
        sharedCount: 0,
        commentsCount: 0,
        likesCount: 0,
        sharedPost: body.sharedPost
    };

    try {

        if(body.sharedPost) {
            await repo.incrementShare(body.sharedPost);
        }

        let post:PostModel = await repo.addPost(addPost);
        let response:Post = await repo.populatePost(post);
        return responseManager.send(200, response);
    } catch (err) {
        return responseManager.send(501, {err});
    }
}
