<script>
    import { myDeck } from '../../services/game_service';
    import { _ } from "svelte-i18n";
    import { cardI18nName } from '../../services/be_client';
</script>


<div>
    <div>{$_("game.deck")}</div>
    <div class="deck">
        {#each $myDeck as card}
            <div class="card">
                <div class="name">{$_(cardI18nName(card))}</div>
            </div>
        {/each}
    </div>
</div>


<style>
    .deck {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
        grid-gap: 1em;
    }

    .card {
        background-color: #C0BCC7;
        color: #452921;
        padding: .5em;
        text-align: center;
        border-radius: 8px;

        display: grid;
        align-items: center;

        margin: .5em;
        min-height: 3em;
    }
</style>