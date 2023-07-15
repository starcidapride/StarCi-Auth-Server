import { Body, Controller, Get, Post, Query, Res, UseGuards, UseInterceptors, Headers } from '@nestjs/common'
import { LocalAuthGuard } from '@routes/auth/guards/local.guard'
import { AuthService } from '@routes/auth/auth.service'
import { UserDTO } from '@database/user/user.dto'
import { UserDecorator } from '@decorators/user.decorator'
import { AuthTokenSet, PresentableUser, SignInResponse, SignUpRequest } from '@apptypes/auth.type'
import { SignUpInterceptor } from '@routes/auth/interceptors/sign-up.interceptor'
import { SignUpGuard } from '@routes/auth/guards/sign-up.guard'
import { JwtAuthGuard } from '@routes/auth/guards/jwt.guard'
import { Response } from 'express' 
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { SignInBodyApi, SignUpRequestApi } from '@routes/auth/swagger/auth.property'
import serverConfig from '@config/server.config'

@ApiTags('Authentication')
@Controller('api/auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) { }

    @ApiBody({ type: SignInBodyApi })
    @UseGuards(LocalAuthGuard)
    @Post('sign-in')
    async handleSignIn(@UserDecorator() user: UserDTO): Promise<SignInResponse> {
    	return await this.authService.processSignIn(user)
    }

    @ApiBody({ type: SignUpRequestApi })
    @UseGuards(SignUpGuard)
    @UseInterceptors(SignUpInterceptor)
    @Post('sign-up')
    async handleSignUp(@Body() body: SignUpRequest): Promise<PresentableUser> {
    	return await this.authService.processSignUp(body)
    }

    @Get('verify')
    async handleVerify(@Query('email') email: string, @Query('token') token: string, @Res() res: Response): Promise<void> {
    	const verifyResult = await this.authService.processVerify(token)
    	const templates = {
    		'success': 'verify/success',
    		'already confirmed': 'verify/already-confirmed',
    		'time out': 'verify/time-out',
    		'not found': 'not-found'
    	}

    	const templateName = templates[verifyResult] || 'not-found'
    	res.render(templateName, { email })

    }

    @Post('forget-password')
    async handleForgetPassword(@Body() body: {email: string}): Promise<void> {
        await this.authService.processForgetPassword(body.email)
    }

    @Get('show-reset-password-ui')
    async handeShowResetPasswordUI(@Query('email') email: string, @Query('token') token: string, @Res() res: Response): Promise<void> {
        const verifyResult =  await this.authService.processShowResetPasswordUI(token)
        const templates = {
    		'success': 'reset-password/success',
    		'time out': 'reset-password/time-out',
    		'not found': 'not-found'
    	}

        const url = `${serverConfig().serverUrl}/auth/reset-password`
        const templateName = templates[verifyResult] || 'not-found'
    	res.render(templateName, { email, token, url })
    }

    @UseGuards(JwtAuthGuard)
    @Post('reset-password')
    async handleResetPassword(@UserDecorator() user: UserDTO, @Body() body: {newPassword: string}): Promise<void> {
        await this.authService.processResetPassword(user.email, body.newPassword)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('refresh')
    async handleRefresh(@Headers('authorization') authHeader: string): Promise<AuthTokenSet> {
    	const refreshToken = authHeader.split(' ')[1]
    	return await this.authService.processRefresh(refreshToken)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('init')
    async handleInit(@UserDecorator() user: UserDTO): Promise<PresentableUser> {
    	return await this.authService.processInit(user)
    }
}