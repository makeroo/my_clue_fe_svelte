<script>
    import { _ } from "svelte-i18n";

    import { cardToCharacter, cardToRoom, cardToWeapon } from "../../services/be_client";
    import { currentGameSolution } from "../../services/game_service";
</script>

<div>
    <p>{$_('game.end.title')}</p>
    <p>{$_('game.end.solution')}</p>
    <p>{$_(`card.${cardToRoom($currentGameSolution.room)}`)}</p>
    <p>{$_(`card.${cardToWeapon($currentGameSolution.weapon)}`)}</p>
    <p>{$_(`card.${cardToCharacter($currentGameSolution.character)}`)}</p>
</div>
