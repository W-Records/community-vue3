// 定制 请求实例
import axios from 'axios'

// 请求实例，设置
const commonURL = 'http://localhost:10010';
const instance = axios.create({baseURL: commonURL});

// 请求拦截器，统一携带token
import {useTokenStore} from '../stores/token.js'
instance.interceptors.request.use(
    (config)=>{
        const tokenStore = useTokenStore();
        console.log("携带的JWT为: " + tokenStore.token);
        config.headers.Authorization = tokenStore.token;
        return config;
    },
    (err)=>{
        console.log("进入到错误响应内：请求拦截器")
        Promise.reject(err);
    }
)

import { ElMessage } from 'element-plus'
import router from "../router/index.js"


// 引入全局事件总线
import eventBus from './eventBus.js';

// 响应拦截器：配置拦截器信息
instance.interceptors.response.use(
    result=>{
        console.log("响应拦截器，拦截到请求！---这是成功响应的返回")

        // 判断是否登录，如果没有登录 则给他路由到登录页面
        if(result.data.state=='flase'){
            ElMessage.error('未登录，跳转登录页面');
            router.push("/login")
        }
        return result.data;
    },
    (err)=>{
        console.log("进入到错误响应内：响应拦截器")
        console.log(err);
        console.log("响应携带的信息: "+err.response.data.errorMessage)
        if(err.response.data.errorMessage=="传递的JWT有误"){
            ElMessage({
                message: '未登录，请先登录',
                type: 'warning',
              })
            // 触发打开登录对话框事件
            eventBus.emit('openLoginDialog');
        }
        return Promise.reject(err)
    }
)

// 将配置好的 请求实例 暴露出去
export default instance;