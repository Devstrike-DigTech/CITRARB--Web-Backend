import { Schema, model } from "mongoose";
import FriendRequest from "./friendRequest.interface";


const friendRequestSchema = new Schema<FriendRequest>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    requester: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'declined'],
        default: 'pending'

    }
})


export default model('FriendRequest', friendRequestSchema)