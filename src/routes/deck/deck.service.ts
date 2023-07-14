import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { UserService } from '@database/user/user.service'
import { ComponentDeckType, Deck } from '@apptypes/deck.type'
import { PresentableUser } from '@apptypes/auth.type'

@Injectable()
export class DeckService {
    constructor(
		private readonly userSerivce: UserService
    ) { }
	
    async processAddDeck(email: string, deck : Deck) : Promise<PresentableUser> {
        try
        {
            const user = await this.userSerivce.addDeck(email, deck)
            
            return {
                email: user.email,
                username : user.username, 
                picture: user.picture,
                bio: user.bio,
                firstName: user.firstName,
                lastName: user.lastName,
                deckCollection: user.deckCollection
            }

        } catch(ex){
            if (ex.code === 11000){
                const error = {deckNameError: 'This deck name has been existed.'}
                throw new ConflictException(error)
            }
        }
    }

    async processAddCard(email: string, deckName: string, componentDeckType: ComponentDeckType, cardName: string) : Promise<PresentableUser> {
        try
        {
            const user = await this.userSerivce.addCard(email, deckName, componentDeckType, cardName)
            if (user === null){
                throw new NotFoundException('This deck is not existed.')
            }

            return {
                email: user.email,
                username : user.username, 
                picture: user.picture,
                bio: user.bio,
                firstName: user.firstName,
                lastName: user.lastName,
                deckCollection: user.deckCollection
            }

        } catch(ex){
            if (ex.code === 1){
                throw new ConflictException('This card type is not accepted.')
            } else if (ex.code === 2){
                throw new ConflictException('This card type is not accepted.')
            } else if (ex.code === 3){
                throw new ConflictException('This card has reached the max occurrences.')
            }
        }
    }

    async processRemoveCard(email: string, deckName: string, componentDeckType: ComponentDeckType, cardName: string) : Promise<PresentableUser> {
        try
        {
            const user = await this.userSerivce.addCard(email, deckName, componentDeckType, cardName)
            if (user === null){
                throw new NotFoundException('This deck is not existed.')
            }

            return {
                email: user.email,
                username : user.username, 
                picture: user.picture,
                bio: user.bio,
                firstName: user.firstName,
                lastName: user.lastName,
                deckCollection: user.deckCollection
            }

        } catch(ex){
            if (ex.code === 4){
                throw new NotFoundException('This card is not existed in deck.')
            } 
        }
    }
}

