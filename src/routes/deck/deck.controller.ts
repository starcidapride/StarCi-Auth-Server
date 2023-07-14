import { Controller, UseGuards, Put, Body, UseInterceptors } from '@nestjs/common'
import { UserDTO } from '@database/user/user.dto'
import { UserDecorator } from '@decorators/user.decorator'
import { PresentableUser } from '@apptypes/auth.type'
import { JwtAuthGuard } from '@routes/auth/guards/jwt.guard'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { DeckService } from '@routes/deck/deck.service'
import { AlterCardRequest, Deck } from '@apptypes/deck.type'
import { AlterCardBodyApi, AddDeckBodyApi } from './swagger/deck.property'
import { AddDeckGuard } from '@routes/deck/guards/add-deck.guard'
import { AlterCardGuard } from '@routes/deck/guards/alter-card-guard'
import { AlterCardInterceptor } from '@routes/deck/interceptors/alter-card.interceptor'

@ApiTags('Deck')
@Controller('api/deck')
export class DeckController {
    constructor(
        private readonly deckService: DeckService
    ) { }

    @ApiBearerAuth()
    @ApiBody({ type: AddDeckBodyApi })
    @UseGuards(AddDeckGuard, JwtAuthGuard)
    @Put('add-deck')
    async handleAddDeck(@UserDecorator() user: UserDTO, @Body() body: Deck): Promise<PresentableUser> {
        return await this.deckService.processAddDeck(user.email, body)
    }

    @ApiBearerAuth()
    @ApiBody({ type: AlterCardBodyApi })
    @UseGuards(AlterCardGuard, JwtAuthGuard)
    @UseInterceptors(AlterCardInterceptor)
    @Put('add-play-card')
    async handleAddPlayCard(@UserDecorator() user: UserDTO, @Body() body: AlterCardRequest): Promise<PresentableUser> {
        return await this.deckService.processAddCard(user.email, body.deckName, 'play', body.cardName)
    }

    @ApiBearerAuth()
    @ApiBody({ type: AlterCardBodyApi })
    @UseGuards(AlterCardGuard, JwtAuthGuard)
    @UseInterceptors(AlterCardInterceptor)
    @Put('add-character-card')
    async handleAddCharacterCard(@UserDecorator() user: UserDTO, @Body() body: AlterCardRequest): Promise<PresentableUser> {
        return await this.deckService.processAddCard(user.email, body.deckName, 'character', body.cardName)
    }

    @ApiBearerAuth()
    @ApiBody({ type: AlterCardBodyApi })
    @UseGuards(AlterCardGuard, JwtAuthGuard)
    @UseInterceptors(AlterCardInterceptor)
    @Put('remove-play-card')
    async handleRemovePlayCard(@UserDecorator() user: UserDTO, @Body() body: AlterCardRequest): Promise<PresentableUser> {
        return await this.deckService.processRemoveCard(user.email, body.deckName, 'play', body.cardName)
    }

    @ApiBearerAuth()
    @ApiBody({ type: AlterCardBodyApi })
    @UseGuards(AlterCardGuard, JwtAuthGuard)
    @UseInterceptors(AlterCardInterceptor)
    @Put('remove-character-card')
    async handleRemoveCharacterCard(@UserDecorator() user: UserDTO, @Body() body: AlterCardRequest): Promise<PresentableUser> {
        return await this.deckService.processRemoveCard(user.email, body.deckName, 'character', body.cardName)
    }


}