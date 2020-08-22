import { writable } from 'svelte/store';

export const loggedUserName = writable(Promise.resolve(false));

export const loggedUserGames = writable(Promise.resolve([]));

export class AuthenticationService {
    constructor (beClient) {
        this.beClient = beClient

        this._isSignedIn()
    }

    _isSignedIn() {
        //console.log('isSignedIn')

        loggedUserName.set(new Promise(resolve => {
            setTimeout(() => {
                resolve(false)

            },100)
        }))
    }

    async signIn(name) {
        if (!name) {
            throw 'empty_name'
        }

        //console.log('signedIn', name)

        return new Promise(resolve => {
            setTimeout(() => {
                resolve(name)

                loggedUserName.set(Promise.resolve(name))
                // TODO: fill loggedUserGames
            },100)
        })
    }
}

export const key = {}

