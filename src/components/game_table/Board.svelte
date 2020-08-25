<script>
    import { clueBoard, Rooms } from "../../services/my_clue_api";
    import Cell from "./Cell.svelte";
    import { _ } from "svelte-i18n";

</script>

<style>
    .board {
        position: relative;
    }

    .row {
        clear: both;
    }

    .kitchen {
      position: absolute;
      left: 30px;
      top: 70px;
      color: black;
    }

    .ball {
      position: absolute;
      left: 185px;
      top: 92px;
      color: black;
    }

    .conservatory {
      position: absolute;
      left: 369px;
      top: 63px;
      color: black;
      font-size: 11px;
    }

    .dining {
      position: absolute;
      left: 16px;
      top: 255px;
      color: black;
    }

    .billiard {
      position: absolute;
      left: 368px;
      top: 206px;
      color: black;
    }

    .library {
      position: absolute;
      left: 377px;
      top: 327px;
      color: black;
    }

    .lounge {
      position: absolute;
      left: 42px;
      top: 438px;
      color: black;
    }

    .hall {
      position: absolute;
      left: 205px;
      top: 431px;
      color: black;
    }

    .study {
      position: absolute;
      left: 387px;
      top: 458px;
      color: black;
    }
</style>

<div class="board">
    {#each clueBoard as row, y}
        <div class="row">
            {#each row as cell, x}
                <Cell col={x} row={y}/>
            {/each}
        </div>
    {/each}

    {#each Rooms as room}
        <div class={room}>{$_(`game.room.${room}`)}</div>
    {/each}
</div>
