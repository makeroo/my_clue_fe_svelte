<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from 'svelte';

    import { currentGame, myPlayerId, playerCharacter, turnSequence } from '../services/game_service.js';
    import { Characters } from '../services/my_clue_api.js';
    import { key, playersWithoutCharacter } from '../services/game_service.js';
    import BigButton from './bricks/BigButton.svelte';

    import CharacterSelection from './config_game/CharacterSelection.svelte';
    import ConfiguringPlayer from './config_game/ConfiguringPlayer.svelte';

    let gameService = getContext(key);

    let votedStart = false;

    let myCharacter = playerCharacter($myPlayerId);

    //let charSel = $myCharacter;

    function voteStart() {
        gameService.voteStart().then(() => {
            votedStart = true;
        }).catch((error) => {
            window.pushToast($_(`error.${error.error}`));
        })
    }

</script>

<div class="main-grid">

    <h1 class="logo main-row">{$_('app.name')}</h1>

    <h2 class="main-row">{$_('config_game.title')}</h2>

    <p class="main-row">
        <span>{$_('config_game.share_game_code')}</span>
        <span class="code">{$currentGame}</span>
    </p>

    <div class="main-row">
        <p>{$_('config_game.select_player')}</p>

        <div class="character-grid">
            {#each Characters as character }
                <CharacterSelection character={character}/>
            {/each}
        </div>
    </div>

    <div class="main-row">
        {#if $turnSequence.length < 2}
            <p>{$_('config_game.not_enough_players')}</p>
        {:else}
            <BigButton disabled={!$myCharacter || votedStart} on:click={voteStart}>{$_('config_game.start')}</BigButton>
        {/if}
    </div>

    {#if $playersWithoutCharacter.length > 0 }
        <div class="main-row">
            <p>{$_('config_game.players_without_character')}</p>
            {#each $turnSequence as playerId }
                <ConfiguringPlayer playerId={playerId} hideIfReady={true}/>
            {/each}
        </div>
    {/if}

    {#if $myCharacter && $turnSequence.length >= 2}
        {#if votedStart}
            <p class="main-row">{$_('config_game.waiting')}</p>
        {:else}
            <p class="main-row">{$_('config_game.press_start')}</p>
        {/if}
    {/if}

</div>


<style>
    .code {
        color: #C0BCC7;
        font-family: monospace;
        font-weight: 800;
        font-size: 26px;
    }

    .character-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-gap: 1em;
        margin: 1em 0;
    }
</style>