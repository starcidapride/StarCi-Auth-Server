import { Module } from '@nestjs/common'
import { userProviders } from '@database/user/user.provider'
import { UserService } from '@database/user/user.service'
import { JwtService } from '@nestjs/jwt'
import { DatabaseModule } from '@database/database.module'
import { JwtStrategy } from '@routes/auth/strategies/jwt.strategy'
import { DeckService } from './deck.service'
import { DeckController } from './deck.controller'

@Module({
    imports: [DatabaseModule],
    providers: [
        DeckService,
        UserService,
        JwtService,
        JwtStrategy,

        ...userProviders
    ],
    controllers: [DeckController]
})
export class DeckModule {}