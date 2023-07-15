import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { UserService, UserServiceErrorCodes } from '@database/user/user.service'
import { Deck } from '@apptypes/deck.type'
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
            if (ex.errorType === UserServiceErrorCodes.DECK_EXISTED){
                const error = {deckNameError: 'This deck name has been existed.'}
                throw new ConflictException(error)
            }
        }
    }

    async processSaveDeck(email: string, deckName: string, playCardNames: string[], characterCardNames: string[]) : Promise<PresentableUser> {
        try
        {
            const user = await this.userSerivce.saveDeck(email, deckName, playCardNames, characterCardNames)

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
            if (ex.errorType === UserServiceErrorCodes.DECK_NOT_EXISTED){
                throw new NotFoundException('This deck is not existed.')
            }
            else if (ex.errorType === UserServiceErrorCodes.CARD_NOT_ACCEPTED){
                throw new NotFoundException(`Card '${ex.cardName}' is not accepted.`)
            } 
            else if (ex.errorType === UserServiceErrorCodes.COMPONENT_DECK_REACHED_LIMIT){
                throw new ConflictException(`This '${ex.componentDeckType}' deck has reached the limit.`)
            } 
            else if (ex.errorType === UserServiceErrorCodes.CARD_MAX_OCCURRENCES){
                throw new ConflictException(`Card '${ex.cardName}' has reached the max occurrences.`)
            } 
        }
    }

    async processDefaultDeck(email: string, selectedDeckIndex: number) : Promise<PresentableUser>{
        try
        {
            const user = await this.userSerivce.defaultDeck(email, selectedDeckIndex)

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
            if (ex.errorType === UserServiceErrorCodes.INDEX_OUT_OF_RANGE){
                throw new NotFoundException('This selected deck index is out of range.')
            }
            
        }
    }
}


