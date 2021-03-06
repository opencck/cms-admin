import en from './i18n/en.js';
import ru from './i18n/ru.js';

export default {
	locales: ['en', 'ru'],
	defaultLocale: 'en',
	strategy: 'prefix',
	vueI18n: {
		fallbackLocale: 'en',
		messages: { en, ru },
	},
	detectBrowserLanguage: {
		//Set to always redirect to the value stored in the cookie, not just on first visit.
		alwaysRedirect: true,
	},
};
