<script lang="ts" setup>
import { onMounted, ref } from 'vue'
// 全局变量
const CurrentPage = ref(0);
const AllArticles = ref([]);
console.log("文章累加容器AllArticles为：" + AllArticles.value);
console.log(AllArticles.value);

// 未读评论数
const NotReadCommentCount = ref(0);

// 判断登录按钮是否显示
const judgeLogInStateBoolean = ref(true);
// 当前用户信息
const currentUserInfo = ref('名字初始值啊');
const currentUserID = ref('ID初始值啊');

// 文章总数全局变量
const ArticleAllCount = ref(0);
// Skeleton 骨架屏
const SkeletonLoading = ref(true); // 初始化加载状态为 true

// 引入其他.vue组件
import LoginAndRegistrationVue from '../components/LoginAndRegistration.vue'
import CommentNoticeVue from '../components/CommentNotice.vue'
import UserArticleVue from '../components/UserArticle.vue'
// 用于跳转路由 做准备
import { useRouter } from 'vue-router'
const router = useRouter();
// 导入请求
import { TestWhetherGetTokenService, judgeLogInStateService } from "../api/UserApi.js"
import { getNotReadCommentCountService } from "../api/CommentApi.js"

// 跳转写文章页面
const toWriteArticle = async function () {
  const returnData = await TestWhetherGetTokenService();
  console.log("TestWhetherGetTokenService返回的数据为: " + returnData);

  router.push('/writeArticle');
}


import { getAutocompleteSuggestions } from "../api/ArticleApi.js"

//自动补全输入框
import { Calendar, Search } from '@element-plus/icons-vue'
const state = ref('')

interface LinkItem {
  value: string
  link: string
}

const links = ref<LinkItem[]>([])

const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' },
  ]
}

