import { writable } from 'svelte/store';

import { GameState } from './my_clue_api.js';

export const currentGame = writable(false)
export const currentGameState = writable(GameState.starting)

export class GameService {
    constructor (beClient) {
        this.beClient = beClient
    }
}

export const key = {}
