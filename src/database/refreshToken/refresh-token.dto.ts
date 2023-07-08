import { Document } from 'mongoose'

export class RefreshTokenDTO extends Document {
    readonly token: string
    readonly email: string
}

export type RefreshTokenParams = {
   token: string
   email: string
}