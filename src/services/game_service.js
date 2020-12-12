import { writable, get } from 'svelte/store';

import { GameState, PlayerState, MoveType, clueBoard, CellType, Rooms, isPlayable, BoardWidth, NOT_IN_ROOM, roomToPositions } from './my_clue_api.js';

import { MessageType, cardToCharacter, cardToRoom, samePosition, parseDeclaration, nameToCard, cardName } from './be_client.js';

// Note: these stores are global singletons. They should be game service instance properties instead
// so that we could build an UI capable of playing several games concurrently.
// This is not a requisite though, so let's stick to simpler code structure.

export const currentGame = writable(false)
export const currentGameState = writable(GameState.starting)
export const currentGameSolution = writable(null);

const secretPassages = [
    [Rooms.Kitchen, Rooms.Study],
    [Rooms.Conservatory, Rooms.Lounge]
];

// current game infos

export const myPlayerId = writable(null); // int or null
const players = {}; // playerId -> store:string
const playersCharacter = {}; // playerId -> store:Character?
const playersOnline = {}; // playerId -> store:bool
const playersState = {}; // playerId -> store:PlayerState
const charactersPlayer = {}; // character -> store:playerId?
const playersPosition = {}; // playerId -> {map_x:, map_y:, room:}
const positionToPlayer = []; // y * width + x -> store:playerId?

export const turnSequence = writable([]);

export const currentPlayer = writable(0);
export const answeringPlayer = writable(null);
export const currentQuery = writable(null);
export const revealed = writable(null); // optional bool / three state
export const revealedCard = writable(null); // optional cardname

export const myDeck = writable([]);

export const gameHistory = writable([]);

export const gameTurnState = writable({});

// Ideally this is a derived, but its value depends on stores created dinamically as new players
// join the table. Instead of keeping track of subscriptions, building some index, handling
// game change, service reset and so on, we prefer to create a simpler writable to be updated
// whenever we receive an update from the back-end.
export const playersWithoutCharacter = writable([]);

