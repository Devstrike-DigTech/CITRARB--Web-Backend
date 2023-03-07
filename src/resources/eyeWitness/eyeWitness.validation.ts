import Joi from "joi";

const create = Joi.object({
    description: Joi.string().min(25).max(350),
    title: Joi.string().required(),
    location: Joi.string().required(),
})

const update = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().min(25).max(350),
    location: Joi.string(),
})

export default {create, update}