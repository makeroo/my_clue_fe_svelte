<script>
    import { myDeck } from '../../services/game_service';
    import { _ } from "svelte-i18n";
    import { cardI18nName } from '../../services/be_client';
</script>


<div>
    <ul>
        {#each $myDeck as card}
            <li>{$_(cardI18nName(card))}</li>
        {/each}
    </ul>
</div>
