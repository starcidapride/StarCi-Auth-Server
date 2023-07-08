import { Model } from 'mongoose'
import { Injectable, Inject } from '@nestjs/common'
import { REFRESH_TOKEN_MODEL } from '@database/constants'
import { RefreshTokenDTO, RefreshTokenParams } from './refresh-token.dto'

@Injectable()
export class RefreshTokenService {
    constructor(
    @Inject(REFRESH_TOKEN_MODEL)
    private RefreshTokenModel: Model<RefreshTokenDTO>,
    ) {}

    async create(refreshToken: RefreshTokenParams): Promise<RefreshTokenDTO> {
        const createdUser = new this.RefreshTokenModel(refreshToken)
        return createdUser.save()
    }

    async findOne(
        params?: Partial<{
            token: string,
            email: string
		}
        >
    ): Promise<RefreshTokenDTO | null> {
        
        return this.RefreshTokenModel.findOne(params).exec()
    }
}