import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'
import { CryptoService } from '@utils/sha256.service'
// import { UserDbService } from '@database/user.db.service'
import jwtConfig from '@config/jwt.config'
import { JwtService } from '@nestjs/jwt'
import { AuthTokenSet, Payload, PresentableUser, SignInResponse, SignUpRequest, VerifyResponse } from '@apptypes/auth.type'
import { UserService } from '@database/user/user.service'
import { UserDTO } from '@database/user/user.dto'
// import { MailerService } from '@routes/auth/mailer/mailer.service'
// import {TokenExpiredError} from 'jsonwebtoken'


@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        //private readonly mailerService: MailerService,
        private readonly cryptoService: CryptoService
    ) { }
	
    async validateUser(email: string, password: string): Promise<UserDTO> {
    	const hashedPassword = this.cryptoService.createHashSHA256(password)
    	const user = await this.userService.findOne(
    		{
    			email,
    			// password : hashedPassword
                password
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
    		throw new UnauthorizedException('Prior to continuing, it\'s important that you verify your account through your email. Furthermore, we have sent you another email as a backup option in case you have misplaced or cannot locate the initial email.')
    	}
    	const presentableUser : PresentableUser = {
    		email: user.email,
    		...(user.username && { username : user.username }),
    		...(user.picture && { picture: user.picture }),
    		...(user.bio && { bio: user.bio }),
    		firstName: user.firstName,
    		lastName: user.lastName
    	}
    
    	//await this.refreshTokenDbService.addToken({email: user.email, token: authTokenSet.refreshToken })

    	return { authTokenSet, presentableUser }
    }

    // async processSignUp(data: SignUpRequest): Promise<PresentableUser> {
    // const { email, password, username, firstName, lastName } = data

    // 	const hashedPassword = this.cryptoService.createHashSHA256(password)
    // 	const user = {
    // 		email,
    // 		password: hashedPassword, 
    // 		username,
    // 		firstName, 
    // 		lastName, 
    // 		verified: false
    // 	}

    // 	const createdUser = await this.userDbService.createUser(user)
    // 	const createdResult = createdUser.createResult

    // 	if (createdResult === false) {
    // 		throw new HttpException(createdUser.errors, HttpStatus.CONFLICT)
    // 	}

    // 	await this.mailerService.sendMail(email)
    // 	return {
    // 		email: user.email,
    // 		username: user.username,
    // 		firstName: user.firstName,
    // 		lastName: user.lastName
    // 	}
    // }

    // async processRefresh(refreshToken: string): Promise<AuthTokenSet> {
    // 	let payload: Payload
    // 	try{
    // 	 	payload = await this.jwtService.verifyAsync<Payload>(
    // 			refreshToken, 
    // 			{ 
    // 				secret: jwtConfig().secret 
    // 			}
    // 		)
    // 	} catch (ex){
    // 		throw new HttpException('The refresh token has either expired or is invalid.', HttpStatus.UNAUTHORIZED)
    // 	}

    // 	const email = payload.email

    // 	const tokenSet = await this.generateAuthTokenSet(email)
    // 	await this.refreshTokenDbService.addToken({
    // 		token: tokenSet.refreshToken,
    // 		email
    // 	}
    // 	)
    // 	return tokenSet
    // }

    // async processVerify(email: string, token: string): Promise<VerifyResponse> {
    // 	try {
    // 		const decoded = this.jwtService.verify<Payload>(token, { secret: jwtConfig().secret })

    // 		const verified = (await this.userDbService.getUser({email : decoded.email})).verified

    // 		if (verified) {
    // 			return 'already confirmed'
    // 		} else {
    // 			await this.userDbService.updateUser(email, { verified: true })
    // 			return 'success'
    // 		}

    // 	} catch (ex) {
    // 		if (ex instanceof TokenExpiredError) {
    // 			return 'time out'
    // 		} else {
    // 			return 'not found'
    // 		}
    // 	}
    // }

    // async processInit(user: User): Promise<PresentableUser> {
    // 	return {
    // 		email: user.email,
    // 		username: user.username,
    // 		...(user.image && { image: user.image }),
    // 		...(user.bio && { bio: user.bio }),
    // 		firstName: user.firstName,
    // 		lastName: user.lastName
    // 	}
    //}
}

