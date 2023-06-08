import Joi from "joi";


const create = Joi.object({
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    confirmPassword: Joi.string().min(8).required(),
    phone: Joi.string(),
    gender: Joi.string().valid("male", "female").insensitive(),
})

const login = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
})

const update = Joi.object({
    photo: Joi.string(),
    username: Joi.string(),
    phone: Joi.string(),
    gender: Joi.string().valid("male", "female").insensitive(),
})

export default {create, login, update}