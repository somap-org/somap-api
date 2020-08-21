/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {Live} from "../../../interfaces/models/live";
import {LiveRepository} from "../../../repositories/LiveRepository";
import {ActivityRepository} from "../../../repositories/ActivityRepository";
import {Activity} from "../../../interfaces/models/activity";
import {Media} from "../../../interfaces/models/media";
import {PostRepository} from "../../../repositories/PostRepository";
import {Post} from "../../../interfaces/models/post";

export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new PostRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const postId = event.pathParameters.postId;

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);

    try {
        let post = await repo.getPost(postId);
        let response:Post = await repo.populatePost(post);
        return responseManager.send(200, response);
    } catch (err) {
        console.log(err);
        return responseManager.send(501, {err});
    }
}
