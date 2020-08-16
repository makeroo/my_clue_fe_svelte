<script>

	import { BackEndClient } from './services/be_client.js';
	import { GameService, key as gameServiceKey } from './services/game_service.js';
	import { AuthenticationService, key as authServiceKey } from './services/authentication_service.js';

	import { setContext } from 'svelte';

	import LandingPage from './components/LandingPage.svelte';
	import StartGame from './components/StartGame.svelte';
	import ConfigureGame from './components/ConfigureGame.svelte';
	import GameTable from './components/GameTable.svelte';

	import { GameState } from './services/my_clue_api';

	const endpoint = 'ws://localhost:8080/ws'
	// production:
	//const endpoint = `ws://${window.location.host}/ws`

	const beClient = new BackEndClient(endpoint)

	const authService = new AuthenticationService(beClient)
	const gameService = new GameService(beClient)

	setContext(authServiceKey, authService)
	setContext(gameServiceKey, gameService)


	// initialize i18n
	import './i18n';

</script>

<main>
	{#await authService.isSignedIn()}
		<p>Loading...</p>
	{:then signedIn}
		{#if !signedIn}
			<LandingPage/>
		{:else if !gameService.selectedGame}
			<StartGame/>
		{:else if gameService.selectedGame.state === GameState.starting}
			<ConfigureGame/>
		{:else}
			<GameTable/>
		{/if}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</main>
