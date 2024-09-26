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

    <el-button :key="'info'" :type="'info'" link style="margin-left: 8px" @click="drawer2 = true; getUserArticleData()">
        {{ props.currentUserInfo }}
    </el-button>


    <el-drawer v-model="drawer" title="I am the title" :direction="direction" :before-close="handleClose">
        <span>Hi, there!</span>
    </el-drawer>
    <el-drawer v-model="drawer2" :direction="direction" :size="'36%'">
        <template #header>
            <h2>我发布的文章</h2>
        </template>
        <template #default>
            <div>
                <div v-for="(Article, index) in UserArticles" :key="Article.articleId" class="list-item"
                    style="margin-bottom: 10px;">
                    <el-card @click="toModifyArticlePage(Article.articleId)" style="width: 100%;" body-style="padding: 10px;" shadow="hover">
                        <el-row>
                            <el-col :span="19">
                                <div class="ArticleListCard_left">
                                    <el-row>
                                        <el-col :span="24">
                                            <div class="ArticleListCard_left_title">
                                                <h4 class="ArticleListCard_left_titleH4">{{ Article.title }}{{ index
                                                    + 1 }}</h4>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="24">
                                            <div>
                                                <el-row class="w-150px mb-2">
                                                    <el-text type="info" truncated>{{ Article.summary }}</el-text>
                                                </el-row>
                                            </div>
                                        </el-col>
                                    </el-row>
                                    <el-row>
                                        <el-col :span="12">
                                            <div class="ArticleListCard_left_likeCollect">
                                                <el-text class="mx-1" type="info">
                                                    <el-icon>
                                                        <User />
                                                    </el-icon>
                                                    <span> {{ Article.userName }}</span>
                                                </el-text>
                                                <el-text class="mx-1" type="info">
                                                    <el-icon>
                                                        <View />
                                                    </el-icon>
                                                    <span> {{ Article.viewsCount }}</span>
                                                </el-text>
                                                <el-text class="mx-1" type="info">
                                                    <el-icon>
                                                        <Star />
                                                    </el-icon>
                                                    <span>{{ Article.likesCount }}</span>
                                                </el-text>
                                                <el-text class="mx-1" type="info">
                                                    <el-button @click="deleteArticleByid(Article.articleId)" :key="'info'" :type="'info'" link>
                                                        <el-icon>
                                                            <Delete />
                                                        </el-icon>
                                                    </el-button>
                                                </el-text>
                                            </div>
                                        </el-col>
                                        <el-col :span="12">
                                            <div class="ArticleListCard_left_category">
                                                <!-- <el-button size="small" type="info" plain>类别</el-button> -->
                                            </div>
                                        </el-col>
                                    </el-row>
                                </div>
                            </el-col>
                            <el-col :span="5">
                                <div class="ArticleListCard_right">
                                    <el-image style="width: 76px; height: 76px" :src="url" :fit="'contain'" />
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
import { getUserArticleService } from "../api/ArticleApi"
import {
    Document, Delete,
    Menu as IconMenu,
    Location, Loading, View, Star, User,
    Setting, ElementPlus, Monitor, Sunrise, MagicStick, Guide, BellFilled
} from '@element-plus/icons-vue'
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { DrawerProps } from 'element-plus'
import { ElMessage } from 'element-plus'

// 全局变量
const UserArticles = ref({})
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
    currentUserInfo: {
        type: String,
        required: true
    }
})


import { onUnmounted } from 'vue';
onMounted(async () => {

})

const getUserArticleData = async function () {
    console.log("获取回复事件触发：getUserArticleData")
    console.log("当前登录的用户id为：" + props.currentUserID)
    const returnUserArticleData = await getUserArticleService(props.currentUserID)
    console.log("请求返回的用户文章为：" + returnUserArticleData)
    console.log(returnUserArticleData)
    console.log(returnUserArticleData.data)
    UserArticles.value = returnUserArticleData.data
    console.log("UserArticles.value为：")
    console.log(UserArticles.value)

}

