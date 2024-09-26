import {defineStore} from 'pinia'
import { ref } from 'vue'

// 定义token状态
export const useTokenStore = defineStore('token',()=>{

    const token = ref("");

    const setToken = (newToken)=>{
        token.value = newToken;
    }

    const removeToken = ()=>{
        token.value = "";
    }

    // 方法返回的JSON对象
    return {
        token,setToken,removeToken
    }
},
    {
        persist: true
    }
)