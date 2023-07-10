import { Model } from 'mongoose'
import { Injectable, Inject } from '@nestjs/common'
import { USER_MODEL } from '@database/constants'
import { UserDTO, UserParams } from './user.dto'

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
                    ...(params?.password && { password: params.password }),
                    ...(params?.username && { username: params.username }),
                    ...(params?.bio && { bio: params.bio }),
                    ...(params?.firstName && { firstName: params.firstName }),
                    ...(params?.lastName && { lastName: params.lastName }),
                    ...(params?.picture && { picture: params.picture }),
                    ...(params?.verified && { verified: params.verified }),
                },
                { new: true }
            )
            return updatedUser
        } catch (ex) {
            return null
        }
    }
}
