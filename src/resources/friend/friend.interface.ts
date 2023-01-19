import { Document, ObjectId } from "mongoose";

export default interface Friend extends Document {
    friendId: ObjectId,
    userId: ObjectId,
    active: boolean
}