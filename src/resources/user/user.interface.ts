import { Document } from "mongoose";


export default interface User extends Document {
    username: string,
    email: string,
    password: string,
    role: string,
    photo: string,
    phone: string,
    active: boolean,
    gender: string
    comparePassword(inputedPassword:string):boolean
}