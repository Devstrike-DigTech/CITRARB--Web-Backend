import { Schema, model } from "mongoose";
import EyeWitness from "./eyeWitness.interface";

const eyeWitnessSchema = new Schema<EyeWitness>({
    videos: [
        {
            fileId: String,
            webContentLink: String
        }
    ],
    images: [
        {
            fileId: String,
            webContentLink: String
        }
    ],
    location: {
        type: String,
    },
    title: {
        type: String,
        required: [true, 'Enter a title']
    },
    description: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    ratingsQuantity: {
        type: Number,
    },
    avgRating: {
        type: Number
    },
})

export default model('EyeWitness', eyeWitnessSchema)