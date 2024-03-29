import Joi from "joi";


const create = Joi.object({
    jobTitle: Joi.string().required(),
    phone: Joi.string().required(),
    name: Joi.string().required(),
    category: Joi.string().required().valid('Tech', 'Service', 'Medical', 'Media', 'Business', 'Education', "Others").insensitive(),
    description: Joi.string().min(25).max(350),
    location: Joi.string(),
    yearsOfExperience: Joi.string()
})

const update = Joi.object({
    jobTitle: Joi.string(),
    phone: Joi.string(),
    name: Joi.string(),
    category: Joi.string().valid('Tech', 'Service', 'Medical', 'Media', 'Business', 'Education', "Others").insensitive(),
    description: Joi.string().min(25).max(350),
    location: Joi.string(),
    yearsOfExperience: Joi.string()
})

export default {create, update}