import { Connection } from 'mongoose'
import { DATABASE_CONNECTION, REFRESH_TOKEN, REFRESH_TOKEN_MODEL } from '@database/constants'
import { RefreshTokenSchema } from './refresh-token.schema'

export const refreshTokenProviders = [
    {
        provide: REFRESH_TOKEN_MODEL,
        useFactory: (connection: Connection) => connection.model(REFRESH_TOKEN, RefreshTokenSchema),
        inject: [DATABASE_CONNECTION],
    },
]