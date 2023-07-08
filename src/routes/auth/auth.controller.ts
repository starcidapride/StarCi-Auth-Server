import { Body, Controller, Get, Post, Query, Res, UseGuards, UseInterceptors, Headers } from '@nestjs/common'
import { LocalAuthGuard } from '@routes/auth/guards/local.guard'
import { AuthService } from '@routes/auth/auth.service'
import { UserDTO } from '@database/user/user.dto'
import { UserDecorator } from '@decorators/user.decorator'
import { AuthTokenSet, PresentableUser, SignInBodyApi, SignInResponse, SignUpRequest, SignUpRequestApi } from '@apptypes/auth.type'
import { SignUpInterceptor } from '@routes/auth/interceptors/sign-up.interceptor'
import { SignUpGuard } from '@routes/auth/guards/sign-up.guard'
import { JwtAuthGuard } from '@routes/auth/guards/jwt.guard'
import { Response } from 'express' 
import { RefreshGuard } from '@routes/auth/guards/refresh.guard'
import { ApiBearerAuth, ApiBody, ApiParam, ApiParamOptions, ApiProperty, ApiTags } from '@nestjs/swagger'

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
    	const verifyResult = await this.authService.processVerify(email, token)
    	const templates = {
    		'success': 'success',
    		'already confirmed': 'already-confirmed',
    		'time out': 'time-out',
    		'not found': 'not-found'
    	}

    	const templateName = templates[verifyResult] || 'not-found'
    	res.render(templateName, { email })

    }

    @ApiBearerAuth()
    @UseGuards(RefreshGuard)
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
