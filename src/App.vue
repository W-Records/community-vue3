<script setup>

</script>

<template>
  <div class="app-container">
    <router-view></router-view>
  </div>
</template>

<style scoped>
/* 设置全屏背景颜色 */
.app-container {
  height: 100vh;
  /* 保证高度覆盖整个视口 */
  background-color: #F2F6FC;
  /* 替换为你想要的背景颜色 */
  /* border: 1px solid #161622; */
}
</style>
