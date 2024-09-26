<template>
  <!-- <el-radio-group v-model="direction">
      <el-radio value="ltr">left to right</el-radio>
      <el-radio value="rtl">right to left</el-radio>
      <el-radio value="ttb">top to bottom</el-radio>
      <el-radio value="btt">bottom to top</el-radio>
    </el-radio-group> -->

  <el-button :icon="ChatDotSquare" size="large" circle @click="drawer = true; getCommentData()"></el-button>
  <!-- <el-button type="primary" style="margin-left: 16px" @click="drawer2 = true">
      with footer
    </el-button> -->

  <el-drawer v-model="drawer" :direction="direction" :before-close="handleClose">
    <template #header>
      <h2 style="margin-bottom: 0px;">评论</h2>
    </template>
    <div class="writeComment">
      <div>
        <el-row>
          <el-col :span="4">
            <div>
              <el-avatar :size="53" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
            </div>
          </el-col>
          <el-col :span="20">
            <div>
              <el-input v-model="textarea1" style="width: 100%" :autosize="{ minRows: 4 }" type="textarea"
                placeholder="写点评论~" />
            </div>
            <div style="display: flex;justify-content: flex-end;margin-top: 12px;">
              <el-button @click="sendComment()" type="primary" plain>发送</el-button>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="CommentShowArea">
      <div>
        <div class="CommentItem" v-for="(CommentOnes, index) in CommentTreeData" :key="CommentOnes.id">
          <el-row>
            <el-col :span="4">
              <div class="TopCommentAvatar">
                <div>
                  <el-avatar :size="53" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                </div>
              </div>
            </el-col>
            <el-col :span="20">
              <div class="TopCommentContent">
                <div style="margin-bottom: 12px;">
                  <div style="margin-bottom: 7px;">{{ CommentOnes.userName }}</div>
                  <div style="margin-bottom: 7px;">{{ CommentOnes.content }}</div>
                  <el-text class="mx-1" type="info">
                    <span>{{ CommentOnes.createTime }}</span>
                    &nbsp;
                    <el-button :key="'primary'" :type="'primary'" link @click="CommentOnes.replyWindowVisible = true">
                      <el-icon>
                        <ChatDotSquare />
                      </el-icon> 回复
                    </el-button>
                    <el-dialog v-model="CommentOnes.replyWindowVisible" title="回复" width="500">
                      <div>
                        <el-input v-model="replycommentText" style="width: 100%" :autosize="{ minRows: 4 }"
                          type="textarea" placeholder="写点评论~" />
                      </div>
                      <template #footer>
                        <div class="dialog-footer">
                          <el-button @click="CommentOnes.replyWindowVisible = false">取消</el-button>
                          <el-button type="primary"
                            @click="CommentOnes.replyWindowVisible = false; sendReplyComment(CommentOnes.id)">
                            发送
                          </el-button>
                        </div>
                      </template>
                    </el-dialog>

                  </el-text>
                </div>
                <div>
                  <div class="childComment" v-for="(CommentTwos, index) in CommentOnes.replies" :key="CommentTwos.id">
                    <div style="margin-bottom: 15px;">
                      <el-row>
                        <el-col :span="4">
                          <div>
                            <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                          </div>
                        </el-col>
                        <el-col :span="20">
                          <div>
                            <div style="margin-bottom: 5px;">{{ CommentTwos.userName }}: {{ CommentTwos.content }}</div>
                            <el-text class="mx-1" type="info">
                              <span>{{ CommentTwos.createTime }}</span>
                              &nbsp;
                              <el-button :key="'primary'" :type="'primary'" link
                                @click="CommentTwos.replyWindowVisible = true">
                                <el-icon>
                                  <ChatDotSquare />
                                </el-icon> 回复
                              </el-button>
                              <el-dialog v-model="CommentTwos.replyWindowVisible" title="回复" width="500">
                                <div>
                                  <el-input v-model="replycommentText" style="width: 100%" :autosize="{ minRows: 4 }"
                                    type="textarea" placeholder="写点评论~" />
                                </div>
                                <template #footer>
                                  <div class="dialog-footer">
                                    <el-button @click="CommentTwos.replyWindowVisible = false">取消</el-button>
                                    <el-button type="primary"
                                      @click="CommentTwos.replyWindowVisible = false; sendReplyComment(CommentTwos.id)">
                                      发送
                                    </el-button>
                                  </div>
                                </template>
                              </el-dialog>
                            </el-text>
                          </div>
                        </el-col>
                      </el-row>
                    </div>

                    <!-- 如果当前评论有回复，则递归渲染子评论 -->
                    <div v-if="CommentTwos.replies && CommentTwos.replies.length > 0">
                      <div v-for="(CommentThrees, index) in CommentTwos.replies" :key="CommentThrees.id">
                        <RecursionCommentVue :comment="CommentThrees"></RecursionCommentVue>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </div>
  </el-drawer>

  <el-drawer v-model="drawer2" :direction="direction">
    <template #header>
      <h4>set title by slot</h4>
    </template>
    <template #default>
      <div>
        <el-radio v-model="radio1" value="Option 1" size="large">
          Option 1
        </el-radio>
        <el-radio v-model="radio1" value="Option 2" size="large">
          Option 2
        </el-radio>
      </div>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelClick">cancel</el-button>
        <el-button type="primary" @click="confirmClick">confirm</el-button>
      </div>
    </template>
  </el-drawer>
