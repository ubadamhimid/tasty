import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import App from './App.vue'
import './style.css'

const app = createApp(App)
const pinia = createPinia()

// Register plugins
app.use(pinia)
app.use(router)

// Set RTL direction
document.documentElement.setAttribute('dir', 'rtl')

// Mount app
app.mount('#app')
