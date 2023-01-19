import Joi from "joi";


const create = Joi.object({
    friend: Joi.string().required(),
    userId: Joi.string().required(),
})

export default {create}