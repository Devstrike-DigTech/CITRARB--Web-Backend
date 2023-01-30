import Joi from "joi";

const create = Joi.object({
    eventId: Joi.string().required(),
    status: Joi.string().required().valid('going', 'not going'),
})

export default {create}