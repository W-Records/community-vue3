import {defineStore} from 'pinia'
import { ref } from 'vue'

// 定义coverUrl状态
export const useCoverUrlStore = defineStore('coverUrl',()=>{

    const coverUrl = ref("");

    const setCoverUrl = (newCoverUrl)=>{
        coverUrl.value = newCoverUrl;
    }

    const removeCoverUrl = ()=>{
        coverUrl.value = "";
    }

    // 方法返回的JSON对象
    return {
        coverUrl,setCoverUrl,removeCoverUrl
    }
}
)