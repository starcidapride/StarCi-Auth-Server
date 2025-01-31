import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { CryptoService } from '@utils/sha256.service'
// import { UserDbService } from '@database/user.db.service'
import jwtConfig from '@config/jwt.config'
import { JwtService } from '@nestjs/jwt'
import { AuthTokenSet, Payload, ResetPasswordResponse, SignInResponse, SignUpRequest, VerifyResponse, PresentableUser } from '@apptypes/auth.type'
import { UserService } from '@database/user/user.service'
import { UserDTO } from '@database/user/user.dto'
import { MailerService } from '@routes/auth/mailer/mailer.service'
import {TokenExpiredError} from 'jsonwebtoken'

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly mailerService: MailerService,
        private readonly cryptoService: CryptoService
    ) { }
	
    async validateUser(email: string, password: string): Promise<UserDTO> {
    	const hashedPassword = this.cryptoService.createHashSHA256(password)
    	const user = await this.userService.findOne(
    		{
    			email,
    			password : hashedPassword
    		}
    	)
    	if (!user) {
    		throw new UnauthorizedException('Incorrect username or password.')
    	}
    	return user
    }

    private async generateAuthTokenSet(email: string): Promise<AuthTokenSet> {
    	const payload = { email }
    	const accessToken = await this.jwtService.signAsync(payload, {
    		expiresIn: jwtConfig().accessTokenExpiryTime,
    		secret: jwtConfig().secret,
    	})

    	const refreshToken = await this.jwtService.signAsync(payload, {
    		expiresIn: jwtConfig().refreshTokenExpiryTime,
    		secret: jwtConfig().secret,
    	})

    	return { accessToken, refreshToken }
    }
  
    async processSignIn(user: UserDTO): Promise<SignInResponse> {
    	const authTokenSet = await this.generateAuthTokenSet(user.email)
    	if (!user.verified) {

            await this.mailerService.sendMail(user.email, 'verify')
    		throw new UnauthorizedException('Prior to continuing, it\'s important that you verify your account through your email. Furthermore, we have sent you another email as a backup option in case you have misplaced or cannot locate the initial email.')			
        }
    	const presentableUser : PresentableUser = {
    		email: user.email,
    		...(user.username && { username : user.username }),
    		...(user.picture && { picture: user.picture }),
    		...(user.bio && { bio: user.bio }),
    		firstName: user.firstName,
    		lastName: user.lastName,
            ...(user.deckCollection && { deckCollection: user.deckCollection }),  
    	}

    	await this.userService.addRefreshToken(
            user.email,
            authTokenSet.refreshToken,  
        )

    	return { authTokenSet, presentableUser }
    }

    async processSignUp(data: SignUpRequest): Promise<PresentableUser> {
        const { email, password, firstName, lastName } = data

    	const hashedPassword = this.cryptoService.createHashSHA256(password)
    	const user = {
    		email,
    		password: hashedPassword, 
    		firstName, 
    		lastName, 
    		verified: false
    	}
        try {
            await this.userService.create(user)
        } catch (ex) {
            if (ex.code === 11000 && ex.keyPattern && ex.keyValue && ex.keyValue.email) {
                const emailError = {emailError: 'Email already exists.'}
                throw new ConflictException({errors : emailError})
            } else {
                throw ex
            }
        }
    	await this.mailerService.sendMail(email, 'verify')
    	return {
    		email: user.email,
    		firstName: user.firstName,
    		lastName: user.lastName,
    	}
    }

    async processRefresh(refreshToken: string): Promise<AuthTokenSet> {
    	let payload: Payload
    	try{
    	 	payload = await this.jwtService.verifyAsync<Payload>(
    			refreshToken, 
    			{ 
    				secret: jwtConfig().secret 
    			}
    		)
    	} catch (ex){
    		throw new UnauthorizedException('The refresh token has either expired or is invalid.')
    	}

    	const email = payload.email

    	const tokenSet = await this.generateAuthTokenSet(email)
    	await this.userService.addRefreshToken(
            email,
    		tokenSet.refreshToken
    	)
    	return tokenSet
    }

    async processForgetPassword(email: string) {

        await this.mailerService.sendMail(email, 'forgetPassword')
    }

    async processShowResetPasswordUI(token: string): Promise<ResetPasswordResponse> {
        try
        {
            this.jwtService.verify<Payload>(token, { secret: jwtConfig().secret })
            return 'success'
        } catch(ex){
            if (ex instanceof TokenExpiredError) {
    			return 'time out'
    		} else {
    			return 'not found'
    		}
        } 
    }

    async processResetPassword(username: string, newPassword: string) : Promise<PresentableUser> {
        const updatedUser = await this.userService.update(username, {password: newPassword})
        return {
    		email: updatedUser.email,
    		...(updatedUser.username && {username: updatedUser.username }),
    		...(updatedUser.picture && { picture: updatedUser.picture }),
    		...(updatedUser.bio && { bio: updatedUser.bio }),
    		firstName: updatedUser.firstName,
    		lastName: updatedUser.lastName
    	}
    }

    async processVerify(token: string): Promise<VerifyResponse> {
    	try {
    		const decoded = this.jwtService.verify<Payload>(token, { secret: jwtConfig().secret })

            const email = decoded.email

    		const verified = (await this.userService.findOne({email : decoded.email})).verified

    		if (verified) {
    			return 'already confirmed'
    		} else {
    			await this.userService.update(email, { verified: true })
    			return 'success'
    		}

    	} catch (ex) {
    		if (ex instanceof TokenExpiredError) {
    			return 'time out'
    		} else {
    			return 'not found'
    		}
    	}
    }



    async processInit(user: UserDTO): Promise<PresentableUser> {
    	return {
    		email: user.email,
    		...(user.username && {username: user.username }),
    		...(user.picture && { picture: user.picture }),
    		...(user.bio && { bio: user.bio }),
    		firstName: user.firstName,
    		lastName: user.lastName,
            ...(user.deckCollection && { deckCollection: user.deckCollection }), 
    	}
    }
}

