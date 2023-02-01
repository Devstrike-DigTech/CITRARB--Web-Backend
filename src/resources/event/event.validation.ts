import Joi from "joi";

const create = Joi.object({
    name: Joi.string().required(),
    time: Joi.date().required(),
    location: Joi.string().required(),
    description: Joi.string().min(25).max(250),
    coHost: Joi.array().items(Joi.string())
})

const update = Joi.object({
    name: Joi.string(),
    time: Joi.date(),
    location: Joi.string(),
    description: Joi.string().min(25).max(250),
    coHost: Joi.array().items(Joi.string())
})

export default {create, update}