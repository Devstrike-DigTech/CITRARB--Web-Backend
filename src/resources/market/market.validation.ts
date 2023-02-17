import Joi from "joi";


const create = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required().valid('Clothing', 'Electronics', 'Others').insensitive(),
    description: Joi.string().min(25).max(350),
    price: Joi.number().required(),
})

const update = Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required().valid('Clothing', 'Electronics', 'Others').insensitive(),
    description: Joi.string().min(25).max(350),
    price: Joi.number().required(),
})

export default {create, update}