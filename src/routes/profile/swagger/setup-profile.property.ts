import { ApiProperty } from '@nestjs/swagger'

export class SetupProfileBodyApi{
    
@ApiProperty({ example: 'starci', description: 'Username' })
    username: string

@ApiProperty({ example: 'base64 picture', description: 'Picture' })
    picture: string

@ApiProperty({ example: 'A passionate developer', description: 'Bio' })
    bio: string
}


