import { Schema, model } from "mongoose";
import User from "./user.interface";
import bcrypt from 'bcryptjs'


const userSchema = new Schema<User> ({
    username: {
        type: String,
        required: [true, 'Please enter your first name.'],
        unique: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter your email.'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Please enter your password']
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user', 
    },
    photo: {
        type: String,
        default: "default.jpg"
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    phone: String,
    location: String,
}, {
    toJSON: {
        transform: function (doc, ret) {
          delete ret.password;
        },
      },
      timestamps: true
})

userSchema.pre('save', async function(next): Promise<void> {
    if(!this.isModified('password')) return next()

    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function(inputtedPassword:string) {
    return await bcrypt.compare(inputtedPassword, this.password)
}

//user deleted account
userSchema.pre(/^find/, function(next) {
    this.find({active: {$ne : false} })
    next()
  })

export default model('User', userSchema)