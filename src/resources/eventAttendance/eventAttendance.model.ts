import { Schema, model } from "mongoose";
import EventAttendance from "./eventAttendance.interface";

const eventAttendanceSchema = new Schema<EventAttendance> ({
    eventId: {
        type: Schema.Types.ObjectId,
        ref: 'Event',
        required: [true, "Provide the eventId"]
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Provide the userId"]
    },
    status: {
        type: String,
        enum: ['going', 'not going']
    }
})

export default model('EventAttendance', eventAttendanceSchema)