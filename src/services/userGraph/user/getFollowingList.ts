import ResponseManager from "../../../libs/ResponseManager";
import {PlaceRepository} from "../../../repositories/PlaceRepository";
import {UserRepository} from "../../../repositories/UserRepository";
import {SecurityManager} from "../../../libs/SecurityManager";
import {FollowRepository} from "../../../repositories/FollowRepository";
import {PlaceCoordinates} from "../../../interfaces/models/placeCoordinates";
import {Place} from "../../../interfaces/models/place";
import {Places} from "../../../interfaces/models/places";
import {UsersPublicProfile} from "../../../interfaces/models/usersPublicProfile";

export async function main(event) {
    let responseManager = new ResponseManager();
    let repo = new FollowRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const userId = event.pathParameters.userId;

    const page = parseInt(event.pathParameters.page) || 1;
    const limit = parseInt(event.pathParameters.limit) || 10;

    if(!await securityManager.isUserLogged())
        return responseManager.send(401);

    try {
        let followers = await repo.getFollowing(userId, page, limit);
        let response:UsersPublicProfile = [];

        for (const follower of followers) {
            let user = follower._f;
            response.push({
                userId: user['_id'],
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
