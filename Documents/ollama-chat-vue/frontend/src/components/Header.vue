<template>
  <div class="header">
    <div>
      <h1>Ollama Chat</h1>
    </div>
    <div class="model-selector-container">
      <label htmlFor="model-selector" class="model-selector-label">
        選擇模型:
      </label>
      <select class="model-selector" :value="selectedModelName" @change="handleModelChange">
        <option value="">
          請選擇模型
        </option>
        <option v-for="model in models" :value="model.name" key="model.name">{{ model.name }}</option>
      </select>
      <button class="clear-history-btn" title="清除當前模型的對話紀錄"
        :disabled="!selectedModelName || historyMessages.length == 0" @click="handleClearHistory">
        <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="#e0e0e0">
          <path d="M0 0h24v24H0V0z" fill="none" />
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9zm7.5-5l-1-1h-5l-1 1H5v2h14V4h-3.5z" />
        </svg>
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, ref, watch } from 'vue'; // 引入 watch
import { useModelStore } from '@/stores/model';
import { usePromptStore } from "@/stores/prompt";
import { storeToRefs } from 'pinia';
const store = useModelStore();
const { models, selectModel } = storeToRefs(store); // 解構 models 和 selectModel

const selectedModelName = ref(''); // 將 selectedModelName 改回 ref

const promptStore = usePromptStore();
const { historyMessages } = storeToRefs(promptStore); // 使用 storeToRefs 解構 historyMessages

const handleModelChange = (event: Event) => {
  const selectedName = (event.target as HTMLSelectElement).value;
  selectedModelName.value = selectedName; // 更新 selectedModelName
  const selectedModel = models.value.find(m => m.name === selectedName);
  store.setSelectedModel(selectedModel ? selectedModel : null);
  // 在模型切換後，載入對應模型的歷史對話
  if (selectedModel) {
    promptStore.loadHistory(selectedModel.name);
  } else {
    promptStore.historyMessages = []; // 如果沒有選擇模型，則清空歷史對話
  }
}

const handleClearHistory = () => {
  if (selectedModelName.value) {
    promptStore.clearHistory(selectedModelName.value);
  }
}

onMounted(async () => {
  await store.getModels();
  // 在獲取模型後，如果沒有選中的模型，則預設選中第一個模型
  if (models.value.length > 0) {
    const defaultModel = models.value[0];
    selectedModelName.value = defaultModel.name; // 設置 selectedModelName
    store.setSelectedModel(defaultModel);
  } else {
    selectedModelName.value = '';
    store.setSelectedModel(null);
  }
})

// 監聽 selectModel 的變化，確保 selectedModelName 與其同步
watch(selectModel, (newModel) => {
  selectedModelName.value = newModel ? newModel.name : '';
});
</script>

<style scoped>
@import '../assets/header.css';
</style>
