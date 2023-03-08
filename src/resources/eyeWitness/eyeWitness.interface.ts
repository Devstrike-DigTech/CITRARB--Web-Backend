import { Document, ObjectId } from "mongoose";

interface Files {
    fileId: string,
    webContentLink: string
}

export default interface EyeWitness extends Document {
    videos: Files[],
    images: Files[],
    userId: ObjectId,
    location: string,
    title: string,
    description: string,
    isVerified: boolean,
    avgRating: number,
    ratingsQuantity: number
} 