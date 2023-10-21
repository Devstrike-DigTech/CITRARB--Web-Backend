import { Document } from "mongoose";


export default interface System extends Document {
    hookupStatus: 'active' | 'inactive'
}