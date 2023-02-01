import { Document, ObjectId } from "mongoose";


export default interface Event extends Document {
    name: string,
    coHosts: ObjectId[],
    time: Date,
    host: ObjectId,
    avgRating: number,
    location: string,
    description: string,
    numberOfAttendee: number,
    ratingsQuantity: number,
    eventAttendance: ObjectId[]
}