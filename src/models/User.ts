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
    @prop({ required: false })
    referralCode: string;
    @prop({ required: false })
    referralCodeUsed: string;
    @prop({required: false})
    channel: string;
    @prop({required: false})
    streamKey: string;
    @prop({required: false})
    streamServerUrl: string;
    @prop({required: false})
    liveUrl: string;
}

export const UserModel = new User().getModelForClass(User, {
    existingMongoose: mongoose,
    //  had many problems without that definition of the collection name
    //  so better define it
    //                        |
    //                        v
    schemaOptions: {collection: 'users'}
});
