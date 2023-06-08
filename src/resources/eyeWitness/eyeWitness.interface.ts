import { Document, ObjectId } from "mongoose";


export default interface EyeWitness extends Document {
    videos: string,
    images: string[],
    userId: ObjectId,
    location: string,
    title: string,
    description: string,
    isVerified: boolean,
    avgRating: number,
    ratingsQuantity: number
} 