<script lang="ts" setup>
// 引入其他.vue组件
import ArticleCommentVue from '../components/ArticleComment.vue'
import { onMounted, ref } from 'vue'
import {
    Star, ChatDotSquare, Timer, View
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router';
const route = useRoute();
// 全局变量
const ArticleDetaildata = ref({})
const dynamicContentHtml = ref('');

import { getArticleDetailService } from "../api/ArticleApi.js"
onMounted(async () => {
    console.log("文章详情页: onMounted钩子函数执行!!!!!!!!");
    const articleId = route.params.articleId;
    console.log("当前文章id为: " + articleId);
    console.log(route.params);
    const returnArticleDetail = await getArticleDetailService(articleId)
    ArticleDetaildata.value = returnArticleDetail.data
    console.log("文章详情数据为：" + ArticleDetaildata.value);
    console.log(ArticleDetaildata.value);
    console.log(ArticleDetaildata.value.title);

    dynamicContentHtml.value = ArticleDetaildata.value.content;
})

</script>

<template>
    <div class="entiretyContainer">

        <div class="headContainer">
            <el-row align="middle">
                <el-col :span="8">
                    <div class="headerLogo">
                        <div>
                            <img src="../assets/spring-2.svg" alt="" style="width:156px;margin-left: 45px;">
                        </div>
                    </div>
                </el-col>
                <el-col :span="8">
                    <!-- 中间区域空着 -->
                </el-col>
                <el-col :span="8">
                    <div class="UserRelatedInformationArea">
                        <span>用户框</span>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div class="mainContainer">
            <div class="mainContent">
                <div class="mainContent_innr">
                    <el-row :gutter="20">
                        <el-col :span="2">
                            <div>
                                <el-affix :offset="160">
                                    <div class="AffixLikeComment">
                                        <div>
                                            <el-badge :value="ArticleDetaildata.likesCount" class="item" type="primary">
                                                <el-button :icon="Star" size="large" circle />
                                            </el-badge>
                                            <br>
                                            <div style="margin-top: 20px;">
                                                <el-badge :value="19" class="item" type="primary">
                                                    <ArticleCommentVue></ArticleCommentVue>
                                                </el-badge>
                                            </div>
                                        </div>
                                    </div>
                                </el-affix>
                            </div>
                        </el-col>
                        <el-col :span="17">
                            <div class="ArticleContent">
                                <div class="ArticleContentHead">
                                    <h1 style="margin:0px;margin-bottom: 10px;">{{ ArticleDetaildata.title }}</h1>
                                    <div class="ArticleContentHeadDescription">
                                        <el-text class="mx-1" type="info">
                                            <el-icon>
                                                <Timer />
                                            </el-icon> {{ ArticleDetaildata.publishedAt }}
                                        </el-text>
                                        <el-text style="margin-left: 30px;" class="mx-1" type="info">
                                            <el-icon>
                                                <View />
                                            </el-icon> {{ ArticleDetaildata.viewsCount }}
                                        </el-text>
                                    </div>
                                </div>
                                <div class="ArticleContentBody">
                                    <div class="ArticleContentBody_innr">
                                        <div id="editor-content-view" class="editor-content-view"
                                            v-html="dynamicContentHtml">

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="5">
                            <div>右边栏</div>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.headContainer {
    background-color: white;
    padding: 15px;
    /* border: 1px solid black; */
}

.UserRelatedInformationArea {
    display: flex;
    align-items: center;
    justify-content: center;
    /* border: 1px solid black; */
}

.mainContainer {
    display: flex;
    align-items: center;
    justify-content: center;

    /* border: 1px solid black; */
}

.mainContent {
    width: 85%;
    margin-top: 20px;
    /* border: 1px solid black; */


    height: 2000px;
}

.AffixLikeComment {
    /* display: flex; */

    /* border: 1px solid black; */
}

.ArticleContent {
    background-color: white;
    padding: 20px;
    /* border: 1px solid black; */
}

.ArticleContentBody {
    margin-top: 28px;
    /* border: 1px solid black; */
}
</style>



<!-- 
scoped属性会限制CSS样式仅作用于当前组件的模板（即模板编译后的DOM树）中的元素。 
Vue通过为组件内的元素添加特殊的属性（如您提到的data-v-a6dde563）来实现这一限制。
动态插入的HTML（通过v-html指令生成的）并不属于组件模板的一部分，
因此不会带有这些特殊的属性，自然也就无法匹配到scoped样式的限定范围。
-->
<style>
/* 样式测试 */
.editor-content-view {
    /* border: 3px solid #ccc; */
    border-radius: 5px;
    padding: 0 10px;
    margin-top: 20px;
    overflow-x: auto;





    /* background-color: red; */
}

.editor-content-view p,
.editor-content-view li {
    white-space: pre-wrap;
    /* 保留空格 */
}

.editor-content-view blockquote {
    border-left: 8px solid #d0e5f2;
    padding: 10px 10px;
    margin: 10px 0;
    background-color: #f1f1f1;
}

.editor-content-view code {
    font-family: monospace;
    background-color: #eee;
    padding: 3px;
    border-radius: 3px;
}

.editor-content-view pre>code {
    display: block;
    padding: 10px;
}

.editor-content-view table {
    border-collapse: collapse;
}

.editor-content-view td,
.editor-content-view th {
    border: 1px solid #ccc;
    min-width: 50px;
    height: 20px;
}

.editor-content-view th {
    background-color: #f1f1f1;
}

.editor-content-view ul,
.editor-content-view ol {
    padding-left: 20px;
}

.editor-content-view input[type="checkbox"] {
    margin-right: 5px;
}
</style>

