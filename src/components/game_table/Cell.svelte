<script>
import { clueBoard, CellType, BoardWidth, BoardHeight } from "../../services/my_clue_api";


    export let col;
    export let row;

    const cell = clueBoard[row][col];
    let cellClass = `cell ${cell[0]}`;

    if (cell[0] === CellType.Room) {
        // this is a room
        cellClass += ` room-${cell[1]}`

        // search for a door nearby

        if (col > 0 && clueBoard[row][col - 1][0] === CellType.Door) {
            cellClass += " door-right";
        } else if (col < BoardWidth - 1 && clueBoard[row][col + 1][0] == CellType.Door) {
            cellClass += " door-left";
        } else if (row > 0 && clueBoard[row - 1][col][0] === CellType.Door) {
            cellClass += " door-up";
        } else if (row < BoardHeight - 1 && clueBoard[row + 1][col][0] === CellType.Door) {
            cellClass += " door-down";
        }

    } else if (cell[0] === CellType.StartingPoint) {
        cellClass += ` start-${cell[2]}`;
    }

</script>

<style>
    .cell {
        float: left;
        width: 20px;
        height: 20px;
    }

    .blank {
        background-color: darkgray;
    }
    .corridor {
        border: 1px dashed gray;
        box-sizing: border-box;
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

</style>

<div class={cellClass}></div>
