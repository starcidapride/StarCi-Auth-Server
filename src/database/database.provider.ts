import * as mongoose from 'mongoose'
import databaseConfig from '@config/database.config'
import { DATABASE_CONNECTION } from '@database/constants'

export const databaseProviders = [
    {
        provide: DATABASE_CONNECTION,
        useFactory: (): Promise<typeof mongoose> =>
            mongoose.connect(databaseConfig().databaseUri)
                .then(() => {
                    return mongoose
                })
                .catch((error) => {
                    throw error
                })
    },
]

