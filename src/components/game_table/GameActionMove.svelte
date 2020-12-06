<script>
    import { _ } from 'svelte-i18n';

    import { myPlayerId, currentPlayer, gameTurnState, playerName } from '../../services/game_service.js';

    let currentPlayerName = playerName($currentPlayer);

</script>


<div>
    <div class="dices">
        <div>{$_('game.action.move.dices')}</div>
        <div class="dice">{$gameTurnState.dice1}</div>
        <div class="dice">{$gameTurnState.dice2}</div>
    </div>
    <div>
        {#if $myPlayerId === $currentPlayer }
            <div>{$_('game.action.move.remaining_steps.mine', { values: { steps: $gameTurnState.remaining_steps }})}</div>
        {:else}
            <div>{$_('game.action.move.remaining_steps.others', { values: { name: $currentPlayerName, steps: $gameTurnState.remaining_steps }})}</div>
        {/if}
    </div>
</div>


<style>
    .dices {
        display: flex;
        align-items: center;
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
    }
</style>