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

<div>
    <h1 class="main-row logo">{$_('app.name')}</h1>

    <Avatar/>

    <div class="game-code">
        <span>{$_('running_game.game_code')}</span>
        <span class="code">{$currentGame}</span>
    </div>

    <div class="bpd">
        <div class="board-container">
            <Board/>
        </div>
    
        <div class="players">
            <div>{$_("game.players")}</div>
            <div class="turn-sequence">
                {#each $turnSequence as playerId}
                    <div class="player-summary">
                        <PlayerSummary playerId={playerId}></PlayerSummary>
                    </div>
                {/each}
            </div>
        </div>
    
        <div class="deck-container">
            <Deck></Deck>
        </div>
    </div>

    <div class="phase-actions">
        <div>
            <p>{$_(`game.phase.${$currentGameState}`)}</p>
        </div>

        <div>
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
    </div>

    <History/>
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

    .bpd {
        grid-column-start: 1;
        grid-column-end: 4;

        display: grid;
        grid-gap: 1rem;
    }

    /* breaking points: 690 ... 990 */

    @media (max-width: 690px) {
        .players, .deck-container {
            margin: 0 1em;
        }
    }

    @media (min-width: 691px) and (max-width: 990px) {
        .bpd {
            grid-template-columns: 500px auto;
        }

        .players {
            grid-column-start: 2;
        }

        .deck-container {
            grid-column-start: 1;
            grid-column-end: 3;
            margin: 0 1em;
        }
    }

    @media (min-width: 991px) {
        .bpd {
            grid-template-columns: 500px auto;
            margin-bottom: 1em;
        }

        .board-container {
            grid-row-start: 1;
            grid-row-end: 3;
        }
        .players {
            grid-column-start: 2;
        }

        .deck-container {
            grid-column-start: 2;
            grid-row-start: 2;
        }
    }

    @media (max-width: 513px) {
        :global(.board-container > div) {
            margin: auto;
        }
    }

    @media (min-width: 514px) {
        .board-container {
            padding-left: 1em;
        }
    }

    .turn-sequence {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-gap: 1em;
    }

    .player-summary {
        padding: .5em;
    }

    .phase-actions {
        margin: 0 1em;
    }
</style>
