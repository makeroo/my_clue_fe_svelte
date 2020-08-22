import { writable, derived, get } from 'svelte/store';

import { GameState, Characters, PlayerState } from './my_clue_api.js';

export const currentGame = writable(false)
export const currentGameState = writable(GameState.starting)

// current game infos:

export const myPlayerId = writable(null); // int or null
const players = {}; //writable({}); // playerId -> store:string
const playersCharacter = {}; // playerId -> store:Character
const playersOnline = {}; // playerId -> store:bool
const playersState = {}; // playerId -> store:PlayerState

export const turnSequence = writable([]);

export const currentPlayer = writable(0);

export function playerName(playerId) {
    let store = players[playerId];

    if (store === undefined) {
        store = writable("");

        players[playerId] = store;
    }

    return store;
}

export function playerCharacter(playerId) {
    let store = playersCharacter[playerId];

    if (store === undefined) {
        store = writable(null);

        playersCharacter[playerId] = store;
    }

    return store;
}

export function playerOnline(playerId) {
    let store = playersOnline[playerId];

    if (store === undefined) {
        store = writable(false);

        playersOnline[playerId] = store;
    }

    return store;
}

export function playerState(playerId) {
    let store = playersState[playerId];

    if (store === undefined) {
        store = writable(PlayerState.playing);

        playersState[playerId] = store;
    }

    return store;
}

export class GameService {
    constructor (beClient) {
        this.beClient = beClient
    }

    _addPlayer(playerId, name, character, online, state) {
        playerName(playerId).set(name);
        playerCharacter(playerId).set(character);
        playerOnline(playerId).set(online);
        playerState(playerId).set(state);

        let seq = get(turnSequence);
        seq.push(playerId);
        turnSequence.set(seq);
    }

    createGame() {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve()

                currentGame.set('XIWE')

                myPlayerId.set(1)
                this._addPlayer(1, "cass", null, true, PlayerState.playing)
                currentGameState.set(GameState.starting)
            },100)

            setTimeout(() => {
                this._addPlayer(2, "gre", Characters[1], true, PlayerState.playing)
                this._addPlayer(3, "morg", null, false, PlayerState.playing)
            }, 2500);
        })
    }

    selectCharacter(character) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let myId = get(myPlayerId);

                if (myId === null) {
                    reject("no selected game")
                    return;
                }

                resolve()

                playerCharacter(myId).set(character);
            }, 10)
        });
    }

    voteStart() {
        return new Promise(resolve => {
            setTimeout(() => {
                currentGameState.set(GameState.newTurn);
/*
                players.set({
                    1: 'cass',
                    2: 'gre',
                    3: 'morga'
                });

                playerCharacter.set({
                    1: Characters[0],
                    2: Characters[1],
                    3: Characters[2],
                });

                turnSequence.set([1,2,3]);
                currentPlayer.set(1);

                playerOnline.set({
                    1: true,
                    2: true,
                    3: true,
                });

                playerState.set({
                    1: PlayerState.playing,
                    2: PlayerState.failed,
                    3: PlayerState.playing,
                })
*/
                resolve();
            }, 10)
        })
    }
}

export const key = {}
