import { Connection } from 'mongoose'
import { UserSchema } from '@database/user/user.schema'
import { DATABASE_CONNECTION, USER_MODEL } from '@utils/constants'

export const userProviders = [
    {
        provide: USER_MODEL,
        useFactory: (connection: Connection) => connection.model('User', UserSchema),
        inject: [DATABASE_CONNECTION],
    },
]