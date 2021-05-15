import { ref, provide, inject } from "vue";
import axios from 'axios'

export const supportedLocales = ['ar', 'en'];
export const defaultLocale = () => {
  const locale = window.localStorage.getItem('locale')
  if(supportedLocales.includes(locale)){
    return locale
  }
  return 'ar'
}

export const defaultCountryCode = () => {
  const locale = window.localStorage.getItem('CountryCode')
  return locale || 'EG'
}

export const defaultCurrency = () => {
  const locale = window.localStorage.getItem('Currency')
  return locale || 'EGP'
}

const pluralizationRules = {
  ar: (choice, choicesLength) => {
    
    if (choice === 0 || choice === 1 || choice === 2) {
      return choice;
    }

    if(choice > 2 && choice <= 10){
      return choicesLength == 4 ? 2 : 3;
    }

    return choicesLength - 1;
  }, 
  en: (choice, choicesLength) => {
    if (choice === 0 || choice === 1) {
      return choice;
    }
    
    return choicesLength - 1;
  }
}

const createI18n = config => ({
  locale: ref(config.locale),
  fullLocale: ref(`${config.locale}-${config.countryCode}`),
  currency: ref(config.currency),
  countryCode: ref(config.countryCode),
  messages: config.messages,
  pluralizationRules: {...pluralizationRules, ...config.pluralizationRules},
  $t(key, replaces = {}) {
    let msg = this.messages[this.locale.value][key] || key;
    if(replaces){
      for (const i in replaces) {
        if (Object.hasOwnProperty.call(replaces, i)) {
          msg = msg.replace(`{${i}}`, replaces[i]);
        }
      }
    }
    return msg;
  },
  $tc(key, choice, replaces={}) {
    let msg = this.messages[this.locale.value][key] || '';
    if(replaces){
      for (const i in replaces) {
        if (Object.hasOwnProperty.call(replaces, i)) {
          msg = msg.replace(`{${i}}`, replaces[i]);
        }
      }
    }
    let pluralization = pluralizationRules.en;

    if(pluralizationRules.hasOwnProperty(this.locale.value)){
      pluralization = pluralizationRules[this.locale.value];
    }

    const msgChoices = msg.split('|');
    
    msgChoices.map((v) => {
      v = v.trim();
    })

    const index = pluralization(parseInt(choice), msgChoices.length);

    msg = msgChoices[index] || '';
  
    return msg.replace('@@', choice);

  },
});

const i18nSymbol = Symbol();
let i18n;

export function provideI18n(i18nConfig) {
  i18n = createI18n(i18nConfig);
  setConfig(i18n)
  provide(i18nSymbol, i18n);
}

export function useI18n() {
  const i18n = inject(i18nSymbol);
  if (!i18n) throw new Error("No i18n provided!!!");

  return i18n;
}

function setConfig(i18n){
  setLocale(i18n.locale.value);
  setCountryCode(i18n.countryCode.value)
  setCurrency(i18n.currency.value)
}

export function setLocale(locale){
  i18n.locale.value = locale
	axios.defaults.headers.common['Content-Language'] = locale
	document.querySelector('html').setAttribute('lang', locale)
	document.querySelector('html').setAttribute('dir', locale  == 'ar' ? 'rtl' : 'ltr')
  window.localStorage.setItem('locale', locale)
}

export function setCountryCode(value, i18n){
  if(i18n){
    i18n.countryCode.value = value;
    i18n.fullLocale.value = `${i18n.locale.value}-${value}`;
    axios.defaults.headers.common['Content-Language'] = i18n.fullLocale.value
  }

  window.localStorage.setItem('CountryCode', value)
}

export function setCurrency(value, i18n){
  if(i18n)  i18n.currency.value = value;

  axios.defaults.headers.common['X-Currency'] = value
  window.localStorage.setItem('Currency', value)
}

export const switchLocale = (i18n, router = null) => {
	const locale = i18n.locale.value === "en" ? "ar" : "en";
	changeLocaleTo(locale, i18n, router)
};

export const changeLocaleTo = (locale, i18n, router = null) => {
	i18n.locale.value = locale;
  i18n.fullLocale.value = `${locale}-${i18n.countryCode.value}`;
	setLocale(locale)
	setRouterLocale(locale, router)
};

export const setRouterLocale = (locale, router) => {
	if(router && router.currentRoute.value.params.hasOwnProperty('lang')){
		router.push({ name: router.currentRoute.value.name, params: { lang: locale }, query: router.currentRoute.value.query })
	}
};