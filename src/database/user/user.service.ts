import { Model } from 'mongoose'
import { Injectable, Inject } from '@nestjs/common'
import { USER_MODEL } from '@utils/constants'
import { UserDTO } from './user.dto'

@Injectable()
export class UserService {
    constructor(
    @Inject(USER_MODEL)
    private UserModel: Model<UserDTO>,
    ) {}

    async create(user: UserDTO): Promise<UserDTO> {
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
}