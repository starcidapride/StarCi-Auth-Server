import { Controller, UseGuards, Put, Body, UseInterceptors } from '@nestjs/common'
import { UserDTO } from '@database/user/user.dto'
import { UserDecorator } from '@decorators/user.decorator'
import { PresentableUser } from '@apptypes/auth.type'
import { JwtAuthGuard } from '@routes/auth/guards/jwt.guard'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { ProfileService } from '@routes/profile/profile.service'

import { SetupProfileBodyApi } from '@routes/profile/swagger/setup-profile.property'
import { SetupProfileGuard } from '@routes/profile/guards/setup-profile.guard'
import { SetupProfileRequest } from '@apptypes/profile.type'
import { SetupProfileInterceptor } from '@routes/profile/interceptors/setup-profile.interceptor'

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
}