import { USER } from '@database/constants'
import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    }, 
    password: {
        type: String,
        unique: false,
        required: true,
    },
    picture: {
        type: String,
        unique: false,
        required: false,
    },
    username: {
        type: String,
        unique: true,
        sparse: true
    },
    bio: {
        type: String,
        unique: false,
        required: false,
    },
    firstName: {
        type: String,
        unique: false,
        required: true,
    },
    lastName: {
        type: String,
        unique: false,
        required: true,
    },
    verified: {
        type: Boolean,
        unique: false,
        require: true
    }

}, { collection: USER, versionKey: false })