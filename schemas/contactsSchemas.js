import Joi from "joi";


export const createContactSchema = Joi.object({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    phone: Joi.number().required()
})

export const updateContactSchema = Joi.object({
    name: Joi.string().min(2).max(30),
    email: Joi.string().email(),
    phone: Joi.number()
})

// module.exports = {
//     createContactSchema,
//     updateContactSchema
// }