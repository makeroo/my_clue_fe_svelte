<script>
    import { getContext } from "svelte";

    import { _ } from "svelte-i18n";
    import { nameToCard } from "../../services/be_client";
    import { answeringPlayer, currentPlayer, currentQuery, haveCard, key, myPlayerId, playerName, playerPosition } from "../../services/game_service";
    import { Characters, Weapons } from "../../services/my_clue_api";

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
                <p>{$_(`card.${$myPos.room}`)}</p>
            </div>
            <div>
                <p>{$_('query.selection.character')}</p>
                <ul>
                    {#each Characters as char}
                        <li class:selected={char === selectedChar}><button on:click={() => selectChar(char)}>{$_(`card.${char}`)}</button></li>
                    {/each}
                </ul>
            </div>
            <div>
                <p>{$_('query.selection.weapon')}</p>
                <ul>
                    {#each Weapons as weapon}
                        <li class:selected={weapon === selectedWeapon}><button on:click={() => selectWeapon(weapon)}>{$_(`card.${weapon}`)}</button></li>
                    {/each}
                </ul>
            </div>
            <div>
                <button disabled={selectedChar === null || selectedWeapon === null} on:click={ask}>{$_('query.ask')}</button>
                <button on:click={pass}>{$_('query.pass')}</button>
            </div>
        </div>

    {:else}
        <div>
            <div>
                <p>{$_('query.yours')}</p>
                <div>{$_(`card.${$currentQuery.character}`)}</div>
                <div>{$_(`card.${$currentQuery.weapon}`)}</div>
                <div>{$_(`card.${$currentQuery.room}`)}</div>
            </div>
            <p>{$_('query.waiting_for_answer_from', { values: { name: $answeringPlayerName }})}</p>
        </div>
    {/if}

{:else}
    {#if $answeringPlayer === null }
        <div>{$_('query.waiting_for', { values: { name: $currentPlayerName }})}</div>

    {:else if $myPlayerId === $answeringPlayer }
        <div>
            <div>
                <p>{$_('query.of', { values: { name: $currentPlayerName }})}</p>
                <div class="query character"><button type="button" disabled={!haveCharacter} on:click={revealCharacter}>{$_(`card.${$currentQuery.character}`)}</button></div>
                <div class="query weapon"><button type="button" disabled={!haveWeapon} on:click={revealWeapon}>{$_(`card.${$currentQuery.weapon}`)}</button></div>
                <div class="query room"><button type="button" disabled={!haveRoom} on:click={revealRoom}>{$_(`card.${$currentQuery.room}`)}</button></div>
            </div>
            {#if noCardsToShow}
                <div>
                    <button type="button" on:click={dontReveal}>{$_('query.no_cards_to_show')}</button>
                </div>
            {/if}
        </div>

    {:else}
        <div>
            <div>
                <p>{$_('query.of', { values: { name: $currentPlayerName }})}</p>
                <div>{$_(`card.${$currentQuery.character}`)}</div>
                <div>{$_(`card.${$currentQuery.weapon}`)}</div>
                <div>{$_(`card.${$currentQuery.room}`)}</div>
            </div>
            <p>{$_('query.waiting_for_answer_from', { values: { name: $answeringPlayerName }})}</p>
        </div>
    {/if}
{/if}
