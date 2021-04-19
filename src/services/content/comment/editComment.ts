/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {CommentRepository} from "../../../repositories/CommentRepository";
import {NewComment} from "../../../interfaces/models/newComment";
import {Comment} from "../../../interfaces/models/comment";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new CommentRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const commentId = event.pathParameters.commentId;

    //Prendi parametri dalla richiesta
    const body:NewComment = JSON.parse(event.body);

    if(!await securityManager.isUserLogged() || !await securityManager.isUserCommentOwner())
        return responseManager.send(401);

    //Costruisce documento da aggiungere nel db
    let newComment = {
        body: body.body
    };

    try {
        let comment = await repo.editComment(commentId, newComment);
        let response:Comment = await repo.populate(comment);
        return responseManager.send(200, response);
    } catch (err) {
        return responseManager.send(501, {err});
    }
}
