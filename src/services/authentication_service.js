import { writable } from 'svelte/store';

import { Errors as BackEndErrors } from './be_client.js';

export const loggedUserName = writable(Promise.resolve(false));

export const loggedUserGames = writable(Promise.resolve([]));

const Errors = {
    EmptyName: 'empty_name'
}

export class AuthenticationService {
    constructor (beClient, localStoragePrefix) {
        this.beClient = beClient;
        this.localStorageKey = localStoragePrefix + '.user';

        this.beClient.addDelegate({
            connected: () =>  {
                const token = this.storedToken();
                const name = this.storedName();

                if (token === null && name === null) {
                    loggedUserName.set(Promise.resolve(false));
                    return;
                }

                loggedUserName.set(this.authenticate());
            },

            disconnected: () => {
                loggedUserName.set(Promise.reject({error: BackEndErrors.NotConnected}));
            }
        });
    }

    async signIn(name) {
        if (!name) {
            throw { error: Errors.EmptyName };
        }

        this.storeName(name);

        const p = this.authenticate();

        loggedUserName.set(p);

        return p;
    }

    // private

    storedName() {
        return localStorage.getItem(this.localStorageKey + '.name') || null;
    }

    storeName(name) {
        return localStorage.setItem(this.localStorageKey + '.name', name);
    }

    storedToken() {
        return localStorage.getItem(this.localStorageKey + '.token') || null;
    }

    storeToken(t) {
        return localStorage.setItem(this.localStorageKey + '.token', t);
    }

    async authenticate() {
        const name = this.storedName();

        return this.beClient.signIn(name, this.storedToken()).then((resp) => {
            if (typeof resp.error === 'string') {
                throw resp
            }

            if (typeof resp.token === 'string') {
                this.storeToken(resp.token)
            }

            loggedUserGames.set(Promise.resolve(resp.running_games || []));

            // return name so that loggedUserName promise will resolve to it
            return name;
        }).catch((e) => {
            if (e.error === BackEndErrors.UnknownToken) {
                this.invalidateToken();
            }

            throw e;
        });
    }

    invalidateToken() {
        localStorage.removeItem(this.localStorageKey + '.token');
    }
}

export const key = {};

