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
import {PostRepository} from "../../../repositories/PostRepository";
import {Posts} from "../../../interfaces/models/posts";
import {Post} from "../../../interfaces/models/post";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new PostRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const profileId = event.pathParameters.userId;

    const page = parseInt(event.pathParameters.page) || 1;
    const limit = parseInt(event.pathParameters.limit) || 10;

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);

    try {
        let posts = await repo.getPosts(profileId, page, limit);
        let response:Posts = [];

        for (const post of posts) {
            let populatedPost = await repo.populatePost(post);
            response.push(populatedPost);
        }

        return responseManager.send(200, response);
    } catch (err) {
        console.log(err);
        return responseManager.send(501, {err});
    }
}