export function playerName(playerId) {
    if (playerId === null) {
        // can happen when resolving answeringPlayer
        return null;
    }

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

export function playerPosition(playerId) {
    let store = playersPosition[playerId];

    if (store === undefined) {
        store = writable({
            map_x: 0,
            map_y: 0,
            room: NOT_IN_ROOM
        });

        playersPosition[playerId] = store;
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

export function playerInCell(x, y) {
    let k = y * BoardWidth + x;
    let store = positionToPlayer[k];

    if (store === undefined) {
        store = writable(null);

        positionToPlayer[k] = store;
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
                    // maybe a previous game setted it
                    // player indexes are not cleared when changing game
                    console.debug("ignoring user state update, no current game: msg=", msg);
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
                myDeck.set(msg.deck);
                turnSequence.set(msg.players_order);
            }
        });

        beClient.addRequestHandler(MessageType.notifyMoveRecord, {
            handleMessage: (msg) => {
                if (msg.type === MoveType.Start) {
                    gameHistory.set([msg])
                } else {
                    gameHistory.set([...get(gameHistory), msg]);
                }

                const delta = msg.state_delta;

                if (msg.type === MoveType.DeclareSolution) {
                    let state = playerState(msg.player_id);

                    if (delta.state === GameState.ended) {
                        state.set(PlayerState.winner);
                        currentGameSolution.set(msg.move);
                    } else {
                        state.set(PlayerState.failed);
                    }
                }

                if (delta.current_player !== undefined) {
                    currentPlayer.set(delta.current_player);
                }

                if (delta.state !== undefined) {
                    currentGameState.set(delta.state);

                    switch (delta.state) {
                    case GameState.query:
                        if (delta.answering_player != undefined) {
                            answeringPlayer.set(delta.answering_player);
                        }

                        let decl = parseDeclaration(delta.query);
                        if (decl !== undefined) {
                            currentQuery.set(decl);
                        }
                        break;

                    //case GameState.trySolution:
                    //    break;

                    case GameState.newTurn:
                        answeringPlayer.set(null);
                        currentQuery.set(null);
                    }
                }

                if (typeof delta.revealed === 'boolean') {
                    revealed.set(delta.revealed);
                    revealedCard.set(cardName(delta.revealed_card));
                } else {
                    revealed.set(false);
                    revealedCard.set(null);
                }

                if (delta.positions !== undefined) {
                    delta.positions.forEach(position => {
                        if (!get(turnSequence).includes(position.player_id)) {
                            console.error('move record, unknown player in position:', msg);
                            return;
                        }

                        const store = playerPosition(position.player_id);
                        const oldPos = get(store);

                        if (position.room !== NOT_IN_ROOM) {
                            let room = cardToRoom(position.room);

                            if (!room) {
                                console.error('move record, illegal room in position:', msg)

                                return;
                            }

                            let parsedPos = {
                                room
                            }

                            if (samePosition(oldPos, parsedPos)) {
                                console.warn('position not changed:', position)
                                return;
                            }

                            cleanupPositionToPlayer(oldPos)

                            let newPos = assignRoolCellToPlayer(room);

                            storePositionToPlayer(position.player_id, newPos);

                            position = newPos;

                        } else if (!isPlayable(position.map_x, position.map_y)) {
                            console.error('move record, illegal board position:', msg)

                            return;

                        } else {
                            if (samePosition(oldPos, position)) {
                                console.warn('position not changed:', position)
                                return;
                            }

                            cleanupPositionToPlayer(oldPos)

                            storePositionToPlayer(position.player_id, position);
                        }

                        store.set(position)
                    });
                }

                if (msg.type === MoveType.RollDices) {
                    gameTurnState.set(delta);
                } else if (msg.type === MoveType.MovingInTheHallway) {
                    let s = {...get(gameTurnState)};
                    s.remaining_steps = delta.remaining_steps;
                    gameTurnState.set(s);
                }
/*                const gameState = msg.StateDelta
                switch (msg.type) {
                case MoveType.move:
                    break;
                }*/
                /*
                "PlayerID":2,"Timestamp":"2020-09-13T06:44:43.334579992+02:00","Move":{},
                "StateDelta":{"state":5},"type":1}
                */
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

    async rollDices() {
        return this.beClient.rollDices();
    }

    async enterRoom(room) {
        return this.beClient.enterRoom(room);
    }

    async move(x, y) {
        return this.beClient.move(x, y);
    }

    async querySolution(character, room, weapon) {
        return this.beClient.querySolution(character, room, weapon);
    }

    async reveal(card) {
        return this.beClient.reveal(card);
    }

    async declareSolution(character, room, weapon) {
        return this.beClient.declareSolution(character, room, weapon);
    }

    async pass() {
        return this.beClient.pass();
    }
}

function cleanupPositionToPlayer (pos) {
    playerInCell(pos.map_x, pos.map_y).set(null);
}

function storePositionToPlayer(playerId, pos) {
    playerInCell(pos.map_x, pos.map_y).set(playerId)
}

function assignRoolCellToPlayer(room) {
    // warning: this function assumes rooms are big enough
    // to contain every player!

    let availablePositions = roomToPositions[room];

    while (true) {
        let randomPos = Math.floor(Math.random() * availablePositions.length);
        let [map_x, map_y] = availablePositions[randomPos];

        if (isFree(map_x, map_y)) {
            return {
                room,
                map_x,
                map_y
            };
        }
    }
}

export const key = {}

export function isValidMove(playerId, x, y) {
    return isPlayable(x, y) && isAdjacent(playerId, x, y) && isFree(x, y)
}

function isAdjacent (playerId, x, y) {
    // assume isPlayable(x, y) returns true
    const cell = clueBoard[y][x];

    const store = playerPosition(playerId);
    const pos = get(store);

    if (pos.room !== NOT_IN_ROOM) {
        let room = pos.room

        return (
            (cell[0] === CellType.Room && cell[1] === room)
            ||
            (cell[0] === CellType.Door && cell[1] === room)
            ||
            (cell[0] === CellType.Room && isThereASecretPassage(cell[1], room))
        );
    }

    if (cell[0] === CellType.Room) {
        const playerCell = clueBoard[pos.map_y][pos.map_x];

        return playerCell[0] === CellType.Door && playerCell[1] === cell[1];
    }

    const dx = Math.abs(x - pos.map_x);
    const dy = Math.abs(y - pos.map_y);

    return dx + dy === 1;
}

function isThereASecretPassage(room1, room2) {
    for (let passage of secretPassages) {
        if ((passage[0] === room1 && passage[1] === room2) || (passage[1] === room1 && passage[0] === room2)) {
            return true;
        }
    }

    return false;
}

function isFree(x, y) {
    // cell(x,y) must be either door/corridor/start
    return get(playerInCell(x, y)) === null;
}

export function haveCard(cardName) {
    const card = nameToCard(cardName);

    const deck = get(myDeck);

    return deck.includes(card);
}
