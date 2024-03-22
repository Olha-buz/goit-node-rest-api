import Joi from "joi";

export const registerSchema = Joi.object({
    password: Joi.string().min(4).required(),
    email: Joi.string().email().required(),
    subscription: Joi.string()
});

export const loginSchema = Joi.object({
    password: Joi.string().min(4).required(),
    email: Joi.string().email().required()
});

export const emailSchema = Joi.object({
    email: Joi.string().min(4).required()
});
