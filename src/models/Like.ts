import {index, prop, Ref, Typegoose} from "@hasezoey/typegoose";
import {User} from "./User";
import * as mongoose from "mongoose";

@index({ parent: 1, parentType: 1 })

class Like extends Typegoose {
    @prop({required: true})
    parent: string;
    @prop({required: true})
    parentType: string;
    @prop({required: true, ref: 'User'})
    author: Ref<User>;
}
export const LikeModel = new Like().getModelForClass(Like, {
    existingMongoose: mongoose,
    schemaOptions: {collection: 'likes'}
});