// 用于跳转路由 做准备
import { useRouter } from 'vue-router'
const router = useRouter();


// 导入请求
import { deleteArticleService } from "../api/ArticleApi"
const deleteArticleByid = function(articleId){
    console.log("删除文章事件触发：deleteArticleByid")
    console.log("当前文章id为：" + articleId)
    ElMessageBox.confirm(
    '确定删除此文章吗?',
    'Warning',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  )
    .then(async () => {
        await deleteArticleService(articleId)
        const returnUserArticleData = await getUserArticleService(props.currentUserID)
        UserArticles.value = returnUserArticleData.data

        router.push('/');

      ElMessage({
        type: 'success',
        message: '删除成功',
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除',
      })
    })
}




// 图片
import type { ImageProps } from 'element-plus'

const fits = [
    'fill',
    'contain',
    'cover',
    'none',
    'scale-down',
] as ImageProps['fit'][]
const url =
    'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
// 图片到这里为止




// 跳转更改文章页
const toModifyArticlePage = function (articleId) {
  console.log("toModifyArticlePage函数跳转页面执行,参数为: " + articleId);
  // router.push({
  //   path: '/ArticleDetailsPage',
  //   query: {
  //     articleId: articleId
  //   }
  // })
  // router.push(`/ArticleDetailsPage/${articleId}`);
  router.push("/ModifyArticlePage/" + articleId);
}


</script>



<style scoped>
/* 骨架屏 */
.SkeletonElementPlus {
    display: flex;
}



.headContainer {
    background-color: white;
    padding: 15px;
    /* border: 1px solid black; */
}

.mainContainer {
    display: flex;
    align-items: center;
    justify-content: center;

    /* border: 1px solid black; */
}

.mainContent {
    width: 80%;
    margin-top: 20px;
    /* border: 1px solid black; */
}

.mainContent_innr {
    /* border: 1px solid black; */
}

.mainContent_innr_left {
    border-radius: 2px;
    border: 1px solid var(--el-border-color);
}

.mainContent_innr_right {
    background-color: white;
    border-radius: 2px;
    border: 1px solid var(--el-border-color);
}

.mainContent_innr_center {
    background-color: white;
    border-radius: 2px;
    border: 1px solid var(--el-border-color);
}

.mainContent_innr_center_details {
    padding: 17px;
    padding-top: 3px;
}


.headerFunctionButton {
    display: flex;
    align-items: center;
    justify-content: center;

    /* border: 1px solid black; */
}

.headerSearchBox {
    display: flex;
    align-items: center;
    justify-content: center;

    /* border: 1px solid black; */
}

.headerLogo {
    /* border: 1px solid black; */
}

.LoginAndRegistrationVue {
    margin: 10px;
    margin-right: 25px;
    /* border: 1px solid black; */
}


/* 滚动底部加载内容模块 */
.infinite-list-wrapper {
    /* height: 300px; */
    text-align: center;
}

.infinite-list-wrapper .list {
    padding: 0;
    margin: 0;
    list-style: none;
}

.infinite-list-wrapper .list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 116px;
    /* background: var(--el-color-danger-light-9);
  color: var(--el-color-danger); */
}

.infinite-list-wrapper .list-item+.list-item {
    /* margin-top: 10px; */
}

.ArticleListCard_left {
    /* border: 1px solid black; */
}

.ArticleListCard_right {
    /* border: 1px solid black; */
}

.ArticleListCard_left_title {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    /* border: 1px solid black; */
}

.ArticleListCard_left_titleH4 {
    margin-top: 1px;
    margin-bottom: 10px;
}

.ArticleListCard_left_likeCollect {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 3px;
}

.LogInAndInform {
    display: flex;
    align-items: center;
    justify-content: center;

    /* border: 1px solid black; */
}
</style>

  