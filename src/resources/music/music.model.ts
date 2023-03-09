import { Schema, model } from "mongoose";
import Music from "./music.interface";

const musicSchema = new Schema<Music>({
    file: {
        fileId: String,
        webContentLink: String
    },
    title: {
        type: String,
        required: [true, 'Enter a title']
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Enter userId']
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
    }
})

export default model('Music', musicSchema)