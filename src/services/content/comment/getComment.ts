/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {Comment} from "../../../interfaces/models/comment";
import {CommentRepository} from "../../../repositories/CommentRepository";

export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new CommentRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const commentId = event.pathParameters.commentId;

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);

    try {
        let comment = await repo.getComment(commentId);
        if (!comment) {
            return responseManager.send(404);
        }
        let response:Comment = await repo.populate(comment);
        return responseManager.send(200, response);
    } catch (err) {
        console.log(err);
        return responseManager.send(501, {err});
    }
}
