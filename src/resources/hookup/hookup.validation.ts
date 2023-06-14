import Joi from "joi";

const create = Joi.object({
    gender: Joi.string().required(),
})

const submit = Joi.object({
    image: Joi.string().required(),
})

const update = Joi.object({
    user: Joi.string().required(),
})

export default {create, submit, update}