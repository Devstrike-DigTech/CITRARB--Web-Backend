import { Schema, model } from "mongoose";
import Event from "./event.interface";


const eventSchema = new Schema<Event>({
    name: {
        type: String,
        required: [true, "Please provide the name of this event"]
    },
    coHosts: {
        type: [Schema.Types.ObjectId],
        ref: "User"
    },
    image: String,
    time: {
        type: Date,
        required: [true, "Provide a date for this event"]
    },
    location: {
        type: String,
        required: [true, "Provide a location where this event will take place"]
    },
    host: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Please provide the id userId of the host"]
    },
    description: {
        type: String,
    },
    numberOfAttendee: {
        type: Number,
        default: 0,
    },
    ratingsQuantity: {
        type: Number,
    },
    avgRating: {
        type: Number
    },
    eventAttendance: {
        type: [Schema.Types.ObjectId]
    }
},
{
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

export default model('Event', eventSchema)