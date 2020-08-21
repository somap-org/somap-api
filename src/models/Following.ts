import {prop, Ref, Typegoose} from "@hasezoey/typegoose";
import {Place} from "./Place";
import {Media} from "./Media";
import * as mongoose from "mongoose";
import {Live} from "./Live";

class Following extends Typegoose {
  @prop({ required: true, ref: 'User' })
  _f: Ref<Place>;
  @prop({ required: true, ref: 'User' })
  _t: Ref<Place>;
}
export const FollowingModel = new Following().getModelForClass(Following, {
  existingMongoose: mongoose,
  schemaOptions: {collection: 'following'}
});
