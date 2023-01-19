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
    description: {
        type: String,
        minlength: 25,
        maxlength: 150,
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

export default model('Occupation', occupationSchema)