import {UserRepository} from "../repositories/UserRepository";
import {UserTypes} from "../models/User";
import {PlaceRepository} from "../repositories/PlaceRepository";
import {PostRepository} from "../repositories/PostRepository";
import {CommentRepository} from "../repositories/CommentRepository";

export class SecurityManager {
    repo: UserRepository;
    event: any;

    constructor(userRepository: UserRepository, event: any) {
        this.repo = userRepository;
        this.event = event;
    }

    async isUserIdLogged(): Promise<boolean> {
        if (typeof this.event.requestContext?.identity?.cognitoIdentityId == "undefined")
            return false;

        let user = await this.repo.getUserByCognitoId(this.event.requestContext?.identity?.cognitoIdentityId);
        if (!user) {
            //console.log("User not found");
            return false;
        }
        if (user['_id'].toString() == this.event.pathParameters?.userId.toString()) {
            //console.log("Authorized");
            return true;
        }
        else {
            //console.log("Not Authorized: "+user['_id']+"-"+this.event.pathParameters.userId);
            return false;
        }
        return false;
    }

    async isUserLogged(): Promise<boolean> {
        if (typeof this.event.requestContext?.identity?.cognitoIdentityId == undefined)
            return false;

        let user = await this.repo.getUserByCognitoId(this.event.requestContext?.identity?.cognitoIdentityId);
        if (!user) {
            //console.log("User not found");
            return false;
        } else {
            //console.log("Authorized");
            return true
        }
    }

    async isUserCam(): Promise<boolean> {
        if (typeof this.event.requestContext?.identity?.cognitoIdentityId == undefined)
            return false;

        let user = await this.repo.getUserByCognitoId(this.event.requestContext?.identity?.cognitoIdentityId);
        if (!user) {
            //console.log("User not found");
            return false;
        } else {
            //console.log("Authorized");
            if (user.userType == UserTypes.CamUser)
                return true;
            else
                return false;
        }
    }

    async isUserClassic(): Promise<boolean> {
        if (typeof this.event.requestContext?.identity?.cognitoIdentityId == undefined)
            return false;

        let user = await this.repo.getUserByCognitoId(this.event.requestContext?.identity?.cognitoIdentityId);
        if (!user) {
            //console.log("User not found");
            return false;
        } else {
            //console.log("Authorized");
            if (user.userType == UserTypes.ClassicUser)
                return true;
            else
                return false;
        }
    }

    async isUserCamPlaceOwner(): Promise<boolean> {
        let placeRepo = new PlaceRepository();
        if (
            typeof this.event.requestContext?.identity?.cognitoIdentityId == "undefined" ||
            typeof this.event.pathParameters?.placeId == "undefined"
        )
            return false;

        let user = await this.repo.getUserByCognitoId(this.event.requestContext?.identity?.cognitoIdentityId);
        let place = await placeRepo.getPlace(this.event.pathParameters?.placeId.toString());

        if (!user || !place) {
            //console.log("User or place not found");
            return false;
        }
        if (user['_id'].toString() == place.camUser.toString()) {
            //console.log("Authorized");
            return true;
        }
        else {
            //console.log("Not Authorized: "+user['_id']+"-"+place.camUser.toString());
            return false;
        }
        return false;
    }

    async isUserPostOwner(): Promise<boolean> {
        let postRepo = new PostRepository();
        if (
            typeof this.event.requestContext?.identity?.cognitoIdentityId == "undefined" ||
            typeof this.event.pathParameters?.postId == "undefined"
        )
            return false;

        let user = await this.repo.getUserByCognitoId(this.event.requestContext?.identity?.cognitoIdentityId);
        let post = await postRepo.getPost(this.event.pathParameters?.postId);
        if (user['_id'].toString() == post.author.toString()) {
            //console.log("Authorized");
            return true;
        }
        else {
            //console.log("Not Authorized: "+user['_id']+"-"+place.camUser.toString());
            return false;
        }
        return false;
    }

    async isUserCommentOwner(): Promise<boolean> {
        let commentRepo = new CommentRepository();
        if (
            typeof this.event.requestContext?.identity?.cognitoIdentityId == "undefined" ||
            typeof this.event.pathParameters?.commentId == "undefined"
        )
            return false;

        let user = await this.repo.getUserByCognitoId(this.event.requestContext?.identity?.cognitoIdentityId);
        let comment = await commentRepo.getComment(this.event.pathParameters?.commentId);
        if (user['_id'].toString() == comment.author.toString()) {
            //console.log("Authorized");
            return true;
        }
        else {
            //console.log("Not Authorized: "+user['_id']+"-"+place.camUser.toString());
            return false;
        }
        return false;
    }


    async isUserLikeOwner(): Promise<boolean> {
        let commentRepo = new CommentRepository();
        if (
            typeof this.event.requestContext?.identity?.cognitoIdentityId == "undefined" ||
            typeof this.event.pathParameters?.userId == "undefined"
        )
            return false;

        let user = await this.repo.getUserByCognitoId(this.event.requestContext?.identity?.cognitoIdentityId);
        if (user['_id'].toString() == this.event.pathParameters.userId.toString()) {
            //console.log("Authorized");
            return true;
        }
        else {
            //console.log("Not Authorized: "+user['_id']+"-"+place.camUser.toString());
            return false;
        }
        return false;
    }

}
