<template>
	<transition name="fade">
		<div v-if="!AppLoaded.value && store.state.pageLoading" class="fixed top-0 right-0 z-50 flex items-center justify-center w-screen h-screen bg-white">
			<img class="h-14" src="@/assets/logo.png" alt="">
			<svg class="w-10 h-10 mr-3 -ml-1 animate-spin text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
				<path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
			</svg>
		</div>
	</transition>
	<Header />
	<router-view v-slot="{ Component }">
		<transition name="fade">
			<component :is="Component" />
		</transition>
	</router-view>
	
</template>

<script setup>
import en from '@/lang/en.json'
import ar from '@/lang/ar.json'
import { provideI18n, defaultLocale, defaultCountryCode, defaultCurrency } from "@/plugins/i18n";
import { inject, onMounted, ref } from 'vue';
import Header from '@/components/layouts/Header.vue'
const AppLoaded = ref(false)
const store = inject('$state')

provideI18n({
  locale: defaultLocale(),
  currency: defaultCurrency(),
  countryCode: defaultCountryCode(),
  messages: {
    en,
    ar
  }
});

onMounted(() => {
	AppLoaded.value = true

	// let user = window.localStorage.getItem('user')
	// if(user){
	// 	user = JSON.parse(user)
	// 	if(user.logged){
	// 		store.setUser(user.logged, user.token, user.info)
	// 		console.log('user is logged in')
	// 	}
	// }
})



// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>

.fade-enter-active {
  transition: opacity 0.3s ease;
}

.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
	position: absolute;
	opacity: 0;
	width: 100%;
}
</style>