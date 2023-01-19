import { Document, ObjectId } from "mongoose";

export default interface FriendRequest extends Document {
    userId: ObjectId,
    requester: ObjectId,
    status: string
}