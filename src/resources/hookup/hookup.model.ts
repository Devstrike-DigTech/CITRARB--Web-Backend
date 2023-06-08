import { Schema, model } from "mongoose";
import Hookup from "./hookup.interface";


const hookupSchema = new Schema<Hookup> ({
    date: {
        type: Date,
        required: [true, 'enter a date'],
        default: new Date()
    },
    images: [{
        id: String,
        image: String,
        isWinner: {
            type: Boolean,
            default: false
        }
    }],
    gender: {
        type: String,
        enum: ['male', 'female']
    }
})

export default model("Hookup", hookupSchema)