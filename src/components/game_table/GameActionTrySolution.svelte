<script>
    import { getContext } from "svelte";

    import { _ } from "svelte-i18n";

    import { key, myPlayerId, currentPlayer, playerName, revealed, answeringPlayer, revealedCard } from '../../services/game_service.js';
    import { Characters, Rooms, Weapons } from "../../services/my_clue_api.js";

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
        <button type="button" on:click={pass}>{$_('declare.pass')}</button>
        <button type="button" on:click={declareSolution}>{$_('declare.solution')}</button>
    </div>

{:else}
    <div>
        <p>{$_('declare.select')}</p>
        <div>
            <div>
                <p>{$_('declare.selection.room')}</p>
                <ul>
                    {#each Rooms as room}
                        <li class:selected={room === selectedRoom}><button on:click={() => selectRoom(room)}>{$_(`card.${room}`)}</button></li>
                    {/each}
                </ul>
            </div>
            <div>
                <p>{$_('declare.selection.character')}</p>
                <ul>
                    {#each Characters as char}
                        <li class:selected={char === selectedChar}><button on:click={() => selectChar(char)}>{$_(`card.${char}`)}</button></li>
                    {/each}
                </ul>
            </div>
            <div>
                <p>{$_('declare.selection.weapon')}</p>
                <ul>
                    {#each Weapons as weapon}
                        <li class:selected={weapon === selectedWeapon}><button on:click={() => selectWeapon(weapon)}>{$_(`card.${weapon}`)}</button></li>
                    {/each}
                </ul>
            </div>
            <div>
                <button disabled={selectedRoom === null || selectedChar === null || selectedWeapon === null} on:click={declare}>{$_('declare.send')}</button>
                <button on:click={pass}>{$_('declare.cancel')}</button>
            </div>
        </div>

    </div>
{/if}
