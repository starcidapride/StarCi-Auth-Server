import { Module } from '@nestjs/common'
import { userProviders } from '@database/user/user.provider'
import { UserService } from '@database/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@database/database.module'
import { refreshTokenProviders } from '@database/refreshToken/refresh-token.provider'
import { ProfileController } from './profile.controller'
import { ProfileService } from './profile.service'
import { JwtStrategy } from '@routes/auth/strategies/jwt.strategy'

@Module({
    imports: [DatabaseModule],
    providers: [
        ProfileService,
        UserService,
        JwtService,
        JwtStrategy,

        ...userProviders,
        ...refreshTokenProviders
    ],
    controllers: [ProfileController]
})
export class ProfileModule {}