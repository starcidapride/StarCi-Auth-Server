export class UserDTO {
    readonly email: string
    readonly password: string
    readonly username?: string
    readonly picture?: string
    readonly bio?: string
    readonly firstName: string
    readonly lastName: string
    readonly verified: boolean
}