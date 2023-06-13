import { Document, ObjectId } from "mongoose";

interface Files {
    fileId: string,
    webContentLink: string
}

export default interface Music extends Document {
    file: Files,
    userId: ObjectId,
    title: string,
    description: string,
    isVerified: boolean,
    avgRating: number,
    ratingsQuantity: number,
    image: string
}