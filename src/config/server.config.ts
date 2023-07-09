export default () => {
    const port = process.env.PORT || 3000
    const serverUrl = process.env.SERVER_URL || `http://localhost:${port}`

    return {
        port,
        serverUrl: `${serverUrl}/api`
    }
}