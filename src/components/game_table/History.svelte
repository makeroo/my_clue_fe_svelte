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

<div>
    <div>
        <div>turno {turns}</div>
        <div>{from}</div>
        <div>{to}</div>
        <button type="button" on:click={rev} disabled={from === 0}>indietro</button>
        <button type="button" on:click={fwd} disabled={to === turns}>avanti</button>
    </div>
    {#each $gameHistory.slice(from, to) as turn}
        {#if turn.type === MoveType.Start}
            <div>start</div>
        {:else if turn.type === MoveType.RollDices}
            <div>
                <div>{name(turn.player_id)}</div>
                <div>lancio dadi</div>
                <div>{turn.move.dice1}</div>
                <div>{turn.move.dice2}</div>
            </div>
    {:else if turn.type === MoveType.MovingInTheHallway}
        <div>
            <div>{name(turn.player_id)}</div>
            <div>spostamento</div>
            <div>{turn.move.map_x}</div>
            <div>{turn.move.map_y}</div>
        </div>
    {:else if turn.type === MoveType.EnterRoom}
        <div>
            <div>{name(turn.player_id)}</div>
            <div>entra nella stanza</div>
            <div>{$_(`card.${cardName(turn.move.room)}`)}</div>
        </div>
    {:else if turn.type === MoveType.QuerySolution}
        <div>
            <div>{name(turn.player_id)}</div>
            <div>domanda</div>
            <div>{$_(`card.${cardName(turn.move.character)}`)}</div>
            <div>{$_(`card.${cardName(turn.move.weapon)}`)}</div>
            <div>{$_(`card.${cardName(turn.state_delta.query.room)}`)}</div>
        </div>
    {:else if turn.type === MoveType.RevealCard}
        <div>
            <div>{name(turn.player_id)}</div>
            {#if turn.state_delta.revealed_card}
                <div>ha mostrato la carta</div>
                <div>{$_(`card.${cardName(turn.state_delta.revealed_card)}`)}</div>
            {:else}
                <div>ha mostrato una carta</div>
            {/if}
        </div>
    {:else if turn.type === MoveType.NoCardToReveal}
        <div>
            <div>{name(turn.player_id)}</div>
            <div>non ha mostrato una carta</div>
        </div>
    {:else if turn.type === MoveType.Pass}
        <div>
            <div>{name(turn.player_id)}</div>
            <div>passa</div>
        </div>
    {:else if turn.type === MoveType.DeclareSolution}
        <div>
            <div>{name(turn.player_id)}</div>
            <div>dichiara la soluzione</div>
            <div>{$_(`card.${cardName(turn.move.character)}`)}</div>
            <div>{$_(`card.${cardName(turn.move.weapon)}`)}</div>
            <div>{$_(`card.${cardName(turn.move.room)}`)}</div>
        </div>
    {:else}
            <div>{JSON.stringify(turn)}</div>
        {/if}
    {/each}
</div>
