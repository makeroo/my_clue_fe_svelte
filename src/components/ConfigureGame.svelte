<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from 'svelte';

    import { currentGame, myPlayerId, playerCharacter, turnSequence } from '../services/game_service.js';
    import { Characters } from '../services/my_clue_api.js';
    import { key, playersWithoutCharacter } from '../services/game_service.js';

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
            // TODO: show error
        })
    }

</script>

<h1>{$_('app.name')}</h1>

<h2>{$_('config_game.title')}</h2>

<p>{$_('config_game.share_game_code')}<span>{$currentGame}</span></p>

<div>
    <p>{$_('config_game.select_player')}</p>

    <ul>
        {#each Characters as character }
            <li>
                <CharacterSelection character={character}/>
            </li>
        {/each}
    </ul>
</div>

<div>
    {#if $turnSequence.length < 2}
        <p>{$_('config_game.not_enough_players')}</p>
    {:else}
        <input type=submit disabled={!$myCharacter || votedStart} value="{$_('config_game.start')}" on:click={voteStart}>
    {/if}
</div>

{#if $playersWithoutCharacter.length > 0 }
    <div>
        <p>{$_('config_game.players_without_character')}</p>
        {#each $turnSequence as playerId }
            <ConfiguringPlayer playerId={playerId} hideIfReady={true}/>
        {/each}
    </div>
{/if}

{#if $myCharacter && $turnSequence.length >= 2}
    {#if votedStart}
        <p>{$_('config_game.waiting')}</p>
    {:else}
        <p>{$_('config_game.press_start')}</p>
    {/if}
{/if}
