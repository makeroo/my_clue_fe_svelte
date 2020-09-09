import { writable, get } from 'svelte/store';

import { GameState, PlayerState } from './my_clue_api.js';

import { MessageType, cardToCharacter } from './be_client.js';

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
const playersPosition = {}; // character -> {map_x:, map_y:, room:}

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

export function playerPosition(character) {
    let store = playersPosition[character];

    if (store === undefined) {
        store = writable({
            map_x: 0,
            map_y: 0,
            room: null
        });

        playersPosition[character] = store;
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
        this.beClient = beClient;

        beClient.addRequestHandler(MessageType.notifyUserState, {
            handleMessage: (msg) => {
                const playerId = msg.player_id;

                if (typeof playerId !== "number") {
                    console.error("illegal user state message: msg=", msg);
                    return;
                }

                if (!get(currentGame)) {
                    console.warn("ignoring user state update, no current game: msg=", msg);
                    return;
                }

                const players = get(turnSequence);

                if (players.find((element) => element === playerId) === undefined) {
                    turnSequence.set([...players, playerId]);
                }

                if (typeof msg.name === "string") {
                    playerName(playerId).set(msg.name);
                }
                if (typeof msg.online === "boolean") {
                    playerOnline(playerId).set(msg.online);
                }

                let character = cardToCharacter(msg.character);

                if (character !== undefined) {
                    const store = playerCharacter(playerId);
                    const oldChar = get(store);

                    if (oldChar !== character) {
                        store.set(character);

                        characterPlayer(character).set(playerId);

                        if (oldChar !== null) {
                            characterPlayer(oldChar).set(null);
                        }
                    }
                }
            }
        });

        beClient.addRequestHandler(MessageType.notifyGameStarted, {
            handleMessage: (msg) => {
                console.log("TODO parse game started")
            }
        });

        beClient.addRequestHandler(MessageType.notifyMoveRecord, {
            handleMessage: (msg) => {
                console.log("TODO parse move record")
            }
        });
    }

    async createGame() {
        return this.beClient.createGame().then((resp) => {
            currentGame.set(resp.game_id);

            myPlayerId.set(resp.my_player_id);
        });
    }

    async joinGame(gameId) {
        return this.beClient.joinGame(gameId).then((resp) => {
            currentGame.set(gameId);

            myPlayerId.set(resp.my_player_id);

            const players = [];

            for (let player of resp.players) {
                const playerId = player.player_id;

                players.push(playerId);

                if (typeof player.name === 'string') {
                    playerName(playerId).set(player.name);
                }

                const ch = cardToCharacter(player.character);

                if (ch !== undefined) {
                    playerCharacter(playerId).set(ch);
                    characterPlayer(ch).set(playerId);
                }

                if (typeof player.online === 'boolean') {
                    playerOnline(playerId).set(player.online);
                }
            }

            turnSequence.set(players);
        });
    }

    async selectCharacter(character) {
        return this.beClient.selectChar(character);
    }

    async voteStart() {
        return this.beClient.voteStart(true);
    }
}

export const key = {}
