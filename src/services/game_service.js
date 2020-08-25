import { writable, derived, get } from 'svelte/store';

import { GameState, Characters, PlayerState } from './my_clue_api.js';

// Note: these stores are global singletons. They should be game service instance properties instead
// so that we could build an UI capable of playing several games concurrently.
// This is not a requisite though, so let's stick to simpler code structure.

export const currentGame = writable(false)
export const currentGameState = writable(GameState.starting)

// current game infos

export const myPlayerId = writable(null); // int or null
const players = {}; //writable({}); // playerId -> store:string
const playersCharacter = {}; // playerId -> store:Character?
const playersOnline = {}; // playerId -> store:bool
const playersState = {}; // playerId -> store:PlayerState
const charactersPlayer = {}; // character -> store:playerId?

export const turnSequence = writable([]);

export const currentPlayer = writable(0);

// Ideally this is a derived, but its value depends on stores created dinamically as new players
// join the table. Instead of keeping track of subscriptions, building some index, handling
// game change, service reset and so on, we prefer to create a simpler writable to be updated
// whenever we receive an update from the back-end.
export const playersWithoutCharacter = writable([]);

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

export function characterPlayer(character) {
    let store = charactersPlayer[character];

    if (store === undefined) {
        store = writable(null);

        charactersPlayer[character] = store;
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
        characterPlayer(character).set(playerId);
        playerOnline(playerId).set(online);
        playerState(playerId).set(state);

        if (character === null) {
            let pwc = get(playersWithoutCharacter);
            pwc.push(playerId);
            playersWithoutCharacter.set(pwc);
        }

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
            }, 500);
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

                let charStore = playerCharacter(myId);
                let oldChar = get(charStore);
                charStore.set(character);
                characterPlayer(character).set(myId);
                if (oldChar !== null) {
                    characterPlayer(oldChar).set(null);
                } else {
                    let pwc = get(playersWithoutCharacter);

                    playersWithoutCharacter.set(pwc.filter((v) => v != myId));
                }
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
