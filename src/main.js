import { createApp } from 'vue'
import {router} from '@/plugins/router'
import Root from '@/App.vue'
import './index.css'
import state from '@/state'
import axios from 'axios'
import clickOutside from './directive/click-outside'

const app = createApp(Root);
app.use(router)
app.directive("click-outside", clickOutside)
app.provide('$state', state);
axios.defaults.baseURL = 'https://localhost'
app.provide('$axios', axios);
app.mount('#app')
