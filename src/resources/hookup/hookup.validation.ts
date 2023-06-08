import Joi from "joi";


const submit = Joi.object({
    image: Joi.string().required(),
})

const update = Joi.object({
    user: Joi.string().required(),
})

export default {submit, update}