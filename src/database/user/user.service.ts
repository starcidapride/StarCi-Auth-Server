import { Model, MongooseError } from 'mongoose'
import { Injectable, Inject } from '@nestjs/common'
import { USER_MODEL } from '@database/database-constants'
import { UserDTO, UserParams } from './user.dto'
import { ComponentDeckType, Deck, DeckCollection } from '@apptypes/deck.type'
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

    async addDeck(email: string, deck: Deck) : Promise<UserDTO | null> {
        const user = await this.UserModel.findOne({ email }).exec()

        if (!user) {
            return null
        }

        const deckCollection : DeckCollection = {
            selectedDeckIndex : 0,
            decks : []
        }

        if (!user.deckCollection){
            user.deckCollection = deckCollection

        }

        const deckNames = user.deckCollection.decks.map(deck => deck.deckName)

        if (deckNames.includes(deck.deckName)) 
            throw Object.assign(new MongooseError('This deck name has been existed.'), { code: 0 })
            
        user.deckCollection.decks.push(deck)
        user.deckCollection.selectedDeckIndex = user.deckCollection.decks.length - 1

        const updatedUser = await user.save()
        return updatedUser
    }

    async addCards(email: string, deckName: string, componentDeckType: ComponentDeckType, cardNames: string[]): Promise<UserDTO | null>{
        const user = await this.UserModel.findOne({ email }).exec()
        const deck = user.deckCollection.decks.find(deck => deck.deckName === deckName)
        
        if (deck){

            let maxOccurrences = -1 , maxCards = - 1
            let componentDeck: string[] = null

            if (componentDeckType === 'play'){
                maxCards = MAX_PLAY_CARDS
                maxOccurrences = MAX_PLAY_OCCURRENCES

                componentDeck = deck.playDeck
                for (const cardName of cardNames){
                    if (cardMap[cardName] === 'character'){
                        throw Object.assign(new MongooseError(`Card "${cardName}" is not accepted.`), { code: 1 }, { cardName })
                    } 
                }
               
            } else {
                maxCards = MAX_CHARACTER_CARDS
                maxOccurrences = MAX_CHARACTER_OCCURRENCES

                componentDeck = deck.characterDeck
                for (const cardName of cardNames){
                    if (cardMap[cardName] !== 'character'){
                        throw Object.assign(new MongooseError(`Card ${cardName} is not accepted.`), { code: 2 }, { cardName })
                    } 
                }
            }

            
            if (componentDeck.length + cardNames.length > maxCards){
                throw Object.assign(new MongooseError('This deck has reached the limit.'), { code: 3 })
            }
              
            for (const cardName of cardNames){
                const occurrences = componentDeck.filter(card => card === cardName).length
                if (occurrences >= (cardName === INVOCATION ? MAX_INVOCATION_OCCURRENCES : maxOccurrences)){
                    throw Object.assign(new MongooseError(`Card ${cardName} has reached the max occurrences.`), { code: 4 }, { cardName })
                }
                componentDeck.push(cardName)
            }

            const updatedUser = await user.save()
            return updatedUser
        } else {
            throw Object.assign(new MongooseError('This deck is not existed.'), { code: 1 })
        } 
    }

    async removeCards(email: string, deckName: string, componentDeckType: ComponentDeckType, cardNames: string[]): Promise<UserDTO | null>{
        const user = await this.UserModel.findOne({ email }).exec()
        const deck = user.deckCollection.decks.find(deck => deck.deckName === deckName)
        if (deck){

            let componentDeck: string[] = null

            if (componentDeckType === 'play'){
                componentDeck = deck.playDeck

            } else {
                componentDeck = deck.characterDeck
            }

            if (componentDeck.length === 0){
                throw Object.assign(new MongooseError(`This ${componentDeckType} deck is empty.`), { code: 5 })
            }

            for (const cardName of cardNames){
                if (!componentDeck.find(_cardName => _cardName === cardName)){
                    throw Object.assign(new MongooseError(`Card ${cardName} is not existed.`), { code: 6 }, { cardName })
                }            
                const index = componentDeck.indexOf(cardName)
                componentDeck.splice(index, 1)
            }
            
            const updatedUser = await user.save()
            return updatedUser
        }
        throw Object.assign(new MongooseError('This deck is not existed.'), { code: 1 })
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
