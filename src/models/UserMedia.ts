import {arrayProp, prop, Ref} from "@hasezoey/typegoose";
import {User} from "./User";
import {Media} from "./Media";

export class UserMedia {
  @prop({ required: true })
  user: Ref<User>;
  @prop({ required: true })
  postedAt: string;
  @arrayProp({ required: true})
  media: Media[];
}
