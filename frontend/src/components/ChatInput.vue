<template>
  <div class="input-area">
    <div class="input-wrapper">
      <div v-if="pastedImageUrl" class="image-preview-container">
        <img :src="pastedImageUrl" alt="Preview" class="image-preview" />
        <button @click="() => {
          pastedImageUrl = null;
        }" class="remove-image-btn">
          ×
        </button>
      </div>
      <textarea v-model="prompt" rows="1" :disabled="modelStore.selectModel === null"
        :placeholder="modelStore.selectModel !== null ? '在此輸入訊息或貼上圖片' : '請先選擇一個模型'" @keydown="handleKeyDown"
        @paste="hadnelPaste"></textarea>
    </div>
    <button class="submit-btn" @click="handleSubmitBtn">
      <img src="../assets/images/submit.svg" alt="Send" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useModelStore } from "@/stores/model";
import { usePromptStore } from '@/stores/prompt';
import { storeToRefs } from 'pinia';

const modelStore = useModelStore();
const promptStore = usePromptStore();
const { prompt, pastedImageUrl } = storeToRefs(promptStore);
const handleSubmitBtn = async (event: Event) => {
  await promptStore.setPrompt(prompt.value, pastedImageUrl.value);
}
const handleKeyDown = (event: KeyboardEvent) => {
  // 只有在按下 Enter 鍵且沒有按下 Shift 鍵時才觸發提交
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); // 阻止預設的換行行為
    handleSubmitBtn(event);
  }
}
const hadnelPaste = (event: ClipboardEvent) => {
  event.preventDefault();
  const items = event.clipboardData?.items;
  if (items) {
    Array.from(items).every((item) => {
      if (item.kind === "file" && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            pastedImageUrl.value = e.target?.result as string
          };
          reader.readAsDataURL(file);
          return false;
        }
      } else if (item.kind === 'string' && item.type === 'text/plain') {
        item.getAsString((s) => {
          prompt.value = s;
        });
      }
    })
  }
}
</script>

<style scoped>
@import '../assets/chat-input.css';
</style>
