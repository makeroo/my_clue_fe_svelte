import { Characters, NOT_IN_ROOM, Rooms, Weapons } from './my_clue_api.js';

export let MessageType = {
    signIn: "sign_in",
    signInResponse: "sign_in_response",

    createGame: "create_game",
    createGameResp: "create_game_resp",

    joinGame: "join_game",
	joinGameResp: "join_game_resp",

    selectChar: "select_char",

    voteStart: "vote_start",

    rollDices: "roll_dices",

    move: "move",

    querySolution: "query_solution",

    reveal: "reveal",

    declareSolution: "declare_solution",

    pass: "pass",

    notifyUserState: "notify_user_state",

	notifyGameStarted: "notify_game_started",

	notifyMoveRecord: "notify_move_record",

	error: "error",

    empty: "empty"
};

const GameStateStarting = 0;
const GameStateNewTurn = 1;
const GameStateCard = 2;
const GameStateMove = 3;
const GameStateQuery = 4;
const GameStateTrySolution = 5;
const GameEnded = 6;

const CardCandlestick = 1;
const Knife = 2;
const LeadPipe = 3;
const CardRevolver = 4;
const CardRope = 5;
const CardWrench = 6;

const CardKitchen = 7;
const CardBallroom = 8;
const CardConservatory = 9;
const CardDiningRoom = 10;
const CardBilliardRoom = 11;
const CardLibrary = 12;
const CardLounge = 13;
const CardHall = 14;
const CardStudy = 15;

const CardMissScarlett = 16;
const CardRevGreen = 17;
const CardColMustard = 18;
const CardProfPlum = 19;
const CardMrsPeacock = 20;
const CardMrsWhite = 21;

export const Errors = {
    // server errors
	NotSignedIn: "not_signed_in",
	CannotJoinRunningGame: "cannot_join_running_game",
	TableIsFull: "table_is_full",
	TokenMismatch: "token_mismatch",
	UnknownToken: "unknown_token",
	TooManyGames: "too_many_games",
	UnknownGame: "unknown_game",
	AlreadyPlaying: "already_playing",
	AlreadySelected: "already_selected",
	NotACharacter: "not_a_character",
	NotPlaying: "not_playing",
	GameAlreadyStarted: "game_already_started",
	CharacterNotSelected: "character_not_selected",
	NotYourTurn: "not_your_turn",
	IllegalState: "illegal_state",
	IllegalMove: "illegal_move",
	NotYourCard: "not_your_card",
	MustShowACard: "must_show_a_card",

    // client errors
    NotConnected: "not_connected",
    RequestDidTimeout: "request_did_timeout",
    PayloadDecodingFailed: "payload_decoding_failed"
}

const symbolToCard = {};

(function loadSymbolToCard() {
    let start = 0;
    for (let weapon of Weapons) {
        symbolToCard[weapon] = ++start;
    }
    for (let room of Rooms) {
        symbolToCard[room] = ++start;
    }
    for (let character of Characters) {
        symbolToCard[character] = ++start;
    }
})();

export class BackEndClient {
    retryDelay = 3512;
    requestTimeout = 5678;

    connected = false;
    ws = null;
    delegates = [];
    responseHandler = {};
    requestHandlers = {};
    activeRequest = null;

    constructor (endpoint) {
        this.endpoint = endpoint;

        this.connect();
    }

    addRequestHandler(reqType, handler) {
        // if needed: handle multiple handlers

        this.requestHandlers[reqType] = handler
    }

    // if needed: removeRequestHandler

    addDelegate(delegate) {
        this.delegates.push(delegate)

        if (this.connected) {
            delegate.connected()
        } else {
            delegate.disconnected()
        }
    }

    // if needed: removeDelegate

    signIn(name, token) {
        let req = {}

        if (name !== null) {
            req.name = name;
        }

        if (token !== null) {
            req.token = token;
        }

        return this.request(MessageType.signIn, req)
    }

    createGame() {
        return this.request(MessageType.createGame)
    }

    joinGame(gameId) {
        let req = {
            game_id: gameId
        }

        return this.request(MessageType.joinGame, req)
    }

    selectChar(character) {
        let req = {
            character: symbolToCard[character]
        }

        return this.request(MessageType.selectChar, req)
    }

    voteStart(vote) {
        let req = {
            vote: vote,
        }

        return this.request(MessageType.voteStart, req)
    }

    rollDices() {
        return this.request(MessageType.rollDices)
    }

    enterRoom(room) {
        let req = {
            enter_room: symbolToCard[room]
        }

        return this.request(MessageType.move, req)
    }

    move(mapX, mapY) {
        let req = {
            map_x: mapX,
            map_y: mapY,
        }

        return this.request(MessageType.move, req)
    }

    querySolution(character, room, weapon) {
        let req = {
            character: symbolToCard[character],
            room: symbolToCard[room],
            weapon: symbolToCard[weapon],
        }

        return this.request(MessageType.querySolution, req)
    }

