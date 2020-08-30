<script>
    import { _ } from 'svelte-i18n';

    import { currentGame, turnSequence } from '../services/game_service.js';

    import Board from './game_table/Board.svelte';
    import Deck from './game_table/Deck.svelte';
    import Avatar from './game_table/Avatar.svelte';
    import PlayerSummary from './game_table/PlayerSummary.svelte';
</script>

<h1>{$_('app.name')}</h1>

<Avatar></Avatar>
{$_('')}
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

<!-- game state -->

<!-- my actions -->
