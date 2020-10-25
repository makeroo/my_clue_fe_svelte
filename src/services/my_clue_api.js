export const GameState = {
    starting: 0,
    newTurn: 1,
    //card
    move: 3,
    query: 4,
    trySolution: 5,
    ended: 6
};


export const MoveType = {
    Start: 1,
	RollDices: 2,
	MovingInTheHallway: 3,
	EnterRoom: 4,
	QuerySolution: 5,
	NoCardToReveal: 6,
	RevealCard: 7,
	DeclareSolution: 8,
	Pass: 9
}

export const PlayerState = {
    playing: 0,
    failed: 1,
    winner: 2
};

export const Characters = [
    'missscarlett',
    'revgreen',
    'colmustard',
    'profplum',
    'mrspeacock',
    'mrswhite'
];

export const Rooms = [
    "kitchen",
    "ball",
    "conservatory",
    "dining",
    "billiard",
    "library",
    "lounge",
    "hall",
    "study"
];

Rooms.Kitchen = 0;
Rooms.Conservatory = 1;
Rooms.Loung = 6;
Rooms.Study = 8;

export const Weapons = [
    "candlestick",
    "knife",
    "leadpipe",
    "revolver",
    "rope",
    "wrench"
];

export const CellType = {
    Blank: "blank",
    Room: "room", // which room
    Door: "door", // which room, direction
    Corridor: "corridor",
    StartingPoint: "start" // which character
}

const $$ = [CellType.Blank, null, null];
const Ki = [CellType.Room, Rooms[0], null];
const Ba = [CellType.Room, Rooms[1], null];
const Co = [CellType.Room, Rooms[2], null];
const Di = [CellType.Room, Rooms[3], null];
const Bi = [CellType.Room, Rooms[4], null];
const Li = [CellType.Room, Rooms[5], null];
const Lo = [CellType.Room, Rooms[6], null];
const Ha = [CellType.Room, Rooms[7], null];
const St = [CellType.Room, Rooms[8], null];

const _K = [CellType.Door, Rooms[0], null];
const _B = [CellType.Door, Rooms[1], null];
const _C = [CellType.Door, Rooms[2], null];
const _D = [CellType.Door, Rooms[3], null];
const _l = [CellType.Door, Rooms[4], null];
const _L = [CellType.Door, Rooms[5], null];
const _g = [CellType.Door, Rooms[6], null];
const _H = [CellType.Door, Rooms[7], null];
const _S = [CellType.Door, Rooms[8], null];

const MS = [CellType.StartingPoint, null, Characters[0]];
const RG = [CellType.StartingPoint, null, Characters[1]];
const CM = [CellType.StartingPoint, null, Characters[2]];
const PP = [CellType.StartingPoint, null, Characters[3]];
const MP = [CellType.StartingPoint, null, Characters[4]];
const MW = [CellType.StartingPoint, null, Characters[5]];

const __ = [CellType.Corridor, null, null];

