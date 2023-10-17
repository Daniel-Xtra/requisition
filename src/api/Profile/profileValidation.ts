import Joi from "joi";
import { IProfile } from "./IProfile";

export const ProfileValidationSchema = Joi.object().keys(<IProfile>{
  current_position: Joi.any(),
});
