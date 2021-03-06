import { User, UserModel } from '../models/User';
import {connect} from "../libs/mongodb";
import * as mongoose from "mongoose";
import {UserPublicProfile} from "../interfaces/models/userPublicProfile";


export class UserRepository {
    constructor() {
        connect();
    }

    async getUser(id: string): Promise<User> {
        return UserModel.findOne({_id: id});
    }

    async getUserPublicProfile(id: string): Promise<UserPublicProfile> {
        const user = await UserModel.findOne({_id: id});
        let response:UserPublicProfile = {
            userId: user['_id'].toString(),
            userType: user.userType,
            username: user.publicProfile.username,
            profileImage: user.publicProfile.profileImage,
            followers: user.publicProfile.followers,
            following: user.publicProfile.following
        };
        return response;
    }

    async getUserByCognitoId(cognitoId: string): Promise<User> {
        return UserModel.findOne({cognitoId: cognitoId});
    }

    async signUpUser(user: User) {
        return UserModel.create(user);
    }

    async editUsername(userId: string, username: string): Promise<User> {
        return UserModel.findOneAndUpdate({_id: userId}, {"publicProfile.username": username}, {new: true})
    }

    async editUserSettings(userId, userSettings): Promise<User> {
        return UserModel.findOneAndUpdate({_id: userId}, {"settings": userSettings}, {new: true})
    }
    async deleteUser(userId: string) {
        return UserModel.deleteOne({"_id": userId});
    }
}
