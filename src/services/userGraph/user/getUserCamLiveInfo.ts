/* eslint-disable */
import ResponseManager from "../../../libs/ResponseManager";
import {UserRepository} from "../../../repositories/UserRepository";
import {SecurityManager} from "../../../libs/SecurityManager";
import {UserPublicProfile} from "../../../interfaces/models/userPublicProfile";
import {UserSettings} from "../../../interfaces/models/userSettings";
import {UserLiveConfiguration} from "../../../interfaces/models/userLiveConfiguration";


export async function main(event){
    let responseManager = new ResponseManager();
    let repo = new UserRepository();
    let securityManager = new SecurityManager(repo, event);

    //Take variable from event
    const userId = event.pathParameters.userId;

    //Check if logged userId is same as path
    if(!await securityManager.isUserIdLogged() || !await securityManager.isUserCam())
        return responseManager.send(401);

    let user = await repo.getUser(userId);

    try {
        let response:UserLiveConfiguration = {
            streamServerUrl: user.streamServerUrl,
            streamKey: user.streamKey,
            liveUrl: user.liveUrl
        };
        return responseManager.send(200, response);
        } catch(err){
       return responseManager.send(501, {err});
    };
}
