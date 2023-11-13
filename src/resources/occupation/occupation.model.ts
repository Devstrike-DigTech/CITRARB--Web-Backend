import { Schema, model } from "mongoose";
import Occupation from "./occupation.interface";

const occupationSchema = new Schema<Occupation>({
    name: {
        type: String,
        required: [true, "Please provide your contact name"]
    },
    jobTitle: {
        type: String,
        required: [true, "Please provide the Job Title."]
    },
    phone: {
        type: String,
        required: [true, "Please provide a phone number"]
    },
    category: {
        type: String,
        enum: ['Tech', 'Medical', 'Artisan', "Others"]
    },
    description: {
        type: String,
        minlength: 25,
        maxlength: 150,
    },
    location: {
        type: String,
    },
    yearsOfExperience: {
        type: String,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    active: {
        type: Boolean,
        default: true,
        select: false,
    }
})

occupationSchema.path('category').validate((values) => {
    let occupations = ['Tech', 'Service', 'Medical', 'Media', 'Business', 'Education', "Others"]
    occupations = occupations.map(el => el.toLowerCase())
    return occupations.includes(values.toLowerCase())
}, 'Invalid occupation category')   

export default model('Occupation', occupationSchema)