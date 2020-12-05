<script>

	import { BackEndClient, Errors } from './services/be_client.js';
	import { GameService, key as gameServiceKey, currentGame, currentGameState } from './services/game_service.js';
	import { AuthenticationService, key as authServiceKey, loggedUserName } from './services/authentication_service.js';

	import { setContext } from 'svelte';

    import Toast from './components/bricks/Toast.svelte';

	import LandingPage from './components/LandingPage.svelte';
	import StartGame from './components/StartGame.svelte';
	import ConfigureGame from './components/ConfigureGame.svelte';
	import GameTable from './components/GameTable.svelte';

	import { GameState } from './services/my_clue_api';

	//const endpoint = 'ws://localhost:8080/ws'
	// production:
	const endpoint = `ws://${window.location.host}/clue/ws`

	const beClient = new BackEndClient(endpoint)

	setContext(authServiceKey, new AuthenticationService(beClient, "cluedo.auth"))
	setContext(gameServiceKey, new GameService(beClient))

	// initialize i18n
	import './i18n';
	import { _ } from 'svelte-i18n';

</script>

<main>
	{#await $loggedUserName}
		<p>Loading...</p>
	{:then userName}
		{#if !userName}
			<LandingPage error={null}/>
		{:else if !$currentGame}
			<StartGame/>
		{:else if $currentGameState === GameState.starting}
			<ConfigureGame/>
		{:else}
			<GameTable/>
		{/if}
	{:catch error}
		{#if error.error === Errors.NotConnected}
			<div>{$_(`error.${error.error}`)}</div>
		{:else}
			<LandingPage error={error}/>
		{/if}
	{/await}
</main>

<Toast/>
