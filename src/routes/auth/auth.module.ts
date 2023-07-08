import { Module } from '@nestjs/common'
import { AuthService } from '@routes/auth/auth.service'
import { AuthController } from '@routes/auth/auth.controller'
import { userProviders } from '@database/user/user.provider'
import { CryptoService } from '@utils/sha256.service'
import { UserService } from '@database/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@database/database.module'
import { LocalStrategy } from '@routes/auth/strategies/local.strategy'
import { refreshTokenProviders } from '@database/refreshToken/refresh-token.provider'
import { RefreshTokenService } from '@database/refreshToken/refresh-token.service'
import { MailerService } from './mailer/mailer.service'

// import { MailerService } from './mailer/mailer.service'

@Module({
    imports: [DatabaseModule],
    providers: [
        AuthService,
        CryptoService,
        UserService,
        JwtService,
        LocalStrategy,
        RefreshTokenService,
        MailerService,

        ...userProviders,
        ...refreshTokenProviders
    ],
    controllers: [AuthController]
})
export class AuthModule {}