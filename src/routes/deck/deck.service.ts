import { ConflictException, Injectable } from '@nestjs/common'

import { UserService } from '@database/user/user.service'
import { Deck } from '@apptypes/deck.type'
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
}


