import * as mongoose from 'mongoose';
import {prop, Typegoose} from "@hasezoey/typegoose";

export enum UserTypes {
    CamUser = "camUser",
    ClassicUser = "classicUser"
}

export enum PrivacyTypes {
    public = "public",
    private = "private"
}

export class UserPublicProfile extends Typegoose {
    @prop({ required: true })
    username: string;
    @prop({ required: true })
    profileImage: string;
    @prop({ required: true })
    followers: number = 0;
    @prop({ required: true })
    following: number = 0;
}

export class UserSettings {
    @prop({ required: true })
    enableNotification: boolean;
    @prop({ required: true })
    appearInPeopleHere: boolean;
    @prop({ enum: PrivacyTypes, required: true })
    profilePrivacy: PrivacyTypes;
}

export class User extends Typegoose {
    @prop({ required: true })
    cognitoId: string;
    @prop({ enum: UserTypes, required: true })
    userType: UserTypes;
    @prop({ required: true })
    email: string;
    @prop({ required: false })
    instagram: string;
    @prop({ required: false })
    facebook: string;
    @prop({ required: true, _id: false })
    publicProfile: UserPublicProfile;
    @prop({ required: true, _id: false })
    settings: UserSettings;
}

export const UserModel = new User().getModelForClass(User, {
    existingMongoose: mongoose,
    //  had many problems without that definition of the collection name
    //  so better define it
    //                        |
    //                        v
    schemaOptions: {collection: 'users'}
});
