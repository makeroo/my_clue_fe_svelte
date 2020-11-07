<script>
    import { getContext } from 'svelte';
    import { _ } from 'svelte-i18n';

    import { key, myPlayerId, currentPlayer, playerName } from '../../services/game_service.js';

    let gameService = getContext(key);
    let currentPlayerName = playerName($currentPlayer);

    function rollDices() {
        gameService.rollDices().catch((error => {
            console.log('rolling dices failed', error);

            // TODO: handle error
        }));
    }
</script>

{#if $myPlayerId === $currentPlayer }
    <div>{$_('game.turn.mine')}</div>
    <button on:click={rollDices}>{$_('game.action.roll_dices')}</button>
{:else}
    <div>{$_('game.turn.others', { values: { name: $currentPlayerName }})}</div>
{/if}
