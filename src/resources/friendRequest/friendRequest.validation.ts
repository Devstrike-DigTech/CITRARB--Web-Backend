import Joi from "joi";


const create = Joi.object({
    userId: Joi.string().required(),
})

const update = Joi.object({
    status: Joi.string().required().valid('accepted', 'declined'),
})

export default {create, update}