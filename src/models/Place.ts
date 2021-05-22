import {index, prop, Ref, Typegoose} from "@hasezoey/typegoose";
import {User} from "./User";
import * as mongoose from "mongoose";

@index({ location: '2dsphere' })

export class Place extends Typegoose {
    //@prop() _id: Schema.Types.ObjectId;
    @prop({ required: false })
    name: string;
    @prop({ required: false })
    description: string;
    @prop({ required: false })
    address: string;
    @prop({ required: false, default: null })
    currentLiveUrl?: string;
    @prop({ required: false })
    location: {
        type: string,
        coordinates: [
          number,   //longitude
          number    //latitude
        ]
    };
    @prop({ ref: 'User', required: false })
    peapleHere: Ref<User>[];
    @prop({ ref: 'User' })
    camUser: Ref<User>;
}

export const PlaceModel = new Place().getModelForClass(Place, {
    existingMongoose: mongoose,
    schemaOptions: {collection: 'places'}
});
