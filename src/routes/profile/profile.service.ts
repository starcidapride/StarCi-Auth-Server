import { Injectable, NotFoundException } from '@nestjs/common'

import { PresentableUser } from '@apptypes/auth.type'
import { UserService } from '@database/user/user.service'

@Injectable()
export class ProfileService {
    constructor(
		private readonly userSerivce: UserService
    ) { }
	
    async processSetupProfile(email: string, username: string, picture: string, bio: string): Promise<PresentableUser>{
        const user = await this.userSerivce.update(email, {username, picture, bio})
        return {
            email: user.email,
    		username : user.username, 
    		picture: user.picture,
    		bio: user.bio,
    		firstName: user.firstName,
    		lastName: user.lastName
        }
    }

    async processGetProfle(email: string) : Promise<PresentableUser>{
        
        const user = await this.userSerivce.findOne({ email })
        
        if (!user) {
            throw new NotFoundException('No profile found matching the provided email.')
        }

        return {
            email: user.email,
            username : user.username, 
            picture: user.picture,
            bio: user.bio,
            firstName: user.firstName,
            lastName: user.lastName
        }
    }
    
}


