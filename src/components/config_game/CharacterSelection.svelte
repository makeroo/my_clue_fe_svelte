<script>
    import { _ } from "svelte-i18n";
    import { getContext } from 'svelte';
    import { key, characterPlayer, myPlayerId } from "../../services/game_service.js";
    import BigButton from '../bricks/BigButton.svelte';

    import ConfiguringPlayer from './ConfiguringPlayer.svelte';

    export let character;

    let gameService = getContext(key);

    let myPlayer = characterPlayer(character);

    function selectCharacter() {
        gameService.selectCharacter(character).catch((error) => {
            window.pushToast($_(`error.${error.error}`));
        });
    }

    // BigButton has 3 states: available->-, mine->valid, not available->disabled
    let buttonState;

    $: buttonState = $myPlayer === $myPlayerId ? "valid" : $myPlayer === null ? "" : "disabled";

</script>

<div class="container">
    <BigButton class={buttonState} on:click={selectCharacter}>{$_(`card.${character}`)}</BigButton>
    <div class="name">
        {#if $myPlayer === null }
            <p>{$_('config_game.character_available')}</p>
        {:else}
            <ConfiguringPlayer playerId={$myPlayer} hideIfReady={false}/>
        {/if}
    </div>
</div>


<style>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .name {
        margin-top: .5em;
    }
</style>