</template>
  
<script lang="ts" setup>
// 导入请求
import { getCommentTreeStructuredDataService, publishCommentService } from "../api/CommentApi.js"
// 引入其他.vue组件
import RecursionCommentVue from './RecursionComment.vue'
import { ElMessage } from 'element-plus'



const visible = ref(false)

// 官方组件代码
import {
  Star, ChatDotSquare, Timer, View
} from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { DrawerProps } from 'element-plus'

const drawer = ref(false)
const drawer2 = ref(false)
const direction = ref<DrawerProps['direction']>('rtl')
const radio1 = ref('Option 1')
const handleClose = (done: () => void) => {
  done()
  // ElMessageBox.confirm('可以删除')
  //   .then(() => {
  //     done()
  //   })
  //   .catch(() => {
  //     // catch error
  //   })
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


const textarea1 = ref('')
const textarea2 = ref('')
const replycommentText = ref('')



const formLabelWidth = '140px'
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
})

// 我自己的代码

// 全局变量
const CommentTreeData = ref({}) // 存储全部的评论数据

import { useRoute } from 'vue-router';
const route = useRoute();
const articleId = route.params.articleId;
// 获取评论数据
const getCommentData = async function () {
  console.log("getCommentData事件触发")
  console.log("当前文章id为: " + articleId);
  const returnCommentData = await getCommentTreeStructuredDataService(articleId)
  CommentTreeData.value = returnCommentData.data
  console.log("返回的评论数据为: ")
  console.log(CommentTreeData.value)
}

// 引入全局事件总线
import eventBus from '../util/eventBus.js';
import { onUnmounted } from 'vue';
import { onMounted } from 'vue';
onMounted(() => {
  // const handleMyEvent = () => {
  //     console.log("事件总线的事件被触发了: openLoginDialog")
  //     dialogFormVisible.value = true;
  // };

  // 订阅事件
  const unsubscribe = eventBus.on('againGetCommentData', getCommentData);
  console.log("查看事件总线对象_取消订阅事件>前: ", eventBus);

  // 在组件卸载时记得解绑事件监听器，避免内存泄漏
  onUnmounted(() => {
    console.log("组件被卸载了,取消事件总线事件监听!!!!!!!!!!!!!")
    // 取消订阅事件
    eventBus.off('againGetCommentData', getCommentData);
    // 取消订阅所以事件
    eventBus.all.clear();

    console.log("查看事件总线对象_取消订阅事件>后: ", eventBus);
  });
});


// 发送评论
const sendComment = async function () {
  console.log("当前文章id为: " + articleId);
  console.log("评论内容为: " + textarea1.value)

  if (textarea1.value == '') {
    ElMessage({
      message: '评论不能为空',
      type: 'warning',
    })
    return;
  }

  const comment = {
    articleId: articleId,
    content: textarea1.value
  }

  const returnData = await publishCommentService(comment)
  console.log("发送评论返回的数据: " + returnData)
  console.log(returnData)
  console.log(returnData.data)
  if (returnData.data == 1) {
    ElMessage({
      message: '评论成功！！！',
      type: 'success',
    })
    // 评论成功后清空评论框，并重新渲染评论列表
    textarea1.value = '';
    getCommentData();
  }

}

// 回复评论的发送
const sendReplyComment = async function (parentId) {
  console.log("回复评论的发送，事件执行");
  console.log("当前文章id为: " + articleId);
  console.log("评论内容为: " + replycommentText.value)
  console.log("父级id为: " + parentId)

  if (replycommentText.value == '') {
    ElMessage({
      message: '回复不能为空',
      type: 'warning',
    })
    return;
  }

  const ReplyComment = {
    articleId: articleId,
    content: replycommentText.value,
    parentId: parentId
  }

  const returnData = await publishCommentService(ReplyComment)
  console.log("发送评论返回的数据: " + returnData)
  console.log(returnData)
  console.log(returnData.data)
  if (returnData.data == 1) {
    ElMessage({
      message: '回复成功！！！',
      type: 'success',
    })
    // 评论成功后清空评论框，并重新渲染评论列表
    replycommentText.value = '';
    getCommentData();
  }


}
</script>

<style scoped>
.TopCommentAvatar {
  /* border: 1px solid black; */
}

.TopCommentContent {
  /* border: 1px solid black; */
}

.childComment {
  /* border: 1px solid red; */
}

.writeComment {
  /* border: 1px solid red; */
  margin-bottom: 35px;
}
</style>
  