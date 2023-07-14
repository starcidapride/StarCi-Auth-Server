import { Model, MongooseError } from 'mongoose'
import { Injectable, Inject } from '@nestjs/common'
import { USER_MODEL } from '@database/constants'
import { UserDTO, UserParams } from './user.dto'
import { ComponentDeckType, Deck } from '@apptypes/deck.type'
import { INVOCATION, MAX_CHARACTER_CARDS, MAX_CHARACTER_OCCURRENCES, MAX_INVOCATION_OCCURRENCES, MAX_PLAY_CARDS, MAX_PLAY_OCCURRENCES } from '@utils/constants'
import { cardMap } from '@utils/map'

@Injectable()
export class UserService {
    constructor(
    @Inject(USER_MODEL)
    private UserModel: Model<UserDTO>,
    ) {}

    async create(user: UserParams): Promise<UserDTO> {
        const createdUser = new this.UserModel(user)
        return createdUser.save()
    }

    async findOne(
        params?: Partial<{
			email: string,
			password: string,
			bio: string,
			username: string,
			firstName: string,
			lastName: string,
			picture: Buffer,
			verified: boolean,
		}
        >
    ): Promise<UserDTO | null> {
        
        return this.UserModel.findOne(params).exec()
    }

    async update(
        email: string,
        params: Partial<{
          password: string;
          username: string;
          bio: string;
          firstName: string;
          lastName: string;
          picture: string;
          verified: boolean;
        }>
    ): Promise<UserDTO | null> {
        try {
            const updatedUser = await this.UserModel.findOneAndUpdate(
                { email },
                {
                    $set: {
                        ...(params?.password && { password: params.password }),
                        ...(params?.username && { username: params.username }),
                        ...(params?.bio && { bio: params.bio }),
                        ...(params?.firstName && { firstName: params.firstName }),
                        ...(params?.lastName && { lastName: params.lastName }),
                        ...(params?.picture && { picture: params.picture }),
                        ...(params?.verified && { verified: params.verified }),
                    }
                },
                { new: true }
            )
            return updatedUser
        } catch (ex) {
            return null
        }
    }

    async addCard(email: string, deckName: string, componentDeckType: ComponentDeckType, cardName: string): Promise<UserDTO | null>{
        const user = await this.UserModel.findOne({ email }).exec()
        const deck = user.deckCollection.decks.find(deck => deck.deckName === deckName)
        if (deck){
            let maxOccurrences = -1 , maxCards = - 1
            let componentDeck: string[] = null

            if (componentDeckType === 'play'){
                maxCards = MAX_PLAY_CARDS
                maxOccurrences = MAX_PLAY_OCCURRENCES

                componentDeck = deck.playDeck
                if (cardMap[cardName] === 'character'){
                    throw Object.assign(new MongooseError('This card type is not accepted.'), { code: 1 })
                } 
            } else {
                maxCards = MAX_CHARACTER_CARDS
                maxOccurrences = MAX_CHARACTER_OCCURRENCES

                componentDeck = deck.characterDeck
                if (cardMap[cardName] !== 'character'){
                    throw Object.assign(new MongooseError('This card type is not accepted.'), { code: 1 })
                } 
            }

            const playDeck = deck.playDeck
            if (playDeck.length === maxCards){
                throw Object.assign(new MongooseError('This deck has reached the limit.'), { code: 2 })
            }
               
            const occurrences = playDeck.filter(card => card === cardName).length
            if (cardName === INVOCATION && occurrences == MAX_INVOCATION_OCCURRENCES){
                throw Object.assign(new MongooseError('This card has reached the max occurrences.'), { code: 3 })
            } else if (occurrences == maxOccurrences){
                throw Object.assign(new MongooseError('This card has reached the max occurrences.'), { code: 3 })
            }

            componentDeck.push(cardName)
            
            const updatedUser = await user.save()
            return updatedUser
        }      
        return null
    }

    async removeCard(email: string, deckName: string, componentDeckType: ComponentDeckType, cardName: string): Promise<UserDTO | null>{
        const user = await this.UserModel.findOne({ email }).exec()
        const deck = user.deckCollection.decks.find(deck => deck.deckName === deckName)
        if (deck){
            if (componentDeckType === 'play'){
                if (!deck.playDeck.find(_cardName => _cardName === cardName)){
                    throw Object.assign(new MongooseError('This card is not existed.'), { code: 4 })
                }
                
                const index = deck.playDeck.indexOf(cardName)
                if (index !== -1) {
                    deck.playDeck.splice(index, 1)
                }
            } else {
                if (!deck.characterDeck.find(_cardName => _cardName === cardName)){
                    throw Object.assign(new MongooseError('This card is not existed.'), { code: 4 })
                }
                const index = deck.characterDeck.indexOf(cardName)
                if (index !== -1) {
                    deck.characterDeck.splice(index, 1)
                }
            }
            
            const updatedUser = await user.save()
            return updatedUser
        }
        return null
    }

    async addDeck(email: string, deck: Deck) : Promise<UserDTO | null> {
        const user = await this.UserModel.findOne({ email }).exec()

        if (!user) {
            return null
        }

        const deckNames = user.deckCollection.decks.map(deck => deck.deckName)

        if (deckNames.includes(deck.deckName)) 
            throw Object.assign(new MongooseError('This deck name has been existed.'), { code: 11000 })
            
        user.deckCollection.decks.push(deck)
        user.deckCollection.selectedDeckIndex = user.deckCollection.decks.length

        const updatedUser = await user.save()
        return updatedUser
    }

    async addRefreshToken(email: string, token: string) : Promise<UserDTO | null>{
        const user = await this.UserModel.findOne({ email }).exec()

        if (!user) {
            return null
        }

        user.refreshTokens.push(token)

        const updatedUser = await user.save()
        return updatedUser
    }
}
