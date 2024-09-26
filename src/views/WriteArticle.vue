<script setup>
// 引入其他.vue组件
import PublishArticleVue from '../components/PublishArticle.vue'

// 富文本测试
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('')

// 模拟 ajax 异步获取内容
// onMounted(() => {
//   setTimeout(() => {
//     valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
//   }, 1500)
// })

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...', MENU_CONF: {} }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value
  if (editor == null) return
  editor.destroy()
})

const handleCreated = (editor) => {
  editorRef.value = editor // 记录 editor 实例，重要！
}

// const mode = 'default' // 或 'simple'
const mode = 'simple' // 或 'simple'


// 编辑器配置
editorConfig.placeholder = '写点啥吧~~~';
editorConfig.scroll = false
// 上传图片
// 富文本编辑器请求我后端接口，需要携带JWT
// 导入状态库的token状态
import { useTokenStore } from '../stores/token.js'
const tokenStore = useTokenStore();
editorConfig.MENU_CONF['uploadImage'] = {
  fieldName: 'filedata',
  server: 'http://localhost:10010/article/imageUpload',
  // 自定义增加 http  header
  headers: {
    Authorization: tokenStore.token
  },
}

// 定义一个空集合，用于收集所有上传或者插入的图片
const imageList1 = new Set();
// 当前编辑器中存在的所有图片URL
const imageList2 = new Set();
// 定义一个新集合来存储删除的图片URL
const deletedImages = new Set();

// 插入图片触发函数（目的删除图片的同时删除OSS存储的图片）
editorConfig.MENU_CONF['insertImage'] = {
  onInsertedImage(imageNode) {                    // JS 语法
    console.log("插入图片执行此函数！")
    console.log(imageNode.src)
    // 添加图片URL到集合中
    imageList1.add(imageNode.src);
    console.log("下面是imageList1: ");
    console.log(imageList1)
  },
}
// 工具栏配置
toolbarConfig.excludeKeys = [
  'fullScreen', // 排除菜单组，写菜单组 key 的值即可
  'insertVideo'
]
// 逻辑编写
const dynamicContentHtml = ref('');

// 导入请求
import { deleteImageService } from "../api/ArticleApi.js"
// 获取html内容
const title = ref('');
const content = ref('内容_初始值');
const getContentHTML = function () {
  content.value = editorRef.value.getHtml();
  console.log(content.value);
  console.log(title.value);

  // 测试
  // 设置editor-content-view元素的html内容
  dynamicContentHtml.value = editorRef.value.getHtml();

  // 必须等当编辑器渲染完成之后，才能通过 editorRef.value 获取 editor 实例
  // 最后保存编辑器内容之前 获取当前编辑器的所有图片
  console.log(editorRef.value.getElemsByType('image'));

  // 清空集合imageList2中的全部数据
  imageList2.clear();
  // 遍历元素并将其src添加到imageList2中
  editorRef.value.getElemsByType('image').forEach(function (image) {
    console.log(image.src);
    imageList2.add(image.src);
  });
  console.log("下面是imageList2: ");
  console.log(imageList2);
  // 遍历imageList1中的每个URL
  for (const imageUrl of imageList1) {
    // 如果该URL不在imageList2中，则认为该图片已被删除
    if (!imageList2.has(imageUrl)) {
      deletedImages.add(imageUrl);
    }
  }
  // 此时，deletedImages集合中包含了所有在imageList1中有但不在imageList2中的图片URL，即被删除的图片
  console.log("下面是被删除的图片URL");
  console.log(deletedImages);

  // 调用后端删除图片接口
  const deletedImagesArray = Array.from(deletedImages); // 将Set转换为数组
  deleteImageService(deletedImagesArray);
}


