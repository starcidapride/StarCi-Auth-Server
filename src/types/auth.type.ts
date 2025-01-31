import { DeckCollection } from '@apptypes/deck.type'

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
    picture?: string,
    bio?: string,
    firstName: string,
    lastName: string,
    deckCollection?: DeckCollection
}


export type EmailType = 'verify' | 'forgetPassword'

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

export type SignUpErrors = Partial<{
    emailError: string,
    passwordError: string,
    confirmError: string,
    firstNameError: string,
    lastNameError: string
}>

export type CreateUserErrors = Partial<{
    emailError: 'Email already exists',
    usernameError: 'Username already taken'
    }>

export type VerifyResponse = 'success' | 'time out' | 'already confirmed' | 'not found'

export type ResetPasswordResponse = 'success' | 'time out' | 'not found'
