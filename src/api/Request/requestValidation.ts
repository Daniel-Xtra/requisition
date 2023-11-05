import Joi from "joi";

export const IctValidationSchema = Joi.object().keys({
  qty_approved: Joi.string().required(),
  comment: Joi.string().allow(""),
});

export const StoreValidationSchema = Joi.object().keys({
  qty_issued: Joi.string().required(),
});

export const RequestValidationSchema = Joi.object().keys({
  requests: Joi.array().items({
    item: Joi.string().required(),
    qty_required: Joi.string().required(),
    purpose: Joi.string().allow(""),
  }),
});
