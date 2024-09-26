<template>
    <el-upload name="filedata" :headers="uploadHeaders" class="avatar-uploader" action="http://localhost:10010/article/imageUpload" :show-file-list="false"
        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="imageUrl" :src="imageUrl" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon">
            <Plus />
        </el-icon>
    </el-upload>
</template>
  
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'

const imageUrl = ref('')
// 导入状态库的token状态
import { useTokenStore } from '../stores/token.js'
const tokenStore = useTokenStore();
const uploadHeaders = ref({
    "Authorization": tokenStore.token, // 示例：添加一个JWT Token
    "uploadMark": "single"
})

// 导入状态库的coverUrl状态
import { useCoverUrlStore } from '../stores/coverUrl.js'
const coverUrlStore = useCoverUrlStore();
const handleAvatarSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
    imageUrl.value = URL.createObjectURL(uploadFile.raw!)
    console.log(imageUrl.value)
    console.log(response)
    console.log(response.data.url)
    coverUrlStore.setCoverUrl(response.data.url)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    // if (rawFile.type !== 'image/jpeg') {
    //     ElMessage.error('Avatar picture must be JPG format!')
    //     return false
    // } else 
    if (rawFile.size / 1024 / 1024 > 2) {
        ElMessage.error('Avatar picture size can not exceed 2MB!')
        return false
    }
    return true
}
</script>
  
<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
  
<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>
  