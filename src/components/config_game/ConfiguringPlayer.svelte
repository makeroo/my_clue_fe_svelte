<script>
    import { _ } from "svelte-i18n";
    import { myPlayerId, playerCharacter, playerName, playerOnline } from "../../services/game_service.js";

    export let playerId;
    export let hideIfReady;

    let name = playerName(playerId);
    let online = playerOnline(playerId);
    let character = playerCharacter(playerId);

</script>

{#if hideIfReady && $character !== null}
    <div style="display: none"></div>
{:else}
    <div class:online={$online}>{$name}</div>
{/if}
