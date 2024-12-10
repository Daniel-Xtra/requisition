import Joi from "joi";

export const LoginValidationSchema = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().required(),
  code: Joi.string(),
});

export const SignupValidationSchema = Joi.object().keys({
  password: Joi.string().min(6).max(32).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.number().required(),
  gender: Joi.string().allow("").optional(),
  first_name: Joi.string().alphanum().max(30).allow("").optional(),
  last_name: Joi.string().alphanum().max(30).allow("").optional(),
  current_position: Joi.string().allow("").optional(),
  membership_type: Joi.string().optional(),
  code: Joi.string(),
  division: Joi.string().required(),
});

export const RefreshTokensValidationSchema = Joi.object().keys({
  refreshToken: Joi.string().required(),
});
