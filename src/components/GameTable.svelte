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

<div class="main-grid">
    <h1 class="main-row logo">{$_('app.name')}</h1>

    <Avatar/>

    <div class="game-code">
        <span>{$_('running_game.game_code')}</span>
        <span class="code">{$currentGame}</span>
    </div>

    <div class="board">
        <Board/>
    </div>

    <!-- players -->
    <div class="main-row">
        <div>{$_("game.players")}</div>
        <div class="turn-sequence">
            {#each $turnSequence as playerId}
                <div class="player-summary">
                    <PlayerSummary playerId={playerId}></PlayerSummary>
                </div>
            {/each}
        </div>
    </div>

    <div class="main-row">
        <Deck></Deck>
    </div>

    <div class="main-row">
        <p>{$_(`game.phase.${$currentGameState}`)}</p>
    </div>

    <div  class="main-row">
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
    </div>

    <div class="main-row">
        <History/>
    </div>
</div>

<style>
    .game-code {
        position: absolute;
        left: .5em;
        top: .5em;
        display: flex;
        flex-direction: column;
    }

    .code {
        color: #C0BCC7;
        font-family: monospace;
        font-weight: 800;
        font-size: 26px;
    }

    .board {
        grid-column-start: 1;
        grid-column-end: 4;
        justify-self: center;
    }

    .turn-sequence {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-gap: 1em;
    }

    .player-summary {
        padding: .5em;
    }
</style>
