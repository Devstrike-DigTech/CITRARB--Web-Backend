import { Document, ObjectId } from "mongoose";

export default interface EventAttendance{
    eventId: String,
    userId: String,
    status: string,
}

export interface DTOEventAttendance {
    id: string,
    status: string,
    userId: String,
    eventId: String

}