// let timeout: ReturnType<typeof setTimeout>
const querySearchAsync = async (queryString: string, cb: (arg: any) => void) => {
  const results = queryString
    ? links.value.filter(createFilter(queryString))
    : links.value

  const returnSuggestions = await getAutocompleteSuggestions(queryString)
  console.log("returnSuggestions返回的建议数据为: " + returnSuggestions);
  console.log(returnSuggestions.data);

  const suggestions = returnSuggestions.data.map((text: string) => ({ value: text }));
  console.log(suggestions);
  // clearTimeout(timeout)
  // timeout = setTimeout(() => {
    cb(suggestions)
  // }, 3000 * Math.random())
}
const createFilter = (queryString: string) => {
  return (restaurant: LinkItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}

const handleSelect = (item: Record<string, any>) => {
  console.log(item)
}

//自动补全输入框到这里为止




// WebSocket的构建
// 引入全局事件总线
import eventBus from '../util/eventBus.js';
import { onUnmounted, onBeforeUnmount } from 'vue';

// WebSocket实例
const socketRef = ref(null);

// 连接状态
const connectionStatus = ref('Disconnected');

// 心跳检测定时器
let pingInterval = null;

// 建立WebSocket连接
const connectWebSocket = (UserID) => {
  // WebSocket连接的URL，确保包含用户的ID
  const wsUrl = `ws://localhost:10010/ws-comment-service/${UserID}`;
  // 初始化WebSocket连接
  socketRef.value = new WebSocket(wsUrl);

  // 连接打开事件处理
  socketRef.value.addEventListener('open', () => {
    console.log('WebSocket连接已打开');
    connectionStatus.value = 'Connected';

    // 启动心跳检测
    pingInterval = setInterval(() => {
      // 发送心跳包，这里以"ping"为例
      if (socketRef.value.readyState === WebSocket.OPEN) {
        socketRef.value.send(JSON.stringify({ type: 'ping' }));
      } else {
        console.warn('WebSocket未就绪，无法发送心跳');
      }
    }, 30000); // 每30秒发送一次心跳
  });

  // 消息接收事件处理
  socketRef.value.addEventListener('message', async (event) => {
    console.log('接收到服务器消息:', event.data);
    // 根据需要处理消息内容，例如更新UI
    // 触发事件
    await eventBus.emit('againGetNotReadCommentCount');
  });

  // 错误处理
  socketRef.value.addEventListener('error', (error) => {
    console.error('WebSocket发生错误:', error);
  });

  // 连接关闭事件处理
  socketRef.value.addEventListener('close', (event) => {
    console.log('WebSocket连接已关闭', event);
    connectionStatus.value = 'Disconnected';
    // 清理心跳检测定时器
    clearInterval(pingInterval);
    pingInterval = null;
  });
};

// 发送消息到服务器
const sendMessage = (messageContent) => {
  if (socketRef.value && socketRef.value.readyState === WebSocket.OPEN) {
    socketRef.value.send(JSON.stringify({
      content: messageContent, // 实际消息内容
      type: 'message' // 消息类型，可以根据需求自定义
    }));
  } else {
    console.error('WebSocket连接未就绪，无法发送消息');
  }
};

// // 组件生命周期钩子
// onMounted(() => {
//   // 页面加载完成时尝试连接WebSocket
//   connectWebSocket();
// });

// 组件卸载时关闭WebSocket连接
onUnmounted(() => {
  if (socketRef.value) {
    socketRef.value.close();
  }
  // 清理心跳检测定时器
  if (pingInterval) {
    clearInterval(pingInterval);
    pingInterval = null;
  }
});

// 在组件卸载前的阶段，也可以用来做一些清理工作，这里作为额外的安全措施
onBeforeUnmount(() => {
  // 确保WebSocket连接关闭
  if (socketRef.value) {
    socketRef.value.close();
  }
});
// WebSocket的构建到这里为止







import { getArticleListService, getArticleCountService } from "../api/ArticleApi.js"
onMounted(async () => {
  console.log("onMounted钩子函数执行！！！！！！！！！");
  links.value = loadAll()

  // 进入首页发送请求获取数据
  CurrentPage.value = 1;
  const returnArticleListData = await getArticleListService(CurrentPage.value);
  console.log("首页加载获取文章列表数据(onMounted钩子函数内): " + returnArticleListData);
  console.log(returnArticleListData);
  returnArticleListData.data.forEach(element => {
    AllArticles.value.push(element);
  });
  console.log("文章累加容器AllArticles为(onMounted钩子函数内)：" + AllArticles.value);
  console.log(AllArticles.value);

  // 获取文章总数
  const returnArticleCountData = await getArticleCountService();
  // 关闭骨架屏，打开数据展示区域
  SkeletonLoading.value = false;

  ArticleAllCount.value = returnArticleCountData.data;
  console.log("数据库中的文章总数为(onMounted钩子函数内): " + ArticleAllCount.value);
  console.log(ArticleAllCount.value);




  // 登录状态的展示
  const returnLogInStateUserName = await judgeLogInStateService();
  console.log("当前登录的用户为：" + returnLogInStateUserName)
  console.log(returnLogInStateUserName)
  console.log(returnLogInStateUserName.msg)
  if (returnLogInStateUserName.msg == "未登录啊") {
    judgeLogInStateBoolean.value = true;
  } else {
    judgeLogInStateBoolean.value = false;
    currentUserInfo.value = returnLogInStateUserName.data.userName
    currentUserID.value = returnLogInStateUserName.data.userId

    // 登录成功再建立WebSocket连接
    // 页面加载完成时尝试连接WebSocket
    connectWebSocket(currentUserID.value);

    // // 获取未读评论数
    // const returnNotReadCommentCount = await getNotReadCommentCountService(currentUserID.value)
    // console.log("未读评论数为：" + returnNotReadCommentCount)
    // console.log(returnNotReadCommentCount)
    // NotReadCommentCount.value = returnNotReadCommentCount.data
    // console.log("NotReadCommentCount.value为："+NotReadCommentCount.value)
  }
  // 登录状态的展示 到此为止



  // // 页面加载完成时尝试连接WebSocket
  // connectWebSocket();


})
//自动补全输入框——到这里为止
console.log("CurrentPage为: ", CurrentPage.value)

//下面是侧栏菜单
import {
  Document,
  Menu as IconMenu,
  Location, Loading, View, Star, User,
  Setting, ElementPlus, Monitor, Sunrise, MagicStick, Guide, BellFilled
} from '@element-plus/icons-vue'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
//侧栏菜单到这里为止

// 下面是中心内容文章列表部分
// import { ref } from 'vue'
import type { TabsPaneContext } from 'element-plus'

const activeName = ref('first')

const handleClick = (tab: TabsPaneContext, event: Event) => {
  console.log(tab, event)
}
// 中心内容文章列表部分到这里为止



// 滚动底部加载内容 
// const count = ref(0)
// const load = () => {
//   count.value += 2
//   console.log('滚动到底部方法执行')
// }
import { computed } from 'vue'
console.log("数据库中的文章总数为(外面): " + ArticleAllCount.value);
console.log("当前容器的文章数量为(外面)：" + AllArticles.value.length);
// const count = ref(10)
const loading = ref(false)
const noMore = computed(() => {
  console.log("数据库中的文章总数为(computed计算属性里面): " + ArticleAllCount.value);
  console.log("当前容器的文章数量为(computed计算属性里面)：" + AllArticles.value.length);
  return AllArticles.value.length >= ArticleAllCount.value
})
const disabled = computed(() => loading.value || noMore.value)
console.log("无线滚动是否禁用disabled: " + disabled.value);
const load = async () => {
  console.log('滚动到底部方法执行')
  loading.value = true
  // setTimeout(() => {
  // count.value += 10
  // loading.value = false
  // }, 1000)
  // 发请求获取文章数据，追加至文章累加容器
  CurrentPage.value++;
  console.log("CurrentPage为: ", CurrentPage.value)
  const returnArticleListData = await getArticleListService(CurrentPage.value);
  returnArticleListData.data.forEach(element => {
    AllArticles.value.push(element);
  });
  console.log("文章累加容器AllArticles为(滚动事件里面)：" + AllArticles.value);
  console.log(AllArticles.value);
  console.log("当前容器的文章数量为(滚动事件里面)：" + AllArticles.value.length);

  loading.value = false
}

// 滚动底部加载内容到这里为止

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


// 跳转文章详情页
const toArticleDetailsPage = function (articleId) {
  console.log("toArticleDetailsPage函数跳转页面执行,参数为: " + articleId);
  // router.push({
  //   path: '/ArticleDetailsPage',
  //   query: {
  //     articleId: articleId
  //   }
  // })
  // router.push(`/ArticleDetailsPage/${articleId}`);
  router.push("/ArticleDetailsPage/" + articleId);
}










// 下面都是测试
const TestWhetherGetToken = async function () {
  const returnData = await TestWhetherGetTokenService();
  console.log("TestWhetherGetTokenService返回的数据为: " + returnData);
}


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
          <div class="headerSearchBox">
            <!-- 自动补全输入框 -->
            <div class="flex gap-4">
              <div>
                <!-- <div class="sub-title my-2 text-sm text-gray-600">
                    list suggestions when activated
                  </div> -->
                <el-autocomplete style="width: 450px" size="large" v-model="state" :fetch-suggestions="querySearchAsync"
                  clearable class="inline-input w-50" placeholder="Please Input" @select="handleSelect">
                  <template #suffix>
                    <el-icon style="color: #ff403a;">
                      <Search />
                    </el-icon>
                  </template>
                </el-autocomplete>
              </div>
              <!-- <div>
                  <div class="sub-title my-2 text-sm text-gray-600">
                    list suggestions on input
                  </div>
                  <el-autocomplete v-model="state2" :fetch-suggestions="querySearch" :trigger-on-focus="false" clearable
                    class="inline-input w-50" placeholder="Please Input" @select="handleSelect" />
                </div> -->
            </div>
          </div>
        </el-col>
        <el-col :span="8">
          <div class="headerFunctionButton">
            <div style="">
              <el-button type="primary" @click="toWriteArticle">写文章</el-button>
            </div>
            <div class="LoginAndRegistrationVue">
              <div v-if="judgeLogInStateBoolean">
                <LoginAndRegistrationVue />
              </div>
              <div v-if="!judgeLogInStateBoolean" class="LogInAndInform">
                <div style="margin-right: 10px;">
                  <CommentNoticeVue :NotReadCommentCount="NotReadCommentCount" :currentUserID="currentUserID">
                  </CommentNoticeVue>
                  <!-- <el-button :key="'info'" :type="'info'" link>
                    <el-icon :size="25">
                      <BellFilled />
                    </el-icon>
                  </el-button> -->
                </div>
                <!-- <div style="margin-left: 16px;">{{ currentUserInfo }}</div> -->
                <UserArticleVue :currentUserInfo="currentUserInfo" :currentUserID="currentUserID"></UserArticleVue>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>

    </div>
    <div class="mainContainer">

      <div class="mainContent">
        <div class="mainContent_innr">
          <el-row :gutter="20">
            <el-col :span="4">
              <div class="mainContent_innr_left">
                <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose">
                  <el-menu-item index="1">
                    <el-icon>
                      <MagicStick />
                    </el-icon>
                    <span>关注</span>
                  </el-menu-item>
                  <el-menu-item index="2">
                    <el-icon>
                      <Guide />
                    </el-icon>
                    <span>综合</span>
                  </el-menu-item>
                  <el-menu-item index="3">
                    <el-icon>
                      <ElementPlus />
                    </el-icon>
                    <span>前端</span>
                  </el-menu-item>
                  <el-menu-item index="4">
                    <el-icon>
                      <Monitor />
                    </el-icon>
                    <span>后端</span>
                  </el-menu-item>
                  <el-menu-item index="5">
                    <el-icon>
                      <Sunrise />
                    </el-icon>
                    <span>生活</span>
                  </el-menu-item>
                </el-menu>
              </div>
            </el-col>
            <el-col :span="15">
              <div class="mainContent_innr_center">
                <div class="mainContent_innr_center_details" v-infinite-scroll="load" :infinite-scroll-distance="76"
                  :infinite-scroll-disabled="disabled">
                  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
                    <el-tab-pane label="推荐" name="first">
                      <!-- 骨架屏 -->
                      <div class="SkeletonElementPlus" v-if="SkeletonLoading">
                        <el-skeleton animated />
                        <el-skeleton animated style="--el-skeleton-circle-size: 100px;width: 100px;margin-left: 11px;">
                          <template #template>
                            <el-skeleton-item variant="circle" />
                          </template>
                        </el-skeleton>
                      </div>
                      <div class="infinite-list-wrapper" v-if="!SkeletonLoading" style="">
                        <ul class="list">
                          <li v-for="(Article, index) in AllArticles" :key="Article.articleId" class="list-item">
                            <el-card @click="toArticleDetailsPage(Article.articleId)" style="width: 100%;"
                              body-style="padding: 10px;" shadow="hover">
                              <el-row>
                                <el-col :span="19">
                                  <div class="ArticleListCard_left">
                                    <el-row>
                                      <el-col :span="24">
                                        <div class="ArticleListCard_left_title">
                                          <h4 class="ArticleListCard_left_titleH4">{{ Article.title }}{{ index + 1 }}</h4>
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
                          </li>
                        </ul>
                        <p v-if="loading">
                          <el-icon class="is-loading">
                            <Loading />
                          </el-icon>
                        </p>
                        <p v-if="noMore">No more</p>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="最新" name="second">
                      内容222
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
            </el-col>
            <el-col :span="5">
              <div class="mainContent_innr_right">右边栏</div>
            </el-col>
          </el-row>
        </div>
      </div>

    </div>
  </div>


  <!-- <hr> -->
  <!-- 下面都是测试 -->
  <!-- <el-button @click="TestWhetherGetToken" type="info">测试是否携带JWT</el-button> -->
</template>

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
