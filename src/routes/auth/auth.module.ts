import { Module } from '@nestjs/common'
import { AuthService } from '@routes/auth/auth.service'
import { AuthController } from '@routes/auth/auth.controller'
// import { LocalStrategy } from '@routes/auth/strategies/local.strategy'
// import { JwtStrategy } from '@routes/auth/strategies/jwt.strategy'
// import { JwtService } from '@nestjs/jwt'
// import { CryptoService } from '@utils/sha256.service'
// import { MailerService } from './mailer/mailer.service'

@Module({
    imports: [],
    providers: [
        AuthService, 
    ],
    controllers: [AuthController]
})
export class AuthModule {}