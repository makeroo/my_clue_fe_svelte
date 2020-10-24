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

<div class:current class="player-summary">
    <span class="name">{$myName}<span>
    <span class="character">{$_(`game.character.${$myChar}`)}</span>
    <span class={$myState}></span>
    <span class={$meOnline ? "online" : "offline"}></span>
</div>
