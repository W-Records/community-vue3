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
    <el-button type="primary" style="margin-left: 16px" @click="drawer2 = true">
        发布
    </el-button>

    <el-drawer v-model="drawer" title="I am the title" :direction="direction" :before-close="handleClose">
        <span>Hi, there!</span>
    </el-drawer>
    <el-drawer v-model="drawer2" :direction="direction">
        <template #header>
            <h2 style="margin-bottom: 0px;padding-bottom: 6px;border-bottom: 1px solid var(--el-border-color);">发布文章</h2>
        </template>
        <template #default>
            <div>
                <div>
                    <div class="ArticleCategoryLine">
                        <label class="ArticleCategoryLine_label">文章分类：</label>
                        <el-radio-group v-model="MyRadio" size="large">
                            <el-radio-button label="前端" value="111" />
                            <el-radio-button label="后端" value="222" />
                            <el-radio-button label="生活" value="333" />
                        </el-radio-group>
                    </div>
                </div>
                <div>
                    <div class="ArticleCoverLine">
                        <label class="ArticleCoverLine_label">文章封面：</label>
                        <div>
                            <ImageUploadVue></ImageUploadVue>
                        </div>
                    </div>
                </div>
                <div>
                    <div class="ArticleIntroductionLine">
                        <label class="ArticleIntroductionLine_label">文章简介：</label>
                        <div>
                            <el-input v-model="textarea2" style="width: 240px" :autosize="{ minRows: 2, maxRows: 4 }"
                                type="textarea" placeholder="Please input" />
                        </div>
                    </div>
                </div>
                <!-- <el-radio v-model="radio1" value="Option 1" size="large">Option 1</el-radio>
                <el-radio v-model="radio1" value="Option 2" size="large">Option 2</el-radio> -->
            </div>
        </template>
        <template #footer>
            <div style="flex: auto">
                <el-button @click="cancelClick">取消</el-button>
                <el-button type="primary" @click="confirmClick">发布</el-button>
            </div>
        </template>
    </el-drawer>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessageBox } from 'element-plus'
// 引入其他.vue组件
import ImageUploadVue from './ImageUpload.vue'

const drawer = ref(false)
const drawer2 = ref(false)
const direction = ref('ltr')
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

// 单选框
const MyRadio = ref('333')

//输入框
const textarea2 = ref('')

import { ElMessage } from 'element-plus'
// 用于跳转路由 做准备
import { useRouter } from 'vue-router'
const router = useRouter();
// 整合数据传递给后端
// import { defineProps } from 'vue'
const props = defineProps({
    /* 可以指定类型约束 */
    articleTitle: String,
    articleContent: String,
})
// 导入状态库的coverUrl状态
import { useCoverUrlStore } from '../stores/coverUrl.js'
const coverUrlValue = ref('');

// 导入请求
import { saveArticleService } from "../api/ArticleApi.js"

// 引入全局事件总线
import eventBus from '../util/eventBus.js';
async function confirmClick() {
    // 触发事件
    await eventBus.emit('getWangEditorContent');
    console.log("下面是父组件传递过来的数据：");
    console.log(props.articleTitle);
    console.log(props.articleContent);
    const coverUrlStore = useCoverUrlStore();
    coverUrlValue.value = coverUrlStore.coverUrl;
    console.log("图片URL为: " + coverUrlValue.value);
    console.log("用户选的分类为：" + MyRadio.value)
    console.log("文章简介为: " + textarea2.value);

    // 标题不能为空
    if (props.articleTitle == "") {
        ElMessage({
            message: '标题不能为空',
            type: 'warning',
        })
        return;
    }
    // 内容不能为空
    if (props.articleContent == "<p><br></p>") {
        ElMessage({
            message: '内容不能为空',
            type: 'warning',
        })
        return;
    }
    // 文章简介不能为空
    if (textarea2.value == "") {
        ElMessage({
            message: '文章简介不能为空',
            type: 'warning',
        })
        return;
    }


    const article = {
        title: props.articleTitle,
        content: props.articleContent,
        coverUrl: coverUrlValue.value,
        categoryId: MyRadio.value,
        summary: textarea2.value,
        status: "已发布"
    }
    const returnData = await saveArticleService(article)
    console.log("保存文章返回的数据: ");
    console.log(returnData);
    if (returnData.code == 1) {
        ElMessage({
            message: '发布成功',
            type: 'success',
        })
        drawer2.value = false
        router.push('/');
    }
    coverUrlStore.removeCoverUrl();



    // ElMessageBox.confirm(`Are you confirm to chose ${radio1.value} ?`)
    //     .then(() => {
    //         drawer2.value = false
    //     })
    //     .catch(() => {
    //         // catch error
    //     })
}
</script>
  

<style scoped>
.ArticleCategoryLine {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 30px;

    /* border: solid 1px; */
}

.ArticleCategoryLine_label {
    padding-right: 20px;

    /* border: solid 1px; */
}

.ArticleCoverLine {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    /* align-items: center; */
    margin-bottom: 30px;

    /* border: solid 1px; */
}

.ArticleCoverLine_label {
    padding-right: 20px;
}

.ArticleIntroductionLine {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    /* align-items: center; */

    /* border: solid 1px; */
}

.ArticleIntroductionLine_label {
    padding-right: 20px;
}
</style>
