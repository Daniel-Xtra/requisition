import Joi from "joi";
import { IDivision } from "./IDivision";

export const DivisionValidationSchema = Joi.object().keys(<IDivision>{
  name: Joi.string().required(),
  abbreviation: Joi.string().required(),
});
