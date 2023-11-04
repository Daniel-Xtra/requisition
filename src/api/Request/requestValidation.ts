import Joi from "joi";
import { IRequest } from "./IRequest";

export const DivisionValidationSchema = Joi.object().keys(<IRequest>{
  item: Joi.string().required(),
  qty_required: Joi.string().required(),
});
