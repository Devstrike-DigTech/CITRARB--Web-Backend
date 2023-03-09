import { Document, ObjectId } from "mongoose";

export default interface Rating extends Document {
    musicId: string,
    userId: string,
    rating: Number
}