/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserRepository} from "../../../repositories/UserRepository";
import moment = require("moment");
import {CommentRepository} from "../../../repositories/CommentRepository";
import {NewComment} from "../../../interfaces/models/newComment";
import {Comment as CommentInterface} from "../../../interfaces/models/comment";
import {Comment} from "../../../models/Comment";
import {PostRepository} from "../../../repositories/PostRepository";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
 */
export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new CommentRepository();
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

    const authorId = await userRepo.getUserByCognitoId(event.requestContext?.identity?.cognitoIdentityId);

    //Prendi parametri dalla richiesta
    const body:NewComment = JSON.parse(event.body);

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);

    //Costruisce documento da aggiungere nel db
    let addComment = {
        author: authorId,
        parentType: parentType,
        parent: parentId,
        postedAt: moment().format(),
        body: body.body,
        repliesCount: 0,
        likesCount: 0,
        reply: false
    };

    try {
        let comment:Comment = await repo.addComment(addComment);
        let response:CommentInterface = await repo.populate(comment);
        return responseManager.send(200, response);
    } catch (err) {
        console.log(err);
        return responseManager.send(501, {err});
    }
}
