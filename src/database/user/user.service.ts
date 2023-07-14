import { Model, MongooseError } from 'mongoose'
import { Injectable, Inject } from '@nestjs/common'
import { USER_MODEL } from '@database/constants'
import { UserDTO, UserParams } from './user.dto'
import { Deck } from '@apptypes/deck.type'

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
