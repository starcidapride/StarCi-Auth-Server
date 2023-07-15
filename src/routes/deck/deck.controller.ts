import { Controller, UseGuards, Put, Body, UseInterceptors } from '@nestjs/common'
import { UserDTO } from '@database/user/user.dto'
import { UserDecorator } from '@decorators/user.decorator'
import { PresentableUser } from '@apptypes/auth.type'
import { JwtAuthGuard } from '@routes/auth/guards/jwt.guard'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { DeckService } from '@routes/deck/deck.service'
import { AddDeckRequest, DefaultDeckRequest, SaveDeckRequest } from '@apptypes/deck.type'
import { AddDeckBodyApi, DefaultDeckBodyApi, SaveDeckBodyApi } from './swagger/deck.property'
import { AddDeckGuard } from '@routes/deck/guards/add-deck.guard'
import { SaveDeckGuard } from '@routes/deck/guards/save-deck.guard'
import { SaveDeckInterceptor } from '@routes/deck/interceptors/save-deck.interceptor'
import { DefaultDeckGuard } from './guards/default-deck.guard'

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
    async handleAddDeck(@UserDecorator() user: UserDTO, @Body() body: AddDeckRequest): Promise<PresentableUser> {
        return await this.deckService.processAddDeck(user.email, body.deckName)
    }

    @ApiBearerAuth()
    @ApiBody({ type: SaveDeckBodyApi })
    @UseGuards(SaveDeckGuard, JwtAuthGuard)
    @UseInterceptors(SaveDeckInterceptor)
    @Put('save-deck')
    async handleSaveDeck(@UserDecorator() user: UserDTO, @Body() body: SaveDeckRequest): Promise<PresentableUser> {
        return await this.deckService.processSaveDeck(user.email, body.deckName, body.playCardNames, body.characterCardNames)
    }

    @ApiBearerAuth()
    @ApiBody({ type: DefaultDeckBodyApi })
    @UseGuards(DefaultDeckGuard, JwtAuthGuard)
    @Put('default-deck')
    async handleDefaultDeck(@UserDecorator() user: UserDTO, @Body() body: DefaultDeckRequest): Promise<PresentableUser> {
        return await this.deckService.processDefaultDeck(user.email, body.defaultDeckIndex)
    }
}

