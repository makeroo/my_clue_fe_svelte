export class AuthenticationService {
    constructor (beClient) {
        this.beClient = beClient
    }

    async isSignedIn() {
        return false // TODO
    }
}

export const key = {}

