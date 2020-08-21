import {arrayProp, prop, Ref, Typegoose} from "@hasezoey/typegoose";
import {User} from "./User";
import * as mongoose from "mongoose";

export class Post extends Typegoose {
    @prop({ required: true, ref: 'User' })
    profile: Ref<User>;
    @prop({ required: true, ref: 'User' })
    author: Ref<User>;
    @prop({ required: true })
    postedAt: string;
    @prop({ required: true })
    body: string;
    @arrayProp({ items: String, required: true })
    mediaUri: string[];
    @prop({ required: true })
    sharedCount: number;
    @prop({ required: true })
    commentsCount: number;
    @prop({ required: true })
    likesCount: number;
    @prop({ required: true, ref: 'Post' })
    sharedPost: Ref<Post>;
}

export const PostModel = new Post().getModelForClass(Post, {
    existingMongoose: mongoose,
    schemaOptions: {collection: 'posts'}
});
