import { createApp } from 'vue'
import App from './App.vue'

// 导入ElementPlus组件库
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 导入配置好的路由器
import router from './router/index.js'
// 导入pinia
import {createPinia} from 'pinia' 
const pinia = createPinia();
// 导入pinia持久化工具
import { createPersistedState } from 'pinia-persistedstate-plugin'
const persist = createPersistedState();
pinia.use(persist);

const app = createApp(App)


// 需要use一下 ElementPlus才能生效
app.use(ElementPlus)
app.use(router)
app.use(pinia)



// vue3评论组件







app.mount('#app')

