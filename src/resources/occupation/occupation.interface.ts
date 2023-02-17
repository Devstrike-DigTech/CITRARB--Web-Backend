import { Document, ObjectId } from "mongoose";

export default interface Occupation extends Document {
    name: string
    jobTitle: string,
    phone: string,
    description: string,
    active: boolean,
    userId: ObjectId,
    category: string,
    yearsOfExperience: string,
    location: string,
}