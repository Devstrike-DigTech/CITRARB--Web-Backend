import { Schema, model } from "mongoose";
import Rating from "./rating.interface";

const ratingSchema = new Schema<Rating> ({
    musicId: {
        type: String,
        ref: "Music",
        required: [true, 'Please provide the music you want to rate']
    },
    userId: {
        type: String,
        ref: "User",
        required: [true, 'Please provide the userId of the user'],
    },
    rating: {
        type: Number,
        min: [1, 'cannot be less than 1'],
        max: [5, "cannot be greater than 5"]
    }
})


export default model("ReactionMusic", ratingSchema)