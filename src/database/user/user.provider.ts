import { Connection } from 'mongoose'
import { UserSchema } from '@database/user/user.schema'
import { DATABASE_CONNECTION, USER, USER_MODEL } from '@database/constants'

export const userProviders = [
    {
        provide: USER_MODEL,
        useFactory: (connection: Connection) => connection.model(USER, UserSchema),
        inject: [DATABASE_CONNECTION],
    },
]