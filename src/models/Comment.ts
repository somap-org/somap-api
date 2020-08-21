import {prop, Ref, Typegoose} from "@hasezoey/typegoose";
import {User} from "./User";
import {Live} from "./Live";
import * as mongoose from "mongoose";

export class Comment extends Typegoose {
  @prop({required: true})
  parent: string;
  @prop({required: true})
  parentType: string;
  @prop({required: true, ref: 'User'})
  author: Ref<User>;
  @prop({required: true})
  postedAt: string;
  @prop({required: true})
  body: string;
  @prop({ required: true })
  repliesCount: number;
  @prop({ required: true })
  likesCount: number;
}
export const CommentModel = new Comment().getModelForClass(Comment, {
  existingMongoose: mongoose,
  schemaOptions: {collection: 'comments'}
});

