import Joi from "joi";


const create = Joi.object({
    friendId: Joi.string().required(),
    userId: Joi.string().required(),
})

export default {create}