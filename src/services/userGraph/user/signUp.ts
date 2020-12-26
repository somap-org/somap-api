import {UserTypes} from "../../../models/User";
import {UserRepository} from "../../../repositories/UserRepository";
import {sign} from "crypto";

interface CognitoData {
    userName: string;
    request: {
        userAttributes: {
            email: string;
            'custom:userType': string;
            sub: string;
        }
    },
    response: {
        autoConfirmUser: boolean;
        autoVerifyPhone: boolean;
        autoVerifyEmail: boolean;
    }
}

export async function main(event, context, callback) {

    if (event.request?.userAttributes?.email && event.request?.userAttributes['custom:userType']) {
        let repo = new UserRepository();
        let user;

        let userPublicProfile = {
            profileImage: "test",
            username: event.request.userAttributes.email.substring(0, event.request.userAttributes.email.indexOf("@")),
            followers: 0,
            following: 0,
        };

        let userSettings = {
            enableNotification: true,
            appearInPeopleHere: true,
            receiveComment: true,
            profilePrivacy: "public"
        };

        user = {
            cognitoId: event.request.userAttributes.sub.toString(),
            email: event.request.userAttributes.email,
            instagram: null,
            facebook: null,
            publicProfile: userPublicProfile,
            settings: userSettings
        };

        if(event.request.userAttributes['custom:userType'] == "classicUser"){
            user.userType = UserTypes.ClassicUser;
        } else if (event.request.userAttributes['custom:userType'] == "camUser") {
            user.userType = UserTypes.CamUser;
        } else
            return null;

        try {
            await repo.signUpUser(user);
            callback(null, event);
        } catch (e) {
            return null;
        }

    } else {
        return null;
    }
}

export async function deleteUser(userId: string){
    let repo = new UserRepository();
    try {
        await repo.deleteUser(userId);
        return true;
    } catch (e) {
        return null;
    }

}
