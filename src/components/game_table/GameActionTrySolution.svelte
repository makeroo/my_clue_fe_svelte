<script>
    import { getContext } from "svelte";

    import { _ } from "svelte-i18n";

    import { key, myPlayerId, currentPlayer, playerName, revealed, answeringPlayer, revealedCard } from '../../services/game_service.js';
    import { Characters, Rooms, Weapons } from "../../services/my_clue_api.js";

    import BigButton from '../bricks/BigButton.svelte';

    let gameService = getContext(key);
    let currentPlayerName = playerName($currentPlayer);
    let haveSolution = false;
    let selectedRoom = null;
    let selectedChar = null;
    let selectedWeapon = null;
    let answeringPlayerName;

    $: answeringPlayerName = playerName($answeringPlayer);

    function pass() {
        gameService.pass()
    }

    function declareSolution() {
        haveSolution = true;
    }

    function selectRoom(room) {
        selectedRoom = room;
    }

    function selectChar(char) {
        selectedChar = char;
    }

    function selectWeapon(weapon) {
        selectedWeapon = weapon;
    }

    function declare() {
        gameService.declareSolution(selectedChar, selectedRoom, selectedWeapon);
    }
</script>

{#if $revealed !== null }
    {#if $revealedCard }
        <div>{$_('declare.revealed.card', { values: { name: $answeringPlayerName }})}</div>
        <div>{$_(`card.${$revealedCard}`)}</div>
    {:else if $revealed }
        <div>{$_('declare.revealed.unseen', { values: { name: $answeringPlayerName }})}</div>
    {:else}
        <div>{$_('declare.revealed.passed', { values: { name: $answeringPlayerName }})}</div>
    {/if}
{/if}

{#if $myPlayerId !== $currentPlayer }
    <div>
        <div>{$_('game.turn.others', { values: { name: $currentPlayerName }})}</div>
    </div>

{:else if !haveSolution}
    <div>
        <p>{$_('declare.title')}</p>
        <BigButton type="button" on:click={pass}>{$_('declare.pass')}</BigButton>
        <BigButton type="button" on:click={declareSolution}>{$_('declare.solution')}</BigButton>
    </div>

{:else}
    <div>
        <p>{$_('declare.select')}</p>
        <div>
            <div>
                <p>{$_('declare.selection.room')}</p>
                <div class="card-grid">
                    {#each Rooms as room}
                        <div class="card" class:selected={room === selectedRoom}><button on:click={() => selectRoom(room)}>{$_(`card.${room}`)}</button></div>
                    {/each}
                </div>
            </div>
            <div>
                <p>{$_('declare.selection.character')}</p>
                <div class="card-grid">
                    {#each Characters as char}
                        <div class="card" class:selected={char === selectedChar}><button on:click={() => selectChar(char)}>{$_(`card.${char}`)}</button></div>
                    {/each}
                </div>
            </div>
            <div>
                <p>{$_('declare.selection.weapon')}</p>
                <div class="card-grid">
                    {#each Weapons as weapon}
                        <div class="card" class:selected={weapon === selectedWeapon}><button on:click={() => selectWeapon(weapon)}>{$_(`card.${weapon}`)}</button></div>
                    {/each}
                </div>
            </div>
            <div>
                <BigButton disabled={selectedRoom === null || selectedChar === null || selectedWeapon === null} on:click={declare}>{$_('declare.send')}</BigButton>
                <BigButton on:click={pass}>{$_('declare.cancel')}</BigButton>
            </div>
        </div>

    </div>
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
