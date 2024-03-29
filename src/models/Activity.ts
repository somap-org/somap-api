import {prop, Ref, Typegoose} from "@hasezoey/typegoose";
import {Place} from "./Place";
import * as mongoose from "mongoose";
import {Live} from "./Live";

class Activity extends Typegoose {
  @prop({ required: true, ref: 'Place' })
  place: Ref<Place>;
  @prop({ required: true })
  name: string;
  @prop({ required: true })
  date: Date;
  @prop({ required: true })
  description: string;
  @prop({ required: false })
  thumbnail?: string;
}
export const ActivityModel = new Activity().getModelForClass(Activity, {
  existingMongoose: mongoose,
  schemaOptions: {collection: 'activities'}
});
