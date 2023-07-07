import { Module } from '@nestjs/common'
import { AuthService } from '@routes/auth/auth.service'
import { AuthController } from '@routes/auth/auth.controller'
import { userProviders } from '@database/user/user.provider'
import { CryptoService } from '@utils/sha256.service'
import { UserService } from '@database/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@database/database.module'
import cryptoConfig from '@config/crypto.config'
import jwtConfig from '@config/jwt.config'
import { LocalStrategy } from '@routes/auth/strategies/local.strategy'

// import { MailerService } from './mailer/mailer.service'

@Module({
    imports: [DatabaseModule],
    providers: [
        AuthService,
        CryptoService,
        UserService,
        JwtService,
        LocalStrategy,
        ...userProviders
    ],
    controllers: [AuthController]
})
export class AuthModule {}