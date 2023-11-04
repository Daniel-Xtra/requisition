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
  gender: Joi.string().required(),
  first_name: Joi.string().alphanum().max(30).allow("").optional(),
  last_name: Joi.string().alphanum().max(30).allow("").optional(),
  current_position: Joi.string(),
  membership_type: Joi.string(),
  code: Joi.string(),
});

export const RefreshTokensValidationSchema = Joi.object().keys({
  refreshToken: Joi.string().required(),
});
