import { Document, ObjectId } from "mongoose";

export default interface Friend extends Document {
    friend: ObjectId,
    userId: ObjectId,
    active: boolean
}