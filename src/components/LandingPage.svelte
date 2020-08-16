<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from 'svelte';
    import { key } from '../services/authentication_service.js';

    const authService = getContext(key)

    let name;
    let nameInput;

    function handleSignIn() {
        authService.signIn(name).catch(error => {
            console.log('failed', error)

            // TODO: handle error

            nameInput.focus()
        })
    }

</script>

<h1>{$_('app.name')}</h1>

<p>{$_('landing.first_welcome')}</p>
<p>{$_('landing.presentation')}</p>

<div>
    <label for="username">{$_('landing.username.label')}</label>
    <input id="username" type=text bind:this={nameInput} bind:value={name} placeholder="{$_('landing.username.placeholder')}"/>

    <button type=submit on:click={handleSignIn}>{$_('landing.signin')}</button>
</div>
