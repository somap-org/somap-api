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
import {CommentRepository} from "../../../repositories/CommentRepository";
import {Comments} from "../../../interfaces/models/comments";
import {LikeRepository} from "../../../repositories/LikeRepository";
import {UsersPublicProfile} from "../../../interfaces/models/usersPublicProfile";

/*
    Questa funzione deve restituire l'elenco completo di tutti gli utenti, ovvero un array contenente la rappresentazione json di tutti gli utenti
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

    const page = parseInt(event.pathParameters.page) || 1;
    const limit = parseInt(event.pathParameters.limit) || 10;

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);

    try {
        let likes = await repo.getLikes(parentId, parentType, page, limit);
        let response:UsersPublicProfile = [];

        for (const like of likes) {
            let user = like.author;
            response.push({
                userId: user['_id'].toString(),
                userType: user.userType,
                username: user.publicProfile.username,
                profileImage: user.publicProfile.profileImage,
                followers: user.publicProfile.followers,
                following: user.publicProfile.following
            });
        }

        return responseManager.send(200, response);
    } catch (err) {
        console.log(err);
        return responseManager.send(501, {err});
    }
}
