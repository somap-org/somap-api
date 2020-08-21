import {prop, Ref, Typegoose} from "@hasezoey/typegoose";
import {Place} from "./Place";
import {Media} from "./Media";
import * as mongoose from "mongoose";
import {Live} from "./Live";

class Follower extends Typegoose {
  @prop({ required: true, ref: 'User' })
  _f: Ref<Place>;
  @prop({ required: true, ref: 'User' })
  _t: Ref<Place>;
}
export const FollowerModel = new Follower().getModelForClass(Follower, {
  existingMongoose: mongoose,
  schemaOptions: {collection: 'followers'}
});
