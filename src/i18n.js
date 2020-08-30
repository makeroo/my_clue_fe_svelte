import { register, init, getLocaleFromNavigator, addMessages } from 'svelte-i18n'

// TODO: switch to async
//register('en', () => import('./locales/en.json'))
//register('it', () => import('./locales/it.json'))
import en from './locales/en.json'
import it from './locales/it.json'

addMessages('en', en)
addMessages('it', it)

init({
  fallbackLocale: 'en',
  initialLocale: getLocaleFromNavigator(),
})
