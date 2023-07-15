import { DeckCollection } from '@apptypes/deck.type'
import { Document } from 'mongoose'

export class UserDTO extends Document {
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