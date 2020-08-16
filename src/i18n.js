import { addMessages, locale } from 'svelte-i18n';

import en from './locales/en.json';
import it from './locales/it.json';

addMessages('en', en)
addMessages('it', it)

// TODO: detect browser locale
locale.set('en')