// 引入全局事件总线
import eventBus from '../util/eventBus.js';
// import { onMounted } from 'vue';
import { onUnmounted } from 'vue';
onMounted(() => {
  // const handleMyEvent = () => {
  //     console.log("事件总线的事件被触发了: openLoginDialog")
  //     dialogFormVisible.value = true;
  // };

  // 订阅事件
  const unsubscribe = eventBus.on('getWangEditorContent', getContentHTML);
  console.log("查看事件总线对象_取消订阅事件>前: ", eventBus);

  // 在组件卸载时记得解绑事件监听器，避免内存泄漏
  onUnmounted(() => {
    console.log("组件被卸载了,取消事件总线事件监听!!!!!!!!!!!!!")
    // 取消订阅事件
    eventBus.off('getWangEditorContent', getContentHTML);
    // 取消订阅所以事件
    eventBus.all.clear();

    console.log("查看事件总线对象_取消订阅事件>后: ", eventBus);
  });
});
</script>

<template>
  <div>

    <div class="headContainer">
      <div class="headButtonBars">
        <div>
          <img src="../assets/spring-2.svg" alt="" style="width:156px;">
        </div>
        <div>
          <el-button type="primary" plain>存草稿</el-button>
          <!-- <el-button @click="getContentHTML" type="primary">发布</el-button> -->
          <PublishArticleVue :articleTitle="title" :articleContent="content"></PublishArticleVue>
        </div>
      </div>
    </div>


    <div>
      <!-- 富文本测试 -->
      <div style="">

        <!-- 工具栏 -->
        <div style="border-bottom: 1.5px solid rgb(204, 204, 204);">
          <div id="editor-toolbar">
            <Toolbar style="" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
          </div>
        </div>
        <!-- 编辑器 -->
        <div id="content">
          <div id="editor-container">
            <div id="title-container">
              <input v-model="title" placeholder="Page title...">
            </div>
            <div id="editor-text-area">

              <Editor style="" v-model="valueHtml" :defaultConfig="editorConfig" :mode="mode"
                @onCreated="handleCreated" />

            </div>
          </div>
        </div>
      </div>
    </div>


    <!-- 测试 -->
    <div ref="container" v-html="dynamicContentHtml" id="editor-content-view" class="editor-content-view"></div>

  </div>
</template>

<style scoped>
.headContainer {
  background-color: white;
  /* flex布局，居中 */
  display: flex;
  justify-content: center;
  align-items: center;

  /* border: 1px solid red; */
}

.headButtonBars {
  width: 75%;
  padding: 18px;
  /* flex布局，右对齐 */
  display: flex;
  justify-content: space-between;
  align-items: center;




  /* border: 1px solid rgb(204, 204, 204); */
}

/* 富文本测试 */
html,
body {
  background-color: #fff;
  height: 100%;
  overflow: hidden;
  color: #333;
}

#top-container {
  border-bottom: 1px solid #e8e8e8;
  padding-left: 30px;
}

#editor-toolbar {
  width: 100%;
  background-color: white;
  margin: 0 auto;

  display: flex;
  align-items: center;
  /* 垂直居中 */
  justify-content: center;
}

#content {
  height: calc(100% - 40px);
  background-color: rgb(245, 245, 245);
  overflow-y: auto;
  position: relative;
}

#editor-container {
  width: 850px;
  margin: 30px auto 150px auto;
  background-color: #fff;
  padding: 20px 50px 50px 50px;
  border: 1px solid #e8e8e8;
  box-shadow: 0 2px 10px rgb(0 0 0 / 12%);
}

#title-container {
  padding: 20px 0;
  border-bottom: 1px solid #e8e8e8;
}

#title-container input {
  font-size: 30px;
  border: 0;
  outline: none;
  width: 100%;
  line-height: 1;
}

#editor-text-area {
  min-height: 900px;
  margin-top: 20px;
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
/* .editor-content-view {
  border: 3px solid #ccc;
  border-radius: 5px;
  padding: 0 10px;
  margin-top: 20px;
  overflow-x: auto; */





  /* background-color: red; */
/* } */

/* .editor-content-view p,
.editor-content-view li {
  white-space: pre-wrap; */
  /* 保留空格 */
/* } */

/* .editor-content-view blockquote {
  border-left: 8px solid #d0e5f2;
  padding: 10px 10px;
  margin: 10px 0;
  background-color: #f1f1f1;
} */

/* .editor-content-view code {
  font-family: monospace;
  background-color: #eee;
  padding: 3px;
  border-radius: 3px;
} */

/* .editor-content-view pre>code {
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
} */
</style>
