<script>
    import { getContext } from 'svelte';
    import { _ } from 'svelte-i18n';

    import { loggedUserName, loggedUserGames } from '../services/authentication_service.js';
    import { cardToCharacter } from '../services/be_client.js';
    import { key } from '../services/game_service.js';

    let gameId;
    let gameService = getContext(key);

    function handleCreate () {
        gameService.createGame().catch((error) => {
            console.log('game creation failed', error);

            // TODO: show error
        });
    }

    function handleJoin (gameId) {
        gameService.joinGame(gameId).catch((error) => {
            console.log('join', error);

            // TODO: show error
        });
    }

</script>

<h1>{$_('app.name')}</h1>

{#await $loggedUserName then userName}
<p>Ciao {userName}</p>    
{/await}

<div>
    <div>
        <h2>{$_('start_game.new.title')}</h2>
        <button type=button on:click={handleCreate}>{$_('start_game.new.create')}</button>
    </div>

    {#await $loggedUserGames}
        <p>{$_('start_game.resume.loading')}</p>
    {:then games}
        {#if games.length > 0}
            <div>
                <h2>{$_('start_game.resume.title')}</h2>
                {#each games as game (game.game_id)}
                    <div on:click={() => handleJoin(game.game_id)}>
                        <span>{game.game_id}</span>
                        <span>{$_(`${game.game.state}`)}</span>
                        <div>
                            <span>{$_("start_game.players")}</span>
                            {#each game.players as player (player.player_id)}
                                <div class={player.online? "online" : "offline"}>
                                    {#if player.player_id === game.my_player_id}
                                        <span>{$_('player.me')}</span>
                                    {:else}
                                        <span>{player.name}</span>
                                    {/if}
                                    {#if player.character}
                                        <span>{$_(`game.character.${cardToCharacter(player.character)}`)}</span>
                                    {/if}
                                </div>
                            {/each}
                        </div>
                    </div>
                {/each}
            </div>
        {/if}
    {/await}

    <div>
        <h2>{$_('start_game.join.title')}</h2>
        <p>{$_('start_game.join.description')}</p>
        <input type="text" bind:value={gameId}/>
        <button type="button" on:click={() => handleJoin(gameId)}>{$_('start_game.join.join')}</button>
    </div>

</div>
