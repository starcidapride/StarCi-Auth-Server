
import { ApiProperty } from '@nestjs/swagger'

export type SignInResponse = {
    authTokenSet: AuthTokenSet,
    presentableUser: PresentableUser
}

export type AuthTokenSet =  {
    accessToken: string,
    refreshToken: string
}

export type PresentableUser = {
    email: string,
    username?: string,
    image?: string,
    bio?: string,
    firstName: string,
    lastName: string
}

export type Payload = {
    email: string,
    iat: number,
    exp: number
}

export type SignUpRequest = {
    email: string, 
    password: string, 
    confirm: string,
    firstName: string, 
    lastName: string
}

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
export type SignUpErrors = Partial<{
    emailError: string,
    passwordError: string,
    confirmError: string,
    usernameError: string,
    firstNameError: string,
    lastNameError: string
}>

export type CreateUserErrors = Partial<{
    emailError: 'Email already exists',
    usernameError: 'Username already taken'
    }>

export type VerifyResponse = 'success' | 'time out' | 'already confirmed' | 'not found'