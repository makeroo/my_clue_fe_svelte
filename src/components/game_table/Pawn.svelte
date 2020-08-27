<script>

    import { playerCharacter, playerPosition } from "../../services/game_service.js";
    import { BoardHeight, BoardWidth } from "../../services/my_clue_api.js";

    export let playerId;

    const w = 100 / BoardWidth;
    const h = 100 / BoardHeight;

    let character = playerCharacter(playerId);
    let position = playerPosition(playerId);

    function pawn_style(pos) {
        if (pos.room !== null) {
            return "";
        }

        return `position: absolute; left:${pos.map_x * w}%; top:${pos.map_y * h}%;`
    }

    let style = pawn_style($position);

</script>

<style>
    .pawn {
        width: 3%;
        height: 3%;
        margin: 1px;

        background-size: cover;
    }

    .missscarlett {
      background-image: url(images/scarlett.png);
      background-size: cover;
    }
    .revgreen {
      background-image: url(images/green.png);
    }
    .colmustard {
      background-image: url(images/mustard.png);
    }
    .profplum {
      background-image: url(images/plum.png);
    }
    .mrspeacock {
      background-image: url(images/peacock.png);
    }
    .mrswhite {
      background-image: url(images/white.png);
    }
</style>

<div class={`pawn ${$character} ${$position.room === null ? "": $position.room}`} style={style}></div>
