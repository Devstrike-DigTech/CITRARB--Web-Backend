import { Document, ObjectId } from "mongoose";

interface Images {
    fileId: string,
    webContentLink: string
}

export default interface Market extends Document {
    name: string,
    images: Images[],
    description: string,
    userId: ObjectId,
    price: number,
    category: string,
    active: Boolean,
    isVerified: Boolean
}