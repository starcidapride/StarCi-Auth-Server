import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { UserService } from '@database/user/user.service'
import { ComponentDeckType, Deck } from '@apptypes/deck.type'
import { PresentableUser } from '@apptypes/auth.type'

@Injectable()
export class DeckService {
    constructor(
		private readonly userSerivce: UserService
    ) { }
	
    async processAddDeck(email: string, deckName : string) : Promise<PresentableUser> {
        try
        {
            const deck: Deck = {
                deckName,
                playDeck: [],
                characterDeck: []
            }

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
            if (ex.code === 0){
                const error = {deckNameError: 'This deck name has been existed.'}
                throw new ConflictException(error)
            }
        }
    }

    async processAddCards(email: string, deckName: string, componentDeckType: ComponentDeckType, cardNames: string[]) : Promise<PresentableUser> {
        try
        {
            const user = await this.userSerivce.addCards(email, deckName, componentDeckType, cardNames)

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
                throw new NotFoundException('This deck is not existed.')
            }
            else if (ex.code === 2){
                throw new NotFoundException(`Card ${ex.cardName} is not accepted.`)
            } 
            else if (ex.code === 3){
                throw new ConflictException('This deck has reached the limit.')
            } 
            else if (ex.code === 4){
                throw new ConflictException(`Card ${ex.cardName} has reached the max occurrences.`)
            } 


        }
    }

    async processRemoveCards(email: string, deckName: string, componentDeckType: ComponentDeckType, cardNames: string[]) : Promise<PresentableUser> {
        try
        {
            const user = await this.userSerivce.removeCards(email, deckName, componentDeckType, cardNames)

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
                throw new NotFoundException('This deck is not existed.')
            }
            else if (ex.code === 5){
                throw new NotFoundException(`This ${componentDeckType} deck is empty.`)
            } 
            else if (ex.code === 6){
                throw new NotFoundException(`Card ${ex.cardName} is not existed.`)
            }
        }
    }
}


