import { reactive, readonly } from "vue";
import axios from 'axios'

const state = reactive({
    pageLoading: false,
    user: {
        logged: false,
        token: '',
        info: {}
    }
})

export default {
    // state,
    state: readonly(state),
    locale: reactive({}),
    setPageLoad(value){
        state.pageLoading = value
    },
    setUser(logged, token, info = null){
        state.user.logged = logged
        state.user.token = token
        if(info) state.user.info = info
        
        window.localStorage.setItem('user', JSON.stringify(state.user))
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },
    logout(){
        state.user = {
            logged: false,
            token: '',
            info: {}
        }
        window.localStorage.removeItem('user')
        delete axios.defaults.headers.common['Authorization']
    },
}