<script>
    import { getContext } from 'svelte';
    import { _ } from 'svelte-i18n';

    import { loggedUserName, loggedUserGames } from '../services/authentication_service.js';

    let gameId;

    function handleCreate () {
        // TODO
        console.log('create')
    }

    function handleJoin () {
        // TODO
        console.log('join', gameId)
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
                {#each games as game (game.id)}
                    <p>TODO {game}</p>
                {/each}
            </div>
        {/if}
    {/await}

    <div>
        <h2>{$_('start_game.join.title')}</h2>
        <p>{$_('start_game.join.description')}</p>
        <input type="text" bind:value={gameId}/>
        <button type="button" on:click={handleJoin}>{$_('start_game.join.join')}</button>
    </div>

</div>

<!--
    <div className="column half">
        <div className="message"></div>

        { authService.myGames.map(game =>
        <div className="game" key={game.game_id}>
            <button className="join hr" type="button" onClick={() => handleJoin(game.game_id)}>
                <div className="game-code">Codice <span className="code">{game.game_id}</span></div>
                <div className="synopsis">in cui sei {cardCharacterName(game.character)}{
                    game.others &&
                    <span> e stai giocando con {game.others.map((value, index) => {
                        let divider = index === 0 ? '' : index < game.others!.length - 1 ? ', ' : ' e '
                        let char = value.character !== undefined ? ' che è ' + cardCharacterName(value.character) : ''
                        return <span key={index}>{divider}{value.name}{char}</span>
                    })}</span>
                }</div>
                { game.winner !== undefined ?
                <div>
                    <div className="button">Terminata</div>
                    <div>Vincitore: {winner(game)}</div>
                    <div>Soluzione: {cardName(game.solution_character!)}, {cardName(game.solution_room!)}, {cardName(game.solution_weapon!)}</div>
                </div>
                :
                <div className="button">Riprendi</div>
                }
            </button>
        </div>
        )}
    </div>
    }

</div>
-->