import { Document, ObjectId } from "mongoose";

export default interface Market extends Document {
    name: string,
    images: string[],
    description: string,
    userId: ObjectId,
    price: number,
    category: string,
    active: Boolean,
}