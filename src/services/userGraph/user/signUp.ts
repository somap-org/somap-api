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

export async function main(event) {
    //console.log('START MAIN');
    if (event.request?.userAttributes?.email && event.request?.userAttributes['custom:userType']) {
        //console.log('EMAIL AND USER TYPE FOUND', event.request.userAttributes.email, event.request?.userAttributes['custom:userType']);
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
        } else {
            //console.log('ERRORE: custom:userType non definito o errato');
            return null;
        }

        //console.log('BUILDED USER', user);

        try {
            let userAdded = await repo.signUpUser(user);
            //console.log('USER ADDED', userAdded);
            return userAdded;
        } catch (e) {
            console.log('ERROR ADDING USER', e);
            return null;
        }

    } else {
        console.log('ERROR EMAIL OR USER TYPE NOT FOUND');
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
