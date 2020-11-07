<script>
    import { _ } from 'svelte-i18n';

    import { myPlayerId, currentPlayer, gameTurnState, playerName } from '../../services/game_service.js';

    let currentPlayerName = playerName($currentPlayer);

</script>


<div>
    <div>
        <div>{$_('game.action.move.dices')}</div>
        <div>{$gameTurnState.dice1}</div>
        <div>{$gameTurnState.dice2}</div>
    </div>
    <div>
        {#if $myPlayerId === $currentPlayer }
            <div>{$_('game.action.move.remaining_steps.mine', { values: { steps: $gameTurnState.remaining_steps }})}</div>
        {:else}
            <div>{$_('game.action.move.remaining_steps.others', { values: { name: $currentPlayerName, steps: $gameTurnState.remaining_steps }})}</div>
        {/if}
    </div>
</div>
