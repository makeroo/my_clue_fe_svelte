<script>
    import { _ } from 'svelte-i18n';
    import { getContext, onMount } from 'svelte';
    import { key } from '../services/authentication_service.js';
    import BigButton from './bricks/BigButton.svelte';
    import TextField from './bricks/TextField.svelte';

    const authService = getContext(key)

    export let error;

    let name;
    let nameInput;

    function handleSignIn() {
        authService.signIn(name).catch(error => {
            //console.log('failed', error)

            window.pushToast($_(`error.${error.error}`));

            nameInput.focus();
        })
    }

    onMount(() => {
        if (error) {
            window.pushToast($_(`error.${error.error}`));
        }
    })
</script>

<style>

    p {
        margin-block-start: 0;
        margin-block-end: 0;
    }

    :global(.username) {
        line-height: 2em;
        padding: 4px;
        border-radius: 4px;
        border: 0px;
        background-color: #C0BCC7;
        color: #452921;
    }

    :global(.enter) {
        width: 50%;
        justify-self: center;
    }

</style>

<form on:submit|preventDefault={handleSignIn}>
    <div class="main-grid">
       <h1 class="main-row logo">{$_('app.name')}</h1>

        <p class="wellcome main-row">{$_('landing.first_welcome')}</p>
        <p class="presentation main-row">{$_('landing.presentation')}</p>

        <label for="username" class="main-row">{$_('landing.username.label')}</label>
        <TextField id="username" class="username main-row" placeholder="{$_('landing.username.placeholder')}" bind:value={name} bind:input={nameInput} />

        <BigButton class={`enter main-row ${name ? "valid" : ""}`} on:click={handleSignIn}>{$_('landing.signin')}</BigButton>
    </div>
</form>
