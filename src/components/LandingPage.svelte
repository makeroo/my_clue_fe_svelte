<script>
     import { _ } from 'svelte-i18n';
</script>

<h1>{$_('app.name')}</h1>

<p>{$_('landing.first_welcome')}</p>
<p>{$_('landing.presentation')}</p>

<div>
    <label for="username">{$_('landing.username.label')}</label>
    <input id="username" type=text placeholder="{$_('landing.username.placeholder')}"/>

    <button type=submit>{$_('landing.signin')}</button>
</div>
