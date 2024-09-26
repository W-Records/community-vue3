<template>
    <!-- <el-radio-group v-model="direction">
        <el-radio value="ltr">left to right</el-radio>
        <el-radio value="rtl">right to left</el-radio>
        <el-radio value="ttb">top to bottom</el-radio>
        <el-radio value="btt">bottom to top</el-radio>
    </el-radio-group> -->

    <!-- <el-button type="primary" style="margin-left: 16px" @click="drawer = true">
        open
    </el-button> -->
    <el-badge :value="MyNotReadCommentCount" class="item">
        <el-button :key="'info'" :type="'info'" link style="margin-left: 8px"
            @click="drawer2 = true; GetReplyCommentData()">
            <el-icon :size="25">
                <BellFilled />
            </el-icon>
        </el-button>
    </el-badge>

    <el-drawer v-model="drawer" title="I am the title" :direction="direction" :before-close="handleClose">
        <span>Hi, there!</span>
    </el-drawer>
    <el-drawer v-model="drawer2" :direction="direction" :size="'36%'">
        <template #header>
            <h2>回复我的评论</h2>
        </template>
        <template #default>
            <div>
                <div v-for="(ReplyComment, index) in ReplyCommentDatas" :key="ReplyComment.id" style="margin-bottom: 10px;">
                    <el-card style="width: 480px" shadow="hover">
                        <el-row>
                            <el-col :span="4">
                                <div class="TopCommentAvatar">
                                    <div>
                                        <el-avatar :size="53"
                                            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                                    </div>
                                </div>
                            </el-col>
                            <el-col :span="20">
                                <div class="TopCommentContent">
                                    <div style="margin-bottom: 12px;">
                                        <div style="margin-bottom: 7px;">
                                            <span>{{ ReplyComment.userName }}</span>
                                            &nbsp;
                                            <el-text class="mx-1" type="info">回复了我的评论</el-text>
                                        </div>
                                        <div style="margin-bottom: 7px;">{{ ReplyComment.content }}</div>
                                        <el-text class="mx-1" type="info">
                                            <span>{{ ReplyComment.createTime }}</span>
                                        </el-text>
                                    </div>
                                </div>
                            </el-col>
                        </el-row>
                    </el-card>
                </div>
            </div>
        </template>
        <!-- <template #footer>
            <div style="flex: auto">
                <el-button @click="cancelClick">cancel</el-button>
                <el-button type="primary" @click="confirmClick">confirm</el-button>
            </div>
        </template> -->
    </el-drawer>
</template>
  
<script lang="ts" setup>
// 导入请求
import { getReplyCommentService, changeCommentReadOrNotService, getNotReadCommentCountService } from "../api/CommentApi.js"
import {
    Document,
    Menu as IconMenu,
    Location, Loading, View, Star, User,
    Setting, ElementPlus, Monitor, Sunrise, MagicStick, Guide, BellFilled
} from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { DrawerProps } from 'element-plus'

// 全局变量
const ReplyCommentDatas = ref({})
// 未读评论数
const MyNotReadCommentCount = ref(0);

const drawer = ref(false)
const drawer2 = ref(false)
const direction = ref<DrawerProps['direction']>('ltr')
const radio1 = ref('Option 1')
const handleClose = (done: () => void) => {
    ElMessageBox.confirm('Are you sure you want to close this?')
        .then(() => {
            done()
        })
        .catch(() => {
            // catch error
        })
}
function cancelClick() {
    drawer2.value = false
}
function confirmClick() {
    ElMessageBox.confirm(`Are you confirm to chose ${radio1.value} ?`)
        .then(() => {
            drawer2.value = false
        })
        .catch(() => {
            // catch error
        })
}

// 我自己的代码

// 定义接收的props
const props = defineProps({
    currentUserID: {
        type: String,
        required: true
    },
    NotReadCommentCount: {
        type: Number,
        required: true
    }
})


// 重新查询未读评论数
const againGetNotReadCommentCount = async function () {
    console.log("重新查询未读评论数函数执行了1111111111111111111111111111111")
    // 获取未读评论数
    const returnNotReadCommentCount = await getNotReadCommentCountService(props.currentUserID)
    MyNotReadCommentCount.value = returnNotReadCommentCount.data
    console.log("MyNotReadCommentCount.value为：" + MyNotReadCommentCount.value)
}

// 引入全局事件总线
import eventBus from '../util/eventBus.js';
import { onUnmounted } from 'vue';
onMounted(async () => {

    // 订阅事件
    const unsubscribe = eventBus.on('againGetNotReadCommentCount', againGetNotReadCommentCount);
    console.log("查看事件总线对象_取消订阅事件>前: ", eventBus);

    // 在组件卸载时记得解绑事件监听器，避免内存泄漏
    onUnmounted(() => {
        console.log("组件被卸载了,取消事件总线事件监听!!!!!!!!!!!!!")
        // 取消订阅事件
        eventBus.off('againGetNotReadCommentCount', againGetNotReadCommentCount);
        // 取消订阅所以事件
        eventBus.all.clear();

        console.log("查看事件总线对象_取消订阅事件>后: ", eventBus);
    });






    console.log("评论通知组件的onMounted执行HHHHHHHHHHHHHHHHHHHHHHHHH")
    console.log("props.currentUserID值为：" + props.currentUserID)
    // 获取未读评论数
    const returnNotReadCommentCount = await getNotReadCommentCountService(props.currentUserID)
    console.log("未读评论数为：" + returnNotReadCommentCount)
    console.log(returnNotReadCommentCount)
    MyNotReadCommentCount.value = returnNotReadCommentCount.data
    console.log("MyNotReadCommentCount.value为：" + MyNotReadCommentCount.value)

})

const GetReplyCommentData = async function () {
    console.log("获取回复事件触发：GetReplyCommentData")
    console.log("当前登录的用户id为：" + props.currentUserID)
    const returnReplyComment = await getReplyCommentService(props.currentUserID)
    console.log("请求返回的回复评论为：" + returnReplyComment)
    console.log(returnReplyComment)
    console.log(returnReplyComment.data)
    ReplyCommentDatas.value = returnReplyComment.data
    console.log("ReplyCommentDatas.value为：")
    console.log(ReplyCommentDatas.value)

    // 进来了就将未读评论改为已读
    const returnChangeCommentReadOrNot = await changeCommentReadOrNotService(props.currentUserID)
    console.log("returnChangeCommentReadOrNot为: " + returnChangeCommentReadOrNot);
    console.log(returnChangeCommentReadOrNot);
    if (returnChangeCommentReadOrNot.code == 1) {
        MyNotReadCommentCount.value = 0
    }

}

</script>
  