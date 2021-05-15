import { createRouter, createWebHistory } from "vue-router";
import { supportedLocales, defaultLocale, setLocale } from "@/plugins/i18n";
import state from '@/state'

const langParam = supportedLocales.join('|')
const routes = [
    { name: 'home', path: `/:lang(${langParam})?/`, component: () => import('@/pages/Home.vue') },
    { path: '/:404(.*)*', component: () => import('@/pages/NotFound.vue') }
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
  state.setPageLoad(true)
    let { lang } = to.params
    if(lang && supportedLocales.includes(lang) && lang != defaultLocale()){
        setLocale(lang)
    }
    
    next()
});

router.afterEach(() => {
    document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0;
    state.setPageLoad(false)
})