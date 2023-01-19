import { Document, ObjectId } from "mongoose";

export default interface Friend extends Document {
    friend: ObjectId | string,
    userId: ObjectId | string,
    active: boolean
}