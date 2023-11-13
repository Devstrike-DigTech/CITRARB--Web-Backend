import Joi from "joi";

const create = Joi.object({
    gender: Joi.string().valid("male", "female").required(),
})

const submit = Joi.object({
    image: Joi.string().required(),
})

const update = Joi.object({
    user: Joi.string().required(),
})

const setStatus = Joi.object({
    status: Joi.string().valid("active","inactive").required(),
})

export default {create, submit, update, setStatus}