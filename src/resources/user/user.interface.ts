import { Document } from "mongoose";


export default interface User extends Document {
    username: string,
    email: string,
    password: string,
    role: string,
    photo: string,
    active: boolean,
    comparePassword(inputedPassword:string):boolean
}