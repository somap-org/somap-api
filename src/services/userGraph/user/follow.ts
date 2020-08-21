import ResponseManager from "../../../libs/ResponseManager";
import {FollowRepository} from "../../../repositories/FollowRepository";
import {UserRepository} from "../../../repositories/UserRepository";
import {SecurityManager} from "../../../libs/SecurityManager";

export async function main(event) {
    let responseManager = new ResponseManager();
    let repo = new FollowRepository();
    let userRepo = new UserRepository();
    let securityManager = new SecurityManager(userRepo, event);
    const userId = event.pathParameters.userId;
    const targetId = event.pathParameters.targetId;

    if(!await securityManager.isUserLogged() || !await securityManager.isUserIdLogged())
        return responseManager.send(401);

    try {
        if (await repo.follow(userId, targetId))
            return responseManager.send(200);
        else
            return responseManager.send(400);

    } catch (err) {
        console.log(err);
        return responseManager.send(501, {err});
    }
}
