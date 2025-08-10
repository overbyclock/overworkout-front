import { createPinia } from 'pinia'
import { Dialog, Loading, Notify, Quasar } from 'quasar'
import { createApp } from 'vue'

// Importar estilos e iconos de Quasar
import '@quasar/extras/material-icons-outlined/material-icons-outlined.css'
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/mdi-v7/mdi-v7.css'
import 'quasar/dist/quasar.css'

import './assets/global.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {
    Notify,
    Dialog,
    Loading,
  },
})

app.mount('#app')
