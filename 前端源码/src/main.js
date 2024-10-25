import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { router } from './router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia'
// import './mock' // 同步引入

import 'virtual:windi.css'
import 'nprogress/nprogress.css'



const app = createApp(App)

const pinia = createPinia()
app.use(pinia)

app.use(router)
app.use(ElementPlus)

// 全局注册 Element Plus 图标组件
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

// 确保在初始化 Pinia 和其他插件之后再导入权限控制
import "./permission"

app.mount('#app')
