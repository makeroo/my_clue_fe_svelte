<script>
    import { _ } from "svelte-i18n";
    import { get } from "svelte/store";

    import { MoveType } from "../../services/my_clue_api.js";
    import { cardName } from "../../services/be_client.js";
    import { gameHistory, playerName } from '../../services/game_service.js';

    let pageSize = 5;
    let turns;
    let stickToLastTurn = true;
    let from = 0;
    let to = 0;

    $: turns = $gameHistory.length;

    $: if (stickToLastTurn) {
        from = Math.max(0, turns - pageSize);
        to = Math.min(turns, from + pageSize);
    }

    function name(playerId) {
        let store = playerName(playerId);

        return get(store);
    }

    function rev () {
        if (from === 0) {
            return;
        }

        stickToLastTurn = false;
        from--;
        to = Math.min(turns, from + pageSize);
    }

    function fwd () {
        if (to === turns) {
            return;
        }

        to++;
        from = to - pageSize;
        stickToLastTurn = to === turns;
    }
</script>

<div class="history">
    <div class="pagination">
        <div class="turn">{$_('history.turn', { values: {turn: turns}})}</div>
        <div class="item from">{from}</div>
        <div class="item">&mdash;</div>
        <div class="item to">{to}</div>
        <button class="item rev" type="button" on:click={rev} disabled={from === 0}>{$_('history.previous')}</button>
        <button class="item fwd" type="button" on:click={fwd} disabled={to === turns}>{$_('history.next')}</button>
    </div>
    <div class="turns">
        {#each $gameHistory.slice(from, to) as turn, i}
            <div class="turn">
                <div class="number">{from + i}</div>
                {#if turn.type === MoveType.Start}
                    <div>{$_('history.start')}</div>
                {:else if turn.type === MoveType.RollDices}
                    <div>
                        <div class="player">{name(turn.player_id)}</div>
                        <div class="move">{$_('history.roll_dices')}</div>
                        <div class="dice">{turn.move.dice1}</div>
                        <div class="dice">{turn.move.dice2}</div>
                    </div>
                {:else if turn.type === MoveType.MovingInTheHallway}
                    <div>
                        <div class="player">{name(turn.player_id)}</div>
                        <div class="move">{$_('history.move')}</div>
                        <div class="coord">{turn.move.map_x}</div>
                        <div class="coord">{turn.move.map_y}</div>
                    </div>
                {:else if turn.type === MoveType.EnterRoom}
                    <div>
                        <div class="player">{name(turn.player_id)}</div>
                        <div class="move">{$_('history.enter_room')}</div>
                        <div>{$_(`card.${cardName(turn.move.room)}`)}</div>
                    </div>
                {:else if turn.type === MoveType.QuerySolution}
                    <div>
                        <div class="player">{name(turn.player_id)}</div>
                        <div class="move">{$_('history.query')}</div>
                        <div class="card">{$_(`card.${cardName(turn.move.character)}`)}</div>
                        <div class="card">{$_(`card.${cardName(turn.move.weapon)}`)}</div>
                        <div class="card">{$_(`card.${cardName(turn.state_delta.query.room)}`)}</div>
                    </div>
                {:else if turn.type === MoveType.RevealCard}
                    <div>
                        <div class="player">{name(turn.player_id)}</div>
                        {#if turn.state_delta.revealed_card}
                            <div class="move">{$_('history.card_shown')}</div>
                            <div class="card">{$_(`card.${cardName(turn.state_delta.revealed_card)}`)}</div>
                        {:else}
                            <div class="move">{$_('history.card_shown_hidden')}</div>
                        {/if}
                    </div>
                {:else if turn.type === MoveType.NoCardToReveal}
                    <div>
                        <div class="player">{name(turn.player_id)}</div>
                        <div class="move">{$_('history.card_not_shown')}</div>
                    </div>
                {:else if turn.type === MoveType.Pass}
                    <div>
                        <div class="player">{name(turn.player_id)}</div>
                        <div class="move">{$_('history.pass')}</div>
                    </div>
                {:else if turn.type === MoveType.DeclareSolution}
                    <div>
                        <div class="player">{name(turn.player_id)}</div>
                        <div class="move">{$_('history.declare')}</div>
                        <div class="card">{$_(`card.${cardName(turn.move.character)}`)}</div>
                        <div class="card">{$_(`card.${cardName(turn.move.weapon)}`)}</div>
                        <div class="card">{$_(`card.${cardName(turn.move.room)}`)}</div>
                    </div>
                {:else}
                        <div>{JSON.stringify(turn)}</div>
                {/if}
            </div>
        {/each}
    </div>
</div>


<style>
    .history {
        border-top: 1px solid #C0BCC7;
        margin: 1em;
        padding-top: .5em;
    }

    .pagination {
        display: flex;
        align-items: center;
        height: 2em;
    }

    .pagination .turn {
        flex-grow: 1;
    }

    .pagination .item {
        padding: 4px;
        margin: 4px;
    }

    .turns {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(135px, 1fr));
        grid-gap: 1em;
    }

    .turns .turn {
        background-color: #6f4234;
        border-radius: 8px;
        padding: 4px;
    }

    .turns .turn .number {
        color: #C0BCC7;
        font-family: monospace;
        font-size: 10px;
    }

    .turns .turn .player {
        /*text-shadow:0px 1px 6px #ffffff;*/
        color: #e4b777;
        font-weight: bold;
    }

    .turns .turn .move {
        margin: .5em 0;
    }

    .card {
        background-color: #C0BCC7;
        color: #452921;
        padding: .5em;
        text-align: center;
        border-radius: 8px;
        margin: 1em 0;
    }

    .dice {
        width: 30px;
        height: 30px;
        background-color: #C0BCC7;
        border-radius: 8px;
        text-align: center;
        line-height: 30px;
        color: #5A352A;

        margin: .5em;
        float: left;
    }
</style>
