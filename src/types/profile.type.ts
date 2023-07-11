export type SetupProfileRequest = {
    username: string,
    picture: string,
    bio: string
}

export type SetupProfileError = {
    usernameError?: string
}