export const clueBoard = [
    //00  01  02  03  04  05  06  07  08  09  10  11  12  13  14  15  16  17  18  19  20  21  22  23
    [ $$, $$, $$, $$, $$, $$, $$, $$, $$, MW, $$, $$, $$, $$, RG, $$, $$, $$, $$, $$, $$, $$, $$, $$ ], // 00
    [ Ki, Ki, Ki, Ki, Ki, Ki, $$, __, __, __, Ba, Ba, Ba, Ba, __, __, __, $$, Co, Co, Co, Co, Co, $$ ], // 01
    [ Ki, Ki, Ki, Ki, Ki, Ki, __, __, Ba, Ba, Ba, Ba, Ba, Ba, Ba, Ba, __, __, Co, Co, Co, Co, Co, $$ ], // 02
    [ Ki, Ki, Ki, Ki, Ki, Ki, __, __, Ba, Ba, Ba, Ba, Ba, Ba, Ba, Ba, __, __, Co, Co, Co, Co, Co, $$ ], // 03
    [ Ki, Ki, Ki, Ki, Ki, Ki, __, __, Ba, Ba, Ba, Ba, Ba, Ba, Ba, Ba, __, __, Co, Co, Co, Co, Co, $$ ], // 04
    [ Ki, Ki, Ki, Ki, Ki, Ki, __, _B, Ba, Ba, Ba, Ba, Ba, Ba, Ba, Ba, _B, __, Co, Co, Co, Co, Co, $$ ], // 05
    [ $$, Ki, Ki, Ki, Ki, Ki, __, __, Ba, Ba, Ba, Ba, Ba, Ba, Ba, Ba, __, __, _C, __, __, __, __, $$ ], // 06
    [ __, __, __, __, _K, __, __, __, Ba, Ba, Ba, Ba, Ba, Ba, Ba, Ba, __, __, __, __, __, __, __, MP ], // 07
    [ $$, __, __, __, __, __, __, __, __, _B, __, __, __, __, _B, __, __, __, Bi, Bi, Bi, Bi, Bi, Bi ], // 08
    [ Di, Di, Di, Di, Di, __, __, __, __, __, __, __, __, __, __, __, __, _l, Bi, Bi, Bi, Bi, Bi, Bi ], // 09
    [ Di, Di, Di, Di, Di, Di, Di, Di, __, __, $$, $$, $$, $$, $$, __, __, __, Bi, Bi, Bi, Bi, Bi, Bi ], // 10
    [ Di, Di, Di, Di, Di, Di, Di, Di, __, __, $$, $$, $$, $$, $$, __, __, __, Bi, Bi, Bi, Bi, Bi, Bi ], // 11
    [ Di, Di, Di, Di, Di, Di, Di, Di, _D, __, $$, $$, $$, $$, $$, __, __, __, Bi, Bi, Bi, Bi, Bi, Bi ], // 12

    [ Di, Di, Di, Di, Di, Di, Di, Di, __, __, $$, $$, $$, $$, $$, __, __, __, __, __, _L, __, _l, $$ ], // 13
    [ Di, Di, Di, Di, Di, Di, Di, Di, __, __, $$, $$, $$, $$, $$, __, __, __, Li, Li, Li, Li, Li, $$ ], // 14
    [ Di, Di, Di, Di, Di, Di, Di, Di, __, __, $$, $$, $$, $$, $$, __, __, Li, Li, Li, Li, Li, Li, Li ], // 15
    [ $$, __, __, __, __, __, _D, __, __, __, $$, $$, $$, $$, $$, __, _L, Li, Li, Li, Li, Li, Li, Li ], // 16
    [ CM, __, __, __, __, __, __, __, __, __, __, _H, _H, __, __, __, __, Li, Li, Li, Li, Li, Li, Li ], // 17
    [ $$, __, __, __, __, __, _g, __, __, Ha, Ha, Ha, Ha, Ha, Ha, __, __, __, Li, Li, Li, Li, Li, $$ ], // 18
    [ Lo, Lo, Lo, Lo, Lo, Lo, Lo, __, __, Ha, Ha, Ha, Ha, Ha, Ha, __, __, __, __, __, __, __, __, PP ], // 19
    [ Lo, Lo, Lo, Lo, Lo, Lo, Lo, __, __, Ha, Ha, Ha, Ha, Ha, Ha, __, __, _S, __, __, __, __, __, $$ ], // 20
    [ Lo, Lo, Lo, Lo, Lo, Lo, Lo, __, __, Ha, Ha, Ha, Ha, Ha, Ha, __, __, St, St, St, St, St, St, St ], // 21
    [ Lo, Lo, Lo, Lo, Lo, Lo, Lo, __, __, Ha, Ha, Ha, Ha, Ha, Ha, __, __, St, St, St, St, St, St, St ], // 22
    [ Lo, Lo, Lo, Lo, Lo, Lo, Lo, __, __, Ha, Ha, Ha, Ha, Ha, Ha, __, __, St, St, St, St, St, St, St ], // 23
    [ Lo, Lo, Lo, Lo, Lo, Lo, $$, MS, $$, Ha, Ha, Ha, Ha, Ha, Ha, $$, __, $$, St, St, St, St, St, St ]  // 24
];

export const BoardWidth = 24;
export const BoardHeight = 25;

export function isPlayable(x, y) {
    if (typeof x !== 'number' || typeof y !== 'number') {
        return false;
    }

    if (y < 0 || y >= clueBoard.length) {
        return false;
    }

    const cellRow = clueBoard[y];

    if (x < 0 || x >= cellRow.length) {
        return false;
    }

    const cell = cellRow[x];

    return cell[0] !== CellType.Blank;
}

export let roomToPositions = {};

(function annotateBoard() {
    clueBoard.forEach((rowCells, rowIndex) => {
        rowCells.forEach((cell, colIndex) => {
            if (cell[0] !== CellType.Room) {
                return;
            }

            roomToPositions[cell[1]] = [rowIndex, colIndex];
        });
    });
})();

export const NOT_IN_ROOM = 0;
