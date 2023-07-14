import { USER } from '@database/constants'
import mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    picture: {
        type: String,
        require: false
    },
    username: {
        type: String,
        sparse: true,
    },
    bio: {
        type: String,
        require: false
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
    },
    refreshTokens: { 
        type: [String],
        required: false,
        default: undefined
    },
    deckCollection: {
        type : new mongoose.Schema(
            {
                selectedDeckIndex: {
                    type: Number
                },
                decks: [
                    {
                        deckName: {
                            type: String,
                            required: true,
                        },
                        playDeck: {
                            type: [String],
                            required: true,
                        },
                        characterDeck: {
                            type: [String],
                            required: true,
                        },
                    }
                ]
            }
        ),
        require: false
    }, 

}
, { collection: USER, versionKey: false })