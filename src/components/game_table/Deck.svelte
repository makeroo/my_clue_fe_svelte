<script>
    import { myDeck } from '../../services/game_service';
    import { _ } from "svelte-i18n";
    import { cardI18nName } from '../../services/be_client';
</script>


<div>
    <div>{$_("game.deck")}</div>
    <div class="deck">
        {#each $myDeck as card}
            <div class="card">{$_(cardI18nName(card))}</div>
        {/each}
    </div>
</div>


<style>
    .deck {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        grid-gap: 1em;
    }

    .card {

    }
</style>