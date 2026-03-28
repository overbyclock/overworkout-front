import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { Dialog, Loading, Notify, Quasar } from 'quasar'
import { createApp } from 'vue'
import { useAuthStore } from './stores/auth'

// Importar estilos e iconos de Quasar
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import 'quasar/dist/quasar.css'

import './assets/global.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

// Configurar plugin de persistencia
pinia.use(piniaPluginPersistedstate)

app.use(pinia)
app.use(router)
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    Loading,
  },
})

const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
