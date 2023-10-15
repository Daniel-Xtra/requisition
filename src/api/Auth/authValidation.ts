import Joi from "joi";

export const LoginValidationSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().required(),
  code: Joi.string(),
});

export const SignupValidationSchema = Joi.object().keys({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9._-]{3,16}$/i)
    .required(),
  password: Joi.string().min(6).max(32).required(),
  email: Joi.string().email().required(),
  phone_number: Joi.number().required(),
  gender: Joi.string().required(),
  date_of_birth: Joi.string().required(),
  membership_type: Joi.string(),
  code: Joi.string(),
});

export const RefreshTokensValidationSchema = Joi.object().keys({
  refreshToken: Joi.string().required(),
});
