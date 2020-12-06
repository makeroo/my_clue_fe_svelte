<script>
    import { _ } from 'svelte-i18n';

    import { playerName, playerCharacter, currentPlayer, playerOnline, playerState } from '../../services/game_service.js';

    export let playerId;

    let current;

    let myName = playerName(playerId);
    let myChar = playerCharacter(playerId);
    let meOnline = playerOnline(playerId);
    let myState = playerState(playerId);

    current = playerId == $currentPlayer;
</script>

<div class:current class={`player-summary state-${$myState} ${$meOnline ? "online" : "offline"}`}>
    <span class="name">{$myName}</span>
    <span class={`character ${$myChar}`}>{$_(`card.${$myChar}`)}</span>
</div>


<style>
    .player-summary {
        display: flex;
        flex-direction: column-reverse;
        align-items: center;

        padding: .25em;
    }

    .current {
        border: 1px solid #e4b777;
        border-radius: 4px;
    }

    .current .name {
        text-shadow:0px 1px 6px #ffffff;
        color: #e4b777;
    }

    .offline .name {
        color: #C0BCC7;
    }

    .missscarlett {
        color: #ff0000;
    }
    .revgreen {
        color: #008000;
    }
    .colmustard {
        color: #ffff00;
    }
    .profplum {
        color: #9933cc;
    }
    .mrspeacock {
        color: #56b9ff;
    }
    .mrswhite {
        color: #e07ac1;
    }

    .player.state-1 { /* failed */
        background-color: #BDF7B7;
    }

    .player.state-0 { /* winner */
        background-color: #C0BCC7;
    }
/*
    .player.state-0 { / * playing * /

    }

    */
</style>