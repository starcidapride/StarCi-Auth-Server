import { Controller, UseGuards, Put, Body, UseInterceptors, Param, Get } from '@nestjs/common'
import { UserDTO } from '@database/user/user.dto'
import { UserDecorator } from '@decorators/user.decorator'
import { PresentableUser } from '@apptypes/auth.type'
import { JwtAuthGuard } from '@routes/auth/guards/jwt.guard'
import { ApiBearerAuth, ApiBody, ApiParam, ApiTags } from '@nestjs/swagger'
import { ProfileService } from '@routes/profile/profile.service'

import { SetupProfileBodyApi } from '@routes/profile/swagger/profile.property'
import { SetupProfileGuard } from '@routes/profile/guards/setup-profile.guard'
import { SetupProfileRequest } from '@apptypes/profile.type'
import { SetupProfileInterceptor } from '@routes/profile/interceptors/setup-profile.interceptor'
import { GetProfileGuard } from '@routes/profile/guards/get-profile.guard'

@ApiTags('Profile')
@Controller('api/profile')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService
    ) { }

    @ApiBearerAuth()
    @ApiBody({ type: SetupProfileBodyApi })
    @UseGuards(SetupProfileGuard, JwtAuthGuard)
    @UseInterceptors(SetupProfileInterceptor)
    @Put('setup-profile')
    async handleSetupProfile(@UserDecorator() user: UserDTO, @Body() body: SetupProfileRequest): Promise<PresentableUser> {
    	return await this.profileService.processSetupProfile(user.email, body.username, body.picture, body.bio)
    }

    @ApiParam({ name: 'email', type: String })
    @UseGuards(GetProfileGuard)
    @Get('get-profile/:email')
    async handleGetProfile(@Param('email') email: string): Promise<PresentableUser> {
    	return await this.profileService.processGetProfle(email)
    }
}