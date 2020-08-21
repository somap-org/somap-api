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
import {NewPost} from "../../../interfaces/models/newPost";
import {Post} from "../../../interfaces/models/post";
import {PostRepository} from "../../../repositories/PostRepository";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new PostRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const postId = event.pathParameters.postId;

    //Prendi parametri dalla richiesta
    const body:NewPost = event.body;

    if(!await securityManager.isUserLogged() || !await securityManager.isUserPostOwner())
        return responseManager.send(401);

    //Costruisce documento da aggiungere nel db
    let newPost = {
        body: body.body,
        mediaUri: body.medias
    };

    try {
        let post = await repo.editPost(postId, newPost);
        let response:Post = await repo.populatePost(post);
        return responseManager.send(200, response);
    } catch (err) {
        return responseManager.send(501, {err});
    }
}
