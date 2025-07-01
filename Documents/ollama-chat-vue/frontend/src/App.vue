<script setup lang="ts">
// 引入 Header 組件
import Header from './components/Header.vue';
// 引入 ChatInput 組件
import ChatInput from './components/ChatInput.vue';
// 引入 ChatWindow 組件
import ChatWindow from './components/ChatWindow.vue';
</script>

<template>
  <!-- 應用程式主容器 -->
  <div class="App">
    <!-- 頁面頂部導航和模型選擇組件 -->
    <Header></Header>
    <!-- 聊天內容顯示窗口組件 -->
    <ChatWindow></ChatWindow>
    <!-- 聊天輸入框組件 -->
    <ChatInput></ChatInput>
  </div>
</template>

<style scoped></style>
