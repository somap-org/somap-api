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

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
*/
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new CommentRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);

    const commentId = event.pathParameters.commentId;

    if(!await securityManager.isUserLogged() || !await securityManager.isUserCommentOwner())
        return responseManager.send(401);

    try {
        let res = await repo.deleteComment(commentId);
        return responseManager.send(200);
    } catch (err) {
        console.log(err);
        return responseManager.send(501, {err});
    }
}
