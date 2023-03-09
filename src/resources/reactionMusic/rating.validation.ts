import Joi from "joi";


const create = Joi.object({
    rating: Joi.number().required().max(5).min(1),
})

export default {create}