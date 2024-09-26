<template>
    <div>
        <div style="margin-bottom: 15px;">
            <el-row>
                <el-col :span="4">
                    <div>
                        <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png" />
                    </div>
                </el-col>
                <el-col :span="20">
                    <div>
                        <div style="margin-bottom: 5px;">
                            <el-text class="mx-1" type="info">{{ comment.userName }}</el-text>
                            <span> 回复 </span>
                            <el-text class="mx-1" type="info">{{ comment.parentName }}</el-text>
                            <span>：{{ comment.content }}</span>
                        </div>
                        <el-text class="mx-1" type="info">
                            <span>{{ comment.createTime }}</span>
                            &nbsp;
                            <el-button :key="'primary'" :type="'primary'" link
                                @click="comment.replyWindowVisible = true">
                                <el-icon>
                                    <ChatDotSquare />
                                </el-icon> 回复
                            </el-button>
                            <el-dialog v-model="comment.replyWindowVisible" title="回复" width="500">
                                <div>
                                    <el-input v-model="replycommentText" style="width: 100%" :autosize="{ minRows: 4 }"
                                        type="textarea" placeholder="写点评论~" />
                                </div>
                                <template #footer>
                                    <div class="dialog-footer">
                                        <el-button @click="comment.replyWindowVisible = false">取消</el-button>
                                        <el-button type="primary"
                                            @click="comment.replyWindowVisible = false; sendReplyComment(comment.id)">
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
        <div v-if="comment.replies && comment.replies.length > 0">
            <RecursionComment v-for="reply in comment.replies" :key="reply.id" :comment="reply" />
        </div>


    </div>
</template>
  
<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import {
  Star, ChatDotSquare, Timer, View
} from '@element-plus/icons-vue'
// 引入Vue的props定义
import { ref,defineProps } from 'vue';

// 定义接收的props，这里需要一个评论对象作为输入
const props = defineProps({
    // 每个评论项的数据
    comment: {
        type: Object, // 类型为对象
        required: true // 此属性是必须的
    }
});

// 导入请求
import { getCommentTreeStructuredDataService, publishCommentService } from "../api/CommentApi.js"

const replycommentText = ref('')
import { useRoute } from 'vue-router';
const route = useRoute();
const articleId = route.params.articleId;

// 引入全局事件总线
import eventBus from '../util/eventBus.js';
// 回复评论的发送
const sendReplyComment = async function (parentId) {
  console.log("回复评论的发送，事件执行");
  console.log("当前文章id为(递归组件内): " + articleId);
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
    // 触发事件
    await eventBus.emit('againGetCommentData');
    // getCommentData();
  }
}
</script>
  
<style scoped></style>
  