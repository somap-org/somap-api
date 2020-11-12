import {index, prop, Ref, Typegoose} from "@hasezoey/typegoose";
import {User} from "./User";
import * as mongoose from "mongoose";

@index({ location: '2dsphere' })

export class Place extends Typegoose {
    //@prop() _id: Schema.Types.ObjectId;
    @prop({ required: true })
    name: string;
    @prop({ required: true })
    description: string;
    @prop({ required: true })
    address: string;
    @prop({ required: true })
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
