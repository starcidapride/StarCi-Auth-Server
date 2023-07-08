import { REFRESH_TOKEN, USER } from '@database/constants'
import * as mongoose from 'mongoose'

export const RefreshTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        unique: true,
        required: true,
    }, 
    email: {
        type: String,
        ref: USER,
        unique: false,
        required: true,
    }, 

}, { collection: REFRESH_TOKEN, versionKey: false })