<script>
    import { getContext } from 'svelte';
    import { clueBoard, CellType, BoardWidth, BoardHeight, GameState } from "../../services/my_clue_api";
    import { key, currentGameState, currentPlayer, playerInCell, isValidMove, myPlayerId } from '../../services/game_service.js';
    import Pawn from "./Pawn.svelte";

    export let col;
    export let row;

    let gameService = getContext(key);

    const cell = clueBoard[row][col];
    let cellClass = `cell ${cell[0]}`;

    if (cell[0] === CellType.Room) {
        // this is a room
        cellClass += ` room-${cell[1]}`

        // search for a door nearby

        if (col > 0 && clueBoard[row][col - 1][0] === CellType.Door && clueBoard[row][col - 1][1] === cell[1]) {
            cellClass += " doorv left";
        } else if (col < BoardWidth - 1 && clueBoard[row][col + 1][0] == CellType.Door && clueBoard[row][col + 1][1] === cell[1]) {
            cellClass += " doorv right";
        } else if (row > 0 && clueBoard[row - 1][col][0] === CellType.Door && clueBoard[row - 1][col][1] === cell[1]) {
            cellClass += " doorv up";
        } else if (row < BoardHeight - 1 && clueBoard[row + 1][col][0] === CellType.Door && clueBoard[row + 1][col][1] === cell[1]) {
            cellClass += " doorv down";
        }

    } else if (cell[0] === CellType.StartingPoint) {
        cellClass += ` start-${cell[2]}`;
    }

    const playerId = playerInCell(col, row);

    function handleClick () {
        if ($currentGameState !== GameState.move) {
            return;
        }

        if ($myPlayerId !== $currentPlayer) {
            return;
        }

        if (!isValidMove($currentPlayer, col, row)) {
            return;
        }

        switch (cell[0]) {
            case CellType.Room:
                gameService.enterRoom(cell[1]);
                break;
            case CellType.Door:
            case CellType.StartingPoint:
            case CellType.Corridor:
                gameService.move(col, row);
        }
    }
</script>

<style>
    .cell {
        position: relative;
        height: 0;
        padding-top: 100%;
    }

    .blank {
        background-color: darkgray;
    }
    .corridor {
        background-color: white;
    }
    .door {
        background-color: white;
    }
    .room {
        background-color: #ecd5b7
    }
    .start-missscarlett {
        background-color: #ff000077;
    }
    .start-revgreen {
        background-color: #00800077;
    }
    .start-colmustard {
        background-color: #ffff0077;
    }
    .start-profplum {
        background-color: #9933cc77;
    }
    .start-mrspeacock {
        background-color: #56b9ff77;
    }
    .start-mrswhite {
        background-color: #e07ac177;
    }

    .doorv {
        background-image: url(../images/door.png);
        background-size: cover;
    }

    .doorv.up {
        transform: rotate(180deg);
    }
    .doorv.left {
        transform: rotate(270deg);
    }
    .doorv.right {
        transform: rotate(90deg);
    }

</style>

<div class={cellClass} on:click={handleClick}>
    {#if $playerId !== null}
        <Pawn playerId={$playerId}/>
    {/if}
</div>
