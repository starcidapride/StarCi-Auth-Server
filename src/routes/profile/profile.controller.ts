import { Controller, UseGuards, Put, Body } from '@nestjs/common'
import { UserDTO } from '@database/user/user.dto'
import { UserDecorator } from '@decorators/user.decorator'
import { PresentableUser } from '@apptypes/auth.type'
import { JwtAuthGuard } from '@routes/auth/guards/jwt.guard'
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger'
import { ProfileService } from './profile.service'
import { InitUserDetailsBodyApi } from './swagger/profile.property'
import { InitUserDetailsRequest } from '@apptypes/profile.type'
import { InitUserDetailsGuard } from './guards/init-user-details.guard'

@ApiTags('Profile')
@Controller('api/profile')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService
    ) { }

    @ApiBearerAuth()
    @ApiBody({ type: InitUserDetailsBodyApi })
    @UseGuards(InitUserDetailsGuard, JwtAuthGuard)
    @Put('init-user-details')
    async handleInitUserDetails(@UserDecorator() user: UserDTO, @Body() body: InitUserDetailsRequest): Promise<PresentableUser> {
    	return await this.profileService.processInitUserDetails(user.email, body.username, body.picture, body.bio)
    }
}