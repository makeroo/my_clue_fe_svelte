let MessageType = {
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

	notifyMoveRecord: "notify_game_state",

	error: "error",
}

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
const CardWrenck = 6;

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
}

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
            character: characterToCard(character)
        }

        return this.oneWay(MessageType.selectChar, req)
    }

    voteStart(vote) {
        let req = {
            vote: vote,
        }

        return this.oneWay(MessageType.voteStart, req)
    }

    rollDices() {
        return this.oneWay(MessageType.rollDices)
    }

    enterRoom(room) {
        let req = {
            enter_room: roomToCard(room)
        }

        return this.oneWay(MessageType.move, req)
    }

    move(mapX, mapY) {
        let req = {
            map_x: mapX,
            map_y: mapY,
        }

        return this.oneWay(MessageType.move, req)
    }

    querySolution(character, room, weapon) {
        let req = {
            character: characterToCard(character),
            room: roomToCard(room),
            weapon: weaponToCard(weapon),
        }

        return this.oneWay(MessageType.querySolution, req)
    }

    reveal(card) {
        let req = {
        }

        if (card !== null) {
            req.card = card
        }

        return this.oneWay(MessageType.reveal, req)
    }

    declareSolution(character, room, weapon) {
        let req = {
            character: characterToCard(character),
            room: roomToCard(room),
            weapon: weaponToCard(weapon),
        }

        return this.oneWay(MessageType.declareSolution, req)
    }

    pass() {
        return this.oneWay(MessageType.pass)
    }

    oneWay(reqType, data) {
        return new Promise((resolve, reject) => {
            if (this.ws === null) {
                reject({ error: Errors.NotConnected });
                return;
            }

            let header = {
                type: reqType,
                req_id: ++this.requestId,
            }

            this.ws.send(JSON.stringify(header))
            if (data !== undefined) {
                this.ws.send(JSON.stringify(data))
            }

            resolve(undefined)
        })
    }

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
                //requestId: requestId
            }
    
            let header = {
                type: reqType,
                req_id: requestId,
            }

            this.ws.send(JSON.stringify(header))
            if (data !== undefined) {
                this.ws.send(JSON.stringify(data))
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
                let runningRequest = this.responseHandler[this.activeRequest.req_id]

                if (runningRequest !== undefined) {
                    clearTimeout(runningRequest.timeout)

                    delete this.responseHandler[this.activeRequest.req_id]

                    const isError = this.activeRequest.type === MessageType.error
                    this.activeRequest = null

                    let msg;
                    try {
                        msg = JSON.parse(event.data)
                    } catch (e) {
                        console.error('incoming message is not json, ignored', e);
                        return;
                    }

                    if (isError) {
                        runningRequest.reject(msg);
                    } else {
                        runningRequest.resolve(msg);
                    }

                    return
                }

                let requestHandler = this.requestHandlers[this.activeRequest.type]

                if (requestHandler !== undefined) {
                    this.activeRequest = null

                    let msg;
                    try {
                        msg = JSON.parse(event.data) // TODO: catch exception
                    } catch (e) {
                        console.error('incoming message is not json, request rejected', e);
                        return;
                    }

                    requestHandler.handleMessage(msg)

                    return
                }

                this.activeRequest = null

                console.error('unexpected request:', event)
            }

            let req = JSON.parse(event.data) // FIXME: unsafe cast

            this.activeRequest = req
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

    fire(deliverer) {
        [...this.delegates].forEach(deliverer)
    }
}

export function isCharacter(card) {
    return card >= CardMissScarlett && card <= CardMrsWhite;
}

export function isRoom(card) {
    return card >= CardKitchen && card <= CardStudy;
}

export function isWeapon(card) {
    return card >= CardCandlestick && card <= CardWrenck;
}
