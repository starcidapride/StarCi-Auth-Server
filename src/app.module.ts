import { Module } from '@nestjs/common'
import { AuthModule } from '@routes/auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import cryptoConfig from '@config/crypto.config'
import jwtConfig from '@config/jwt.config'
import mailerConfig from '@config/mailer.config'
import serverConfig from '@config/server.config'
import databaseConfig from '@config/database.config'

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [
                cryptoConfig,
                jwtConfig,
                mailerConfig,
                databaseConfig,
                serverConfig
            ]}),
        AuthModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
