<template>
	<Disclosure as="nav" class="bg-gray-800" v-slot="{ open }">
		<div class="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
			<div class="relative flex items-center justify-between h-16">
				<div class="absolute inset-y-0 flex items-center start-0 sm:hidden">
					<!-- Mobile menu button-->
					<DisclosureButton class="inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
						<span class="sr-only">Open main menu</span>
						<MenuIcon v-if="!open" class="block w-6 h-6" aria-hidden="true" />
						<XIcon v-else class="block w-6 h-6" aria-hidden="true" />
					</DisclosureButton>
				</div>
				<div class="flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
					<div class="flex items-center flex-shrink-0">
						<img class="w-auto h-8" src="@/assets/logo.png" alt="Workflow" />
					</div>
					<div class="hidden sm:block sm:ms-6">
						<div class="flex space-s-4">
							<a v-for="item in navigation" :key="item.name" :href="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'px-3 py-2 rounded-md text-sm font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</a>
						</div>
					</div>
				</div>
				<div class="absolute inset-y-0 flex items-center pe-2 end-0 sm:static sm:inset-auto sm:ms-6 sm:pe-0">
					<!-- Profile dropdown -->
					<Menu as="div" class="relative me-3">
						<div>
							<MenuButton class="p-1 text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
								<span class="sr-only">View notifications</span>
								<GlobeIcon class="w-6 h-6" aria-hidden="true" />
							</MenuButton>
						</div>
						<transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
							<MenuItems class="absolute w-32 py-1 mt-2 bg-white rounded-md shadow-lg end-0 origin-top-end ring-1 ring-black ring-opacity-5 focus:outline-none">
								<MenuItem v-slot="{ active }" v-for="(locale, key) in supportedLocales" :key="key">
									<button :class="[active ? 'bg-gray-100' : '', 'block w-full px-4 py-2 text-sm text-gray-700']" @click="changeLocale(locale)">{{ lang.messages[locale].language }}</button>
								</MenuItem>
							</MenuItems>
						</transition>
					</Menu>

					<button class="p-1 text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
						<span class="sr-only">View notifications</span>
						<BellIcon class="w-6 h-6" aria-hidden="true" />
					</button>

					<!-- Profile dropdown -->
					<Menu as="div" class="relative ms-3">
						<div>
						<MenuButton class="flex text-sm bg-gray-800 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
							<span class="sr-only">Open user menu</span>
							<img class="w-8 h-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
						</MenuButton>
						</div>
						<transition enter-active-class="transition duration-100 ease-out" enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100" leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-95 opacity-0">
							<MenuItems class="absolute w-48 py-1 mt-2 bg-white rounded-md shadow-lg end-0 origin-top-end ring-1 ring-black ring-opacity-5 focus:outline-none">
								<MenuItem v-slot="{ active }">
								<a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Your Profile</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
								<a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Settings</a>
								</MenuItem>
								<MenuItem v-slot="{ active }">
								<a href="#" :class="[active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700']">Sign out</a>
								</MenuItem>
							</MenuItems>
						</transition>
					</Menu>
				</div>
			</div>
		</div>

		<DisclosurePanel class="sm:hidden">
			<div class="px-2 pt-2 pb-3 space-y-1">
				<a v-for="item in navigation" :key="item.name" :href="item.href" :class="[item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white', 'block px-3 py-2 rounded-md text-base font-medium']" :aria-current="item.current ? 'page' : undefined">{{ item.name }}</a>
			</div>
		</DisclosurePanel>
	</Disclosure>
</template>

<script setup>
import { ref } from 'vue'
import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { BellIcon, MenuIcon, XIcon, GlobeIcon } from '@heroicons/vue/outline'
import { useI18n, supportedLocales, changeLocaleTo} from '@/plugins/i18n'

const navigation = [
  { name: 'Dashboard', href: '#', current: true },
  { name: 'Team', href: '#', current: false },
  { name: 'Projects', href: '#', current: false },
  { name: 'Calendar', href: '#', current: false },
]

const lang = useI18n()
const open = ref(false)
const locales = supportedLocales

const changeLocale = (locale) => {
	changeLocaleTo(locale, lang)
}
</script>