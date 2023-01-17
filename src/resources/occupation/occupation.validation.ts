import Joi from "joi";


const create = Joi.object({
    jobTitle: Joi.string().required(),
    phone: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().min(25).max(150),
})

const update = Joi.object({
    jobTitle: Joi.string(),
    phone: Joi.string(),
    name: Joi.string(),
    description: Joi.string().min(25).max(150),
})

export default {create, update}