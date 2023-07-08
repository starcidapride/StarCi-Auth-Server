import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import jwtConfig from '@config/jwt.config'
import { Payload } from '@apptypes/auth.type'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { UserService } from '@database/user/user.service'
import { UserDTO } from '@database/user/user.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UserService) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                ignoreExpiration: false,
                secretOrKey: jwtConfig().secret
            }
        )
    }

    async validate(payload: Payload): Promise<UserDTO> {
        const user = await this.userService.findOne({ email: payload.email })
        if (!user) {
            throw new HttpException('User not found.', HttpStatus.BAD_REQUEST)
        }
        return user
    }
}