import Joi from "joi";

const create = Joi.object({
    description: Joi.string().min(25).max(350),
    title: Joi.string().required(),
})

const update = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().min(25).max(350),
})

export default {create, update}