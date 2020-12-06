<script>
    import { getContext } from 'svelte';
    import { _ } from 'svelte-i18n';

    import { loggedUserName, loggedUserGames } from '../services/authentication_service.js';
    import { cardToCharacter } from '../services/be_client.js';
    import { key } from '../services/game_service.js';
    import BigButton from './bricks/BigButton.svelte';
    import TextField from './bricks/TextField.svelte';

    let gameId;
    let gameService = getContext(key);

    function handleCreate () {
        gameService.createGame().catch((error) => {
            window.pushToast($_(`error.${error.error}`));
        });
    }

    function handleJoin (customGameId) {
        gameService.joinGame(customGameId).catch((error) => {
            window.pushToast($_(`error.${error.error}`));
        });
    }

</script>

<div class="main-grid">
    <h1 class="main-row logo">{$_('app.name')}</h1>

    {#await $loggedUserName then userName}
    <p class="main-row">Ciao {userName}</p>    
    {/await}

    <div class="main-row start-grid">
        <div>
            <h2>{$_('start_game.new.title')}</h2>
            <div class="center">
                <BigButton on:click={handleCreate}>{$_('start_game.new.create')}</BigButton>
            </div>
        </div>

        {#await $loggedUserGames}
            <p>{$_('start_game.resume.loading')}</p>
        {:then games}
        {#if games.length > 0}
        <div class="games-grid">
            <h2>{$_('start_game.resume.title')}</h2>
            {#each games as game (game.game_id)}
                <div class="game" on:click={() => handleJoin(game.game_id)}>
                    <span class="code">{game.game_id}</span>
                    <span class="state">{$_(`game.phase.${game.game.state}`)}</span>
                            <div class="players">
                                <p class="title">{$_("start_game.players")}</p>
                                {#if game.players.length === 1}
                                    <div>nessuno</div>
                                {:else}
                                    {#each game.players as player (player.player_id)}
                                        {#if player.player_id !== game.my_player_id}
                                            <div class={player.online ? "player online" : "player offline"}>
                                                <span class="name">{player.name}</span>
                                                {#if player.character}
                                                    <span class="character">{$_(`card.${cardToCharacter(player.character)}`)}</span>
                                                {/if}
                                            </div>
                                        {/if}
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        {/await}

        <div>
            <h2>{$_('start_game.join.title')}</h2>
            <p>{$_('start_game.join.description')}</p>
            <form on:submit|preventDefault={() => handleJoin(gameId)} class="text-and-go">
                <TextField class="field" bind:value={gameId}/>
                <BigButton>{$_('start_game.join.join')}</BigButton>
            </form>
        </div>

    </div>
</div>


<style>
    .start-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1rem;
    }

    h2 {
        margin-bottom: .5em;
    }

    .center {
        text-align: center;
    }

    .text-and-go {
        display: flex;
        width: 100%;
    }

    .text-and-go :global(.field) {
        flex-grow: 1;
        margin-right: .5em;
    }

    .games-grid {
        display: grid;
        gap: 1rem;
    }

    .game .code {
        color: #C0BCC7;
        font-family: monospace;
        font-weight: 800;
        font-size: 26px;
    }

    .game .state {
        font-style: italic;
    }

    .players {
        margin-top: .5em;
    }

    .player {
        margin-top: .4em;
    }
    .player .name {
        color: #e4b777;
    }

    .player .character {
        color:#bdf7b7;
        text-shadow:0px 1px 6px #ffffff;
    }
</style>
