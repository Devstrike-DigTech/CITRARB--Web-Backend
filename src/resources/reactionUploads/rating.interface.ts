import { Document, ObjectId } from "mongoose";

export default interface Rating extends Document {
    uploadId: string,
    userId: string,
    rating: Number
}