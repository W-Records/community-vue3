<script setup>
import { reactive, ref } from 'vue'


const dialogTableVisible = ref(false)
const dialogFormVisible = ref(false)
const formLabelWidth = '62px'

const form = reactive({
    userName: '',
    userPassword: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: '',
})

// 导入请求
import { loginService, registerService } from "../api/UserApi.js"
import { ElMessage } from 'element-plus'
// 导入状态库的token状态
import { useTokenStore } from '../stores/token.js'
const tokenStore = useTokenStore();

// 登录
const loginFun = async function () {
    const returnData = await loginService(form.userName, form.userPassword);
    console.log(returnData);
    if (returnData.code == 0) {
        ElMessage.error(returnData.msg);
    }
    if (returnData.code == 1) {
        // 将登录成功返回的JWT存入Pinia状态
        tokenStore.setToken(returnData.data);
        console.log("returnData.data= " + returnData.data)
        console.log("Pinia中取出来的Jwt值_tokenStore.token: " + tokenStore.token)
        ElMessage({
            message: '登录成功',
            type: 'success',
        })
        dialogFormVisible.value = false;

        // 登录成功后刷新页面
        location.reload();
    }
}
// 注册
const registerFun = async function () {
    const returnData = await registerService(form.userName, form.userPassword);
    console.log(returnData);
    if (returnData.code == 0) {
        ElMessage.error(returnData.msg);
    }
    if (returnData.code == 1) {
        ElMessage({
            message: '注册并登录成功',
            type: 'success',
        })
        dialogFormVisible.value = false;
    }
}

// 引入全局事件总线
import eventBus from '../util/eventBus.js';
import { onMounted } from 'vue';
import { onUnmounted } from 'vue';
onMounted(() => {
    const handleMyEvent = () => {
        console.log("事件总线的事件被触发了: openLoginDialog")
        dialogFormVisible.value = true;
    };

    // 订阅事件
    const unsubscribe = eventBus.on('openLoginDialog', handleMyEvent);
    console.log("查看事件总线对象_取消订阅事件>前: ", eventBus);

    // 在组件卸载时记得解绑事件监听器，避免内存泄漏
    onUnmounted(() => {
        console.log("组件被卸载了,取消事件总线事件监听!!!!!!!!!!!!!")
        // 取消订阅事件
        eventBus.off('openLoginDialog', handleMyEvent);
        // 取消订阅所以事件
        eventBus.all.clear();

        console.log("查看事件总线对象_取消订阅事件>后: ", eventBus);
    });
});
</script>

<template>
    <div>
        <!-- 登录弹窗 -->
        <el-button type="primary" plain @click="dialogFormVisible = true">
            登录
        </el-button>
        <el-dialog center v-model="dialogFormVisible" title="登录 | 注册" width="500">
            <hr style="border: 1px solid rgb(244, 239, 239);margin-top: -1px;margin-bottom: 19px;">
            <el-form class="login-form" :model="form">
                <div class="login-form-inner-container">
                    <el-form-item label="账户：" :label-width="formLabelWidth">
                        <el-input v-model="form.userName" autocomplete="off" />
                    </el-form-item>
                    <el-form-item label="密码：" :label-width="formLabelWidth">
                        <el-input v-model="form.userPassword" autocomplete="off" />
                    </el-form-item>
                </div>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" plain @click="registerFun()">
                        注册
                    </el-button>
                    <el-button type="primary" @click="loginFun()">
                        登录
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<style scoped>
.login-form {
    /* border: 1px solid red; */
    display: flex;
    align-items: center;
    /* 垂直居中 */
    justify-content: center;
    /* 水平居中 */
}

.login-form-inner-container {
    /* border: 1px solid green; */
}
</style>
