<template>
  <div class="chat-container" ref="chatContainer">
    <ChatMessage v-for="(historyMessage, index) in historyMessages" :key="historyMessage.content + index"
      :message="historyMessage" :isLastMessage="index === historyMessages.length - 1"></ChatMessage>
    <ChatLoading v-if="isLoading" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'; // 引入 ref, onMounted, watch, nextTick
import { usePromptStore } from "@/stores/prompt";
import ChatMessage from "@/components/ChatMessage.vue"; // 引入 ChatMessage 組件
import ChatLoading from "@/components/ChatLoading.vue"; // 引入 ChatLoading 組件
import { storeToRefs } from 'pinia';

const promptStore = usePromptStore();
const { historyMessages, isLoading } = storeToRefs(promptStore); // 解構 isLoading

const chatContainer = ref<HTMLElement | null>(null); // 獲取 chat-container 的引用

const scrollToBottom = () => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

onMounted(() => {
  scrollToBottom(); // 頁面載入時滾動到底部
});

watch(historyMessages, () => {
  nextTick(() => {
    scrollToBottom(); // historyMessages 變化後，在下一個 DOM 更新週期滾動到底部
  });
}, { deep: true }); // 深度監聽 historyMessages 陣列內容的變化

watch(isLoading, (newVal) => {
  if (newVal) {
    nextTick(() => {
      scrollToBottom(); // isLoading 變為 true 時，滾動到底部
    });
  }
});

</script>

<style scoped>
.chat-container {
  flex-grow: 1;
  padding: 24px;
  overflow-y: scroll;
  /* Always show scrollbar */
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