    reveal(card) {
        let req = {
        }

        if (card !== null) {
            req.card = card
        }

        return this.request(MessageType.reveal, req)
    }

    declareSolution(character, room, weapon) {
        let req = {
            character: symbolToCard[character],
            room: symbolToCard[room],
            weapon: symbolToCard[weapon],
        }

        return this.request(MessageType.declareSolution, req)
    }

    pass() {
        return this.request(MessageType.pass)
    }
/*
    oneWay(reqType, data) {
        return new Promise((resolve, reject) => {
            if (this.ws === null) {
                reject({ error: Errors.NotConnected });
                return;
            }

            let header = {
                type: reqType,
                req_id: ++this.requestId,
            };

            this.ws.send(JSON.stringify(header));
            if (data !== undefined) {
                this.ws.send(JSON.stringify(data));
            }

            resolve(undefined);
        })
    }
*/
    requestId = 0

    request(reqType, data) {
        return new Promise((resolve, reject) => {
            if (this.ws === null) {
                reject({ error: Errors.NotConnected });
                return;
            }

            const requestId = ++this.requestId;

            this.responseHandler[requestId] = {
                resolve: resolve,
                reject: reject,
                timeout: setTimeout(() => {
                    let rr = this.responseHandler[requestId];
  
                    delete this.responseHandler[requestId];
    
                    rr.reject({ error: Errors.RequestDidTimeout});
                }, this.requestTimeout),
            };
    
            let header = {
                type: reqType,
                req_id: requestId,
            };

            this.ws.send(JSON.stringify(header));
            if (data !== undefined) {
                this.ws.send(JSON.stringify(data));
            }
        })
    }

    connect() {
        this.ws = new WebSocket(this.endpoint);

        this.ws.onopen = () => {
            console.log('connected to backend', this.ws)

            this.connected = true

            this.fire((delegate) => {
                delegate.connected()
            })
        }

        this.ws.onmessage = (event) => {
            if (this.activeRequest !== null) {
                this.deliverMessage(event.data);

                this.activeRequest = null;

                return;
            }

            try {
                this.activeRequest = JSON.parse(event.data);

                if (this.activeRequest.type === MessageType.empty) {
                    this.deliverMessage(null);

                    this.activeRequest = null;
                }
            } catch (e) {
                console.error('incoming message is not json, request rejected', e);
            }
        }

        this.ws.onerror = (event) => {
            console.error('backend i/o error', event)
        }

        this.ws.onclose = () => {
            console.error('backend disconnected')

            this.connected = false
            this.ws = null

            this.fire((delegate) => {
                delegate.disconnected()
            })

            setTimeout(() => {
                this.connect();
            }, this.retryDelay)
        }
    }

    deliverMessage(msg) {
        let runningRequest = this.responseHandler[this.activeRequest.req_id];

        if (runningRequest !== undefined) {
            clearTimeout(runningRequest.timeout);

            delete this.responseHandler[this.activeRequest.req_id];

            try {
                if (msg !== null) {
                    msg = JSON.parse(msg);
                }

                if (this.activeRequest.type === MessageType.error) {
                    runningRequest.reject(msg);
                } else {
                    runningRequest.resolve(msg);
                }

            } catch (e) {
                runningRequest.reject({
                    error: Errors.PayloadDecodingFailed,
                    cause: e
                });
            }

            return;
        }

        let requestHandler = this.requestHandlers[this.activeRequest.type];

        if (requestHandler !== undefined) {
            try {
                msg = JSON.parse(msg);

                requestHandler.handleMessage(msg);

            } catch (e) {
                console.log("json parsing failed, discarding request", this.activeRequest, msg, e);
            }

            return;
        }

        console.error('unexpected request:', event)
    }

    fire(deliverer) {
        [...this.delegates].forEach(deliverer)
    }
}

export function cardToCharacter(card) {
    if (card >= CardMissScarlett && card <= CardMrsWhite) {
        return Characters[card - CardMissScarlett];
    }
}

export function cardToRoom(card) {
    if (card >= CardKitchen && card <= CardStudy) {
        return Rooms[card - CardKitchen];
    }
}

export function cardToWeapon(card) {
    if (card >= CardCandlestick && card <= CardWrench) {
        return Weapons[card - CardCandlestick];
    }
}

export function cardI18nName(card) {
    let x = cardToCharacter(card);

    if (x) {
        return `character.${x}`;
    }

    x = cardToRoom(card);

    if (x) {
        return `room.${x}`;
    }

    x = cardToWeapon(card)

    if (x) {
        return `weapon.${x}`;
    }
}

export function samePosition(pos1, pos2) {
    if (pos1.room !== pos2.room) {
        return false;
    }

    if (pos1.room !== NOT_IN_ROOM) {
        return true;
    }

    return pos1.map_x === pos2.map_x && pos1.map_y === pos2.map_y;
}
