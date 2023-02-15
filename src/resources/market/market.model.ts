import { Schema, model } from "mongoose";
import Market from "./market.interface";


const marketSchema = new Schema<Market> ({
    price: {
        type: Number,
        required: [true, 'Enter the price or price range for this product']
    },
    name: {
        type: String,
        required: [true, 'Enter the name of this product'],
    },
    category: {
        type: String,
        enum: ['Clothing', 'Electronics', 'Others']
    },
    images: {
        type: [String]
    },
    description: {
        type: String,
    },
    active: {
        type: Boolean,
        default: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'Enter userId']
    }
})

marketSchema.path('category').validate((values) => {
    let occupations = ['Clothing', 'Electronics', 'Others']
    occupations = occupations.map(el => el.toLowerCase())
    return occupations.includes(values.toLowerCase())
}, 'Invalid product category')  

export default model("Market", marketSchema)