import { Schema, model } from "mongoose";
import Friend from "./friend.interface";


const friendSchema = new Schema<Friend>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    friend: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    active: {
        type: Boolean,
        default: true,
    }
},
// {
//     toJSON: { virtuals: true },
//     toObject: { virtuals: true },
//   }
  )

export default model('Friend', friendSchema)