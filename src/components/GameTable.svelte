<script>
    import { _ } from 'svelte-i18n';

    import { currentGame, turnSequence, currentGameState } from '../services/game_service.js';
    import { GameState } from '../services/my_clue_api.js';

    import Board from './game_table/Board.svelte';
    import Deck from './game_table/Deck.svelte';
    import Avatar from './game_table/Avatar.svelte';
    import PlayerSummary from './game_table/PlayerSummary.svelte';
    import GameActionNewTurn from './game_table/GameActionNewTurn.svelte';
    import GameActionMove from './game_table/GameActionMove.svelte';
    import GameActionQuery from './game_table/GameActionQuery.svelte';
    import GameActionTrySolution from './game_table/GameActionTrySolution.svelte';
    import GameActionEnded from './game_table/GameActionEnded.svelte';
    import History from './game_table/History.svelte';
</script>

<h1>{$_('app.name')}</h1>

<Avatar></Avatar>

<div>{$_('running_game.game_code')}<span>{$currentGame}</span></div>

<Board></Board>


<!-- players -->
<div>
    <ul>
        {#each $turnSequence as playerId}
            <li>
                <PlayerSummary playerId={playerId}></PlayerSummary>
            </li>
        {/each}
    </ul>
</div>

<Deck></Deck>

<div>
    <p>{$_(`game.phase.${$currentGameState}`)}</p>
</div>

{#if $currentGameState === GameState.newTurn }
    <GameActionNewTurn/>
{:else if $currentGameState === GameState.move }
    <GameActionMove/>
{:else if $currentGameState === GameState.query }
    <GameActionQuery/>
{:else if $currentGameState === GameState.trySolution }
    <GameActionTrySolution/>
{:else if $currentGameState === GameState.ended }
    <GameActionEnded/>
{/if}

<History/>