import { Document, ObjectId } from "mongoose";


export default interface EyeWitness extends Document {
    video: string,
    images: string[],
    userId: ObjectId,
    location: string,
    title: string,
    description: string,
    isVerified: boolean,
    avgRating: number,
    ratingsQuantity: number
} 