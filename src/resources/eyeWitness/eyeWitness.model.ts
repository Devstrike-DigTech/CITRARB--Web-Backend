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
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Enter userId']
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
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  })

eyeWitnessSchema.virtual('reactions', {
    foreignField: 'uploadId', 
    localField: '_id',
    ref: 'ReactionUpload'
})

export default model('EyeWitness', eyeWitnessSchema)