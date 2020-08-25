<script>
    import { clueBoard, Rooms } from "../../services/my_clue_api";
    import Cell from "./Cell.svelte";
    import { _ } from "svelte-i18n";

</script>

<style>
    .board {
        position: relative;
        display: grid;
        grid-template-columns: repeat(24, 1fr);
        grid-template-rows: repeat(25, 1fr);
        max-width: 480px;
        max-height: 500px;
        column-gap: 2px; /* browser adds 2px ghost gap anyway, breaking layout. At least, setting it fixes layout */
        row-gap: 2px;
        width: 100%;
        background-color: #ecd5b7;
    }

    .room-title {
      font-size: 50%;
    }

    .kitchen {
      position: absolute;
      left: 6%;
      top: 14%;
      color: black;
    }

    .ball {
      position: absolute;
      left: 38%;
      top: 18%;
      color: black;
    }

    .conservatory {
      position: absolute;
      left: 77%;
      top: 12%;
      color: black;
    }

    .dining {
      position: absolute;
      left: 3%;
      top: 51%;
      color: black;
    }

    .billiard {
      position: absolute;
      left: 80%;
      top: 41%;
      color: black;
    }

    .library {
      position: absolute;
      left: 79%;
      top: 65%;
      color: black;
    }

    .lounge {
      position: absolute;
      left: 9%;
      top: 88%;
      color: black;
    }

    .hall {
      position: absolute;
      left: 43%;
      top: 86%;
      color: black;
    }

    .study {
      position: absolute;
      left: 81%;
      top: 92%;
      color: black;
    }
</style>

<div class="board">
    {#each clueBoard as row, y}
            {#each row as cell, x}
                <Cell col={x} row={y}/>
            {/each}
    {/each}

    {#each Rooms as room}
        <div class={`room-title ${room}`}>{$_(`game.room.${room}`)}</div>
    {/each}
</div>
