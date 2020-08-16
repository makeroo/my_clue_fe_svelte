import { writable } from 'svelte/store';

export const signedIn = writable(Promise.resolve(false));

export class AuthenticationService {
    constructor (beClient) {
        this.beClient = beClient

        this._isSignedIn()
    }

    _isSignedIn() {
        console.log('isSignedIn')

        signedIn.set(new Promise(resolve => {
            setTimeout(() => {
                resolve(this.signed)

            },1000)
        }))
    }

    async signIn(name) {
        if (!name) {
            throw 'empty_name'
        }

        console.log('signedIn', name)

        return new Promise(resolve => {
            setTimeout(() => {
                this.signed = true

                resolve(this.signed)

                signedIn.set(Promise.resolve(true))
            },1000)
        })
    }
}

export const key = {}

