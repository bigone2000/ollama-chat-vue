import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'highlight.js/styles/github-dark.css' // 導入 highlight.js 的 GitHub 主題
const app = createApp(App)

app.use(createPinia())

app.mount('#app')
