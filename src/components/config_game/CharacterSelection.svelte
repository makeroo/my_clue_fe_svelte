<script>
    import { _ } from "svelte-i18n";
    import { getContext } from 'svelte';
    import { key, characterPlayer } from "../../services/game_service.js";

    import ConfiguringPlayer from './ConfiguringPlayer.svelte';

    export let character;

    let gameService = getContext(key);

    let myPlayer = characterPlayer(character);

    function selectCharacter() {
        gameService.selectCharacter(character).catch((error) => {
            console.log("azz". error);
            // TODO: show error
        })
    }

</script>

<div>
    <button type=button on:click={selectCharacter}>{$_(`game.character.${character}`)}</button>
    {#if $myPlayer === null }
        <p>{$_('config_game.character_available')}</p>
    {:else}
        <ConfiguringPlayer playerId={$myPlayer} hideIfReady={false}/>
    {/if}
</div>
