import Joi from "joi";
import { IProfile } from "./IProfile";

export const ProfileValidationSchema = Joi.object().keys(<IProfile> {
    religion: Joi.any(),
    sexual_orientation: Joi.any(),
    relationship_status: Joi.any(),
    occupation: Joi.any(),
    ethnic_group: Joi.any(),
    location: Joi.any(),
    highest_education: Joi.any(),
    current_education: Joi.any(),
    bio: Joi.any(),
    facebook_url: Joi.any(),
    twitter_url: Joi.any(),
    instagram_url: Joi.any(),
    snapchat_id: Joi.any(),
});
