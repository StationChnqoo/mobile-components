import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// 1. 引入你需要的组件
import { Button } from 'vant'
// 2. 引入组件样式
import 'vant/lib/index.css'
import App from './App.vue'
import router from './router'
import VConsole from 'vconsole'

// 只在开发环境开启
if (import.meta.env.MODE === 'development') {
  new VConsole()
}
const app = createApp(App)

app.use(createPinia())
app.use(router)
let vantComponents = [Button]
for (let vc of vantComponents) {
  app.use(vc)
}
app.mount('#app')
