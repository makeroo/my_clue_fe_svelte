<script>
    import { myPlayerId, playerName } from '../../services/game_service';

    let myName = playerName($myPlayerId);
</script>


<div class="container">
    {$myName}
</div>


<style>
    .container {
        position: absolute;
        top: .5em;
        right: .5em;
    }
</style>