import Joi from "joi";
import { IAdmin } from "./IAdmin";

export const PostValidationSchema = Joi.object().keys(<IAdmin>{
    title: Joi.string().regex(/[a-zA-Z0-9!?._\s]$/i).trim().max(80).required().error((err) => {
        return "Emojis are not allowed in the title field.";
    }),
    content: Joi.string().required(),
    slug: Joi.string(),
});
