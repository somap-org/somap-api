import { User, UserModel } from '../models/User';
import {connect} from "../libs/mongodb";
import * as mongoose from "mongoose";
import {UsersPublicProfile} from "../interfaces/models/usersPublicProfile";
import {FollowerModel} from "../models/Follower";
import {FollowingModel} from "../models/Following";


export class FollowRepository {
    constructor() {
        connect();
    }

    async getFollowers(id, page, limit): Promise<any> {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        return await FollowerModel.find({_t: id}).select("-_id _f").populate('_f').skip(startIndex).limit(endIndex);
    }
    async getFollowing(id, page, limit): Promise<any> {
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        return await FollowingModel.find({_t: id}).select("-_id _f").populate('_f').skip(startIndex).limit(endIndex);
    }
    async follow(userId, targetId): Promise<boolean> {
        try {
            if (!await FollowerModel.findOne({
                _f: userId,
                _t: targetId
            })) {

                if (await FollowerModel.create({
                    _f: userId,
                    _t: targetId
                })) {
                    await UserModel.findOneAndUpdate({
                        _id: userId
                    }, {
                        $inc: {
                            "publicProfile.following": 1
                        }
                    });
                }
                if (await FollowingModel.create({
                    _f: targetId,
                    _t: userId
                })) {
                    await UserModel.findOneAndUpdate({
                        _id: targetId
                    }, {
                        $inc: {
                            "publicProfile.followers": 1
                        }
                    });
                }
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return err;
        }
    }
    async unfollow(userId, targetId): Promise<boolean> {
        try {
            if(await FollowerModel.findOneAndDelete({
                _f: userId,
                _t: targetId
            })){
                await UserModel.findOneAndUpdate({
                    _id: userId
                }, {
                    $inc: {
                        "publicProfile.following": -1
                    }
                });
            }
            if(await FollowingModel.findOneAndDelete({
                _f: targetId,
                _t: userId
            })){
                await UserModel.findOneAndUpdate({
                    _id: targetId
                }, {
                    $inc: {
                        "publicProfile.followers": -1
                    }
                });
            }
            return true;
        } catch (err) {
            return err;
        }
    }
}
