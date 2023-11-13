import {Schema, model} from 'mongoose'
import System from './system.interface'


const systemSchema = new Schema<System>({
    hookupStatus: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    }
})

export default model("System", systemSchema)