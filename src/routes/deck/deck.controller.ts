import { Controller, UseGuards, Put, Body, UseInterceptors } from '@nestjs/common'
import { UserDTO } from '@database/user/user.dto'
import { UserDecorator } from '@decorators/user.decorator'
import { PresentableUser } from '@apptypes/auth.type'
import { JwtAuthGuard } from '@routes/auth/guards/jwt.guard'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { DeckService } from '@routes/deck/deck.service'
import { AlterCardsRequest, Deck } from '@apptypes/deck.type'
import { AddDeckBodyApi, AlterCardsBodyApi } from './swagger/deck.property'
import { AddDeckGuard } from '@routes/deck/guards/add-deck.guard'
import { AlterCardsGuard } from '@routes/deck/guards/alter-cards.guard'
import { AlterCardInterceptor } from '@routes/deck/interceptors/alter-cards.interceptor'

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
    @ApiBody({ type: AlterCardsBodyApi })
    @UseGuards(AlterCardsGuard, JwtAuthGuard)
    @UseInterceptors(AlterCardInterceptor)
    @Put('add-play-cards')
    async handleAddPlayCards(@UserDecorator() user: UserDTO, @Body() body: AlterCardsRequest): Promise<PresentableUser> {
        return await this.deckService.processAddCards(user.email, body.deckName, 'play', body.cardNames)
    }

    @ApiBearerAuth()
    @ApiBody({ type: AlterCardsBodyApi })
    @UseGuards(AlterCardsGuard, JwtAuthGuard)
    @UseInterceptors(AlterCardInterceptor)
    @Put('add-character-cards')
    async handleAddCharacterCards(@UserDecorator() user: UserDTO, @Body() body: AlterCardsRequest): Promise<PresentableUser> {
        return await this.deckService.processAddCards(user.email, body.deckName, 'character', body.cardNames)
    }

    @ApiBearerAuth()
    @ApiBody({ type: AlterCardsBodyApi })
    @UseGuards(AlterCardsGuard, JwtAuthGuard)
    @UseInterceptors(AlterCardInterceptor)
    @Put('remove-play-cards')
    async handleRemovePlayCards(@UserDecorator() user: UserDTO, @Body() body: AlterCardsRequest): Promise<PresentableUser> {
        return await this.deckService.processRemoveCards(user.email, body.deckName, 'play', body.cardNames)
    }

    @ApiBearerAuth()
    @ApiBody({ type: AlterCardsBodyApi })
    @UseGuards(AlterCardsGuard, JwtAuthGuard)
    @UseInterceptors(AlterCardInterceptor)
    @Put('remove-character-cards')
    async handleRemoveCharacterCard(@UserDecorator() user: UserDTO, @Body() body: AlterCardsRequest): Promise<PresentableUser> {
        return await this.deckService.processRemoveCards(user.email, body.deckName, 'character', body.cardNames)
    }


}

