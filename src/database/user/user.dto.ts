import { DeckCollection } from '@apptypes/deck.type'
import { Document } from 'mongoose'

export class UserDTO extends Document {
    readonly email: string
    readonly password: string
    readonly username?: string
    readonly picture?: string
    readonly bio?: string
    readonly firstName: string
    readonly lastName: string
    readonly verified: boolean
    readonly refreshTokens?: string[]
    readonly deckCollection?: DeckCollection
}

export type UserParams = {
    email: string
    password: string
    username?: string
    picture?: string
    bio?: string
    firstName: string
    lastName: string
    verified: boolean
    refreshTokens?: string[]
    deckCollection?: DeckCollection
}