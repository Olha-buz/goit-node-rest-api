import Joi from "joi";


export const createContactSchema = Joi.object({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    phone: Joi.number().required(),
    favorite: Joi.boolean().default(false)
}).options({ stripUnknown: true })

export const updateContactSchema = Joi.object({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
    phone: Joi.number(),
    favorite: Joi.boolean().default(false)
}).options({ stripUnknown: true })

export const updateFavoriteSchema = Joi.object({
    favorite: Joi.boolean()
}).options({ stripUnknown: true })