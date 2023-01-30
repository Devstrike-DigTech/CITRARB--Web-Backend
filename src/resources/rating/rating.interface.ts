import { Document, ObjectId } from "mongoose";

export default interface Rating extends Document {
    eventId: string,
    userId: string,
    rating: Number
}