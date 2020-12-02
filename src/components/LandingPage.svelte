<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from 'svelte';
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

            // TODO: handle error

            nameInput.focus()
        })
    }

</script>

<style>

.grid {
    display: grid;
    grid-template-columns: 1rem minmax(200px, 1fr) 1rem;
    gap: 1rem;
    /*grid-template-rows: ;*/
}

h1 {
    grid-column-start: 2;
    grid-row-end: 1;
    text-align: center;
}

.wellcome {
    grid-row-start: 2;
    grid-column-start: 2;
}

.presentation {
    grid-row-start: 3;
    grid-column-start: 2;
}

p {
    margin-block-start: 0;
    margin-block-end: 0;
}

label {
    grid-row-start: 4;
    grid-column-start: 2;
}

:global(.username) {
    grid-row-start: 5;
    grid-column-start: 2;
    line-height: 2em;
    padding: 4px;
    border-radius: 4px;
    border: 0px;
    background-color: #C0BCC7;
    color: #452921;
}

:global(.enter) {
    grid-row-start: 6;
    grid-column-start: 2;
    width: 50%;
    justify-self: center;
}

</style>

<form on:submit|preventDefault={handleSignIn}>
    <div class="grid">
       <h1>{$_('app.name')}</h1>

        <p class="wellcome">{$_('landing.first_welcome')}</p>
        <p class="presentation">{$_('landing.presentation')}</p>

        <label for="username">{$_('landing.username.label')}</label>
        <TextField id="username" class="username" placeholder="{$_('landing.username.placeholder')}" bind:value={name} bind:input={nameInput} />

        <BigButton class={`enter ${name ? "valid" : ""}`} on:click={handleSignIn}>{$_('landing.signin')}</BigButton>

        {#if error}
            <p style="color: red">{$_(`error.${error.error}`)}</p>
        {/if}
    </div>
</form>
