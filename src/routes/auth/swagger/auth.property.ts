import { ApiProperty } from '@nestjs/swagger'

export class SignInBodyApi {
    @ApiProperty({ example: 'starci@gmail.com', description: 'Email' })
        email: string
  
    @ApiProperty({ example: '123456', description: 'Password' })
        password: string
}

export class SignUpRequestApi {
    @ApiProperty({ example: 'starci@gmail.com', description: 'Email' })
        email: string
  
    @ApiProperty({ example: '123456', description: 'Password' })
        password: string
  
    @ApiProperty({ example: '123456', description: 'Confirm Password' })
        confirm: string
  
    @ApiProperty({ example: 'John', description: 'First Name' })
        firstName: string
        
    @ApiProperty({ example: 'Doe', description: 'Last Name' })
        lastName: string
}

