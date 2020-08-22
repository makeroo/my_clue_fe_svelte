<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from 'svelte';

    import { currentGame, myPlayerId, playerCharacter, turnSequence } from '../services/game_service.js';
    import { Characters } from '../services/my_clue_api.js';
    import { key } from '../services/game_service.js';

    let gameService = getContext(key);

    let votedStart = false;

    /* I'm not satisfied at all with this solution: myCharacter is a derived so bind:group doesn't work, I cannot use two way binding
    because derived stores are readonly. So I resolved to create a tmp var, charSel and an on:click handler.

    Note: char selection is asynchronous, it's a request to b/e that assign the character providing no other player choosed it.
    Clue BE API define selectchar as a oneway request: its result is broadcasted to every player at the table.
    */
    let myCharacter = playerCharacter($myPlayerId);

    let charSel = $myCharacter;
    //let myName = playerName(myPlayerId);

    let playersWithoutCharacter = [];

    playersWithoutCharacter = getPlayersWithoutCharcters($turnSequence)

    function getPlayersWithoutCharcters(players) {
        let r = [];
/*
        for (const pid of players) {
            let pcStore = playerCharacter(pid)
            let character = get(pcStore);
            if (!character) {
                let name = playerName(pid);
                let online = playerOnline(pid);

                r.push([get(name), get(online)]);
            }
        }
*/
        return r;
    }

    function selectCharacter(character) {
        gameService.selectCharacter(character).catch((error) => {
            // restore previous selected character if any
            charSel = $myCharacter || 0;

            console.log("azz". error);
            // TODO: show error
        })
    }

    function voteStart() {
        gameService.voteStart().then(() => {
            votedStart = true;
        }).catch((error) => {
            // TODO: show error
        })
    }

</script>

<h1>{$_('app.name')}</h1>

<h2>{$_('config_game.title')}</h2>

<p>{$_('config_game.share_game_code')}<span>{$currentGame}</span></p>

<div>
    <p>{$_('config_game.select_player')}</p>

    <ul>
        {#each Characters as character }
            <li>
                <label for={character}>{$_(`game.character.${character}`)}</label>
                <input type=radio id={character} value={character} bind:group={charSel} on:click={() => selectCharacter(character)}>
                <!-- TODO: taken feedback -->
            </li>
        {/each}
    </ul>
</div>

<input type=submit disabled={!$myCharacter || votedStart} value="{$_('config_game.start')}" on:click={voteStart}>

{#if playersWithoutCharacter.length > 0}
    <div>
        <p>{$_('config_game.players_without_character')}</p>
        <ul>
            {#each playersWithoutCharacter as [name, online] }
                <li class={online ? "online" : "offline"}>{name}</li>
            {/each}
        </ul>
    </div>
{/if}

{#if $myCharacter}
    {#if votedStart}
        <p>{$_('config_game.waiting')}</p>
    {:else}
        <p>{$_('config_game.press_start')}</p>
    {/if}
{/if}
