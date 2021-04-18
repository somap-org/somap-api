import {prop, Ref, Typegoose} from "@hasezoey/typegoose";
import {Place} from "./Place";
import * as mongoose from "mongoose";

export class Live extends Typegoose {
  @prop({ required: true, ref: 'Place' })
  place: Ref<Place>;
  @prop({required: false})
  liveUrl: string;
  @prop({ required: true })
  createdAt: string;
}


export const LiveModel = new Live().getModelForClass(Live, {
  existingMongoose: mongoose,
  schemaOptions: {collection: 'lives'}
});
