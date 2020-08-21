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
import {CommentRepository} from "../../../repositories/CommentRepository";
import {LikeRepository} from "../../../repositories/LikeRepository";

/*
    Questa funzione elimina il like inserito dall'utente userId al parente parentId.
*/
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new LikeRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    let parentId;
    let parentType;

    if (event.pathParameters.postId) {
        parentId = event.pathParameters.postId;
        parentType = repo.parentTypes.POST;
    }
    else if (event.pathParameters.commentId) {
        parentId = event.pathParameters.commentId;
        parentType = repo.parentTypes.COMMENT;
    } else {
        return responseManager.send(400);
    }

    const userId = event.pathParameters.userId;

    if(!await securityManager.isUserLogged() || !await securityManager.isUserLikeOwner())
        return responseManager.send(401);

    try {
        let res = await repo.deleteLike(parentId, parentType, userId);
        return responseManager.send(200);
    } catch (err) {
        console.log(err);
        return responseManager.send(501, {err});
    }
}
