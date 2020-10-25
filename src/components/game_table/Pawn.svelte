<script>
    import { playerCharacter } from "../../services/game_service.js";

    export let playerId;

    let character = playerCharacter(playerId);
</script>

<style>
    .pawn {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;

        background-size: cover;
    }

    .missscarlett {
        background-image: url(../images/scarlett.png);
      background-size: cover;
    }
    .revgreen {
      background-image: url(../images/green.png);
    }
    .colmustard {
      background-image: url(../images/mustard.png);
    }
    .profplum {
      background-image: url(../images/plum.png);
    }
    .mrspeacock {
      background-image: url(../images/peacock.png);
    }
    .mrswhite {
      background-image: url(../images/white.png);
    }
</style>

<div class={`pawn ${$character} `}></div>
