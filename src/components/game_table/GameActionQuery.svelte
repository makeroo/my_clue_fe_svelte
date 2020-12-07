<script>
    import { getContext } from "svelte";

    import { _ } from "svelte-i18n";
    import { nameToCard } from "../../services/be_client";
    import { answeringPlayer, currentPlayer, currentQuery, haveCard, key, myPlayerId, playerName, playerPosition } from "../../services/game_service";
    import { Characters, Weapons } from "../../services/my_clue_api";

    import BigButton from '../bricks/BigButton.svelte';

    let gameService = getContext(key);

    let currentPlayerName = playerName($currentPlayer);
    let answeringPlayerName;
    
    $: answeringPlayerName = playerName($answeringPlayer);

    let myPos = playerPosition($myPlayerId);
    let selectedChar = null;
    let selectedWeapon = null;

    let haveWeapon, haveCharacter, haveRoom;

    $: if ($currentQuery === null) {
        haveWeapon = haveCharacter = haveRoom = false;
    } else {
        haveWeapon = haveCard($currentQuery.weapon);
        haveCharacter = haveCard($currentQuery.character);
        haveRoom = haveCard($currentQuery.room);
    }

    let noCardsToShow;
    
    $: noCardsToShow = $myPlayerId === $answeringPlayer && (
        !haveWeapon &&
        !haveCharacter &&
        !haveRoom
    );

    function selectChar(char) {
        selectedChar = char;
    }

    function selectWeapon(weapon) {
        selectedWeapon = weapon;
    }

    function revealCharacter() {
        gameService.reveal(nameToCard($currentQuery.character));
    }

    function revealWeapon() {
        gameService.reveal(nameToCard($currentQuery.weapon));
    }

    function revealRoom() {
        gameService.reveal(nameToCard($currentQuery.room));
    }

    function dontReveal() {
        gameService.reveal(0);
    }

    function ask() {
        gameService.querySolution(selectedChar, $myPos.room, selectedWeapon);
    }

    function pass() {
        gameService.pass()
    }

</script>

{#if $myPlayerId === $currentPlayer }
    {#if $answeringPlayer === null }
        <div>
            <div>
                <p>{$_('query.selection.room')}</p>
                <div class="card-grid">
                    <div class="card"><button>{$_(`card.${$myPos.room}`)}</button></div>
                </div>
            </div>
            <div>
                <p>{$_('query.selection.character')}</p>
                <div class="card-grid">
                    {#each Characters as char}
                        <div class="card" class:selected={char === selectedChar}><button on:click={() => selectChar(char)}>{$_(`card.${char}`)}</button></div>
                    {/each}
                </div>
            </div>
            <div>
                <p>{$_('query.selection.weapon')}</p>
                <div class="card-grid">
                    {#each Weapons as weapon}
                        <div class="card" class:selected={weapon === selectedWeapon}><button on:click={() => selectWeapon(weapon)}>{$_(`card.${weapon}`)}</button></div>
                    {/each}
                </div>
            </div>
            <div>
                <BigButton disabled={selectedChar === null || selectedWeapon === null} on:click={ask}>{$_('query.ask')}</BigButton>
                <BigButton on:click={pass}>{$_('query.pass')}</BigButton>
            </div>
        </div>

    {:else}
        <div>
            <p>{$_('query.yours')}</p>
            <div class="card-grid">
                <div class="card"><button>{$_(`card.${$currentQuery.character}`)}</button></div>
                <div class="card"><button>{$_(`card.${$currentQuery.weapon}`)}</button></div>
                <div class="card"><button>{$_(`card.${$currentQuery.room}`)}</button></div>
            </div>
            <p>{$_('query.waiting_for_answer_from', { values: { name: $answeringPlayerName }})}</p>
        </div>
    {/if}

{:else}
    {#if $answeringPlayer === null }
        <div>{$_('query.waiting_for', { values: { name: $currentPlayerName }})}</div>

    {:else if $myPlayerId === $answeringPlayer }
        <div>
            <p>{$_('query.of', { values: { name: $currentPlayerName }})}</p>
            <div class="card-grid">
                <div class="card query character"><button type="button" disabled={!haveCharacter} on:click={revealCharacter}>{$_(`card.${$currentQuery.character}`)}</button></div>
                <div class="card query weapon"><button type="button" disabled={!haveWeapon} on:click={revealWeapon}>{$_(`card.${$currentQuery.weapon}`)}</button></div>
                <div class="card query room"><button type="button" disabled={!haveRoom} on:click={revealRoom}>{$_(`card.${$currentQuery.room}`)}</button></div>
            </div>
            {#if noCardsToShow}
                <div>
                    <BigButton on:click={dontReveal}>{$_('query.no_cards_to_show')}</BigButton>
                </div>
            {/if}
        </div>

    {:else}
        <div>
            <p>{$_('query.of', { values: { name: $currentPlayerName }})}</p>
            <div class="card-grid">
                <div class="card"><button>{$_(`card.${$currentQuery.character}`)}</button></div>
                <div class="card"><button>{$_(`card.${$currentQuery.weapon}`)}</button></div>
                <div class="card"><button>{$_(`card.${$currentQuery.room}`)}</button></div>
            </div>
            <p>{$_('query.waiting_for_answer_from', { values: { name: $answeringPlayerName }})}</p>
        </div>
    {/if}
{/if}


<style>
    .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
        grid-gap: 1em;
    }

    .selected button {
        background-color: #BDF7B7;
    }

    .card button {
        min-height: 3em;
        width: 100%;
        border-radius: 8px;
        border: 0;
        margin: .5em;
        font-family: 'Comfortaa';
        font-size: initial;
        outline: none;
    }
</style>
