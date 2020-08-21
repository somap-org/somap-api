import {prop} from "@hasezoey/typegoose";

enum MediaType {
  VIDEO = "Video",
  PHOTO = "Photo"
}

export class Media {
  @prop({ required: true })
  type: MediaType;
  @prop({ required: true })
  mediaUri: string
}
