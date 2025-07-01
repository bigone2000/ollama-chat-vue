import type { ModelMetadata } from '@/type'
import { defineStore } from 'pinia'
import { getModels } from '@/services/ApiService'
import { usePromptStore } from './prompt' // 引入 usePromptStore

export const useModelStore = defineStore('model', {
  state() {
    return {
      models: [] as ModelMetadata[],
      selectModel: null as ModelMetadata | null,
    }
  },
  actions: {
    async getModels() {
      this.models = await getModels()
    },
    setSelectedModel(model: ModelMetadata | null) {
      this.selectModel = model
      const promptStore = usePromptStore()
      if (model) {
        promptStore.loadHistory(model.name)
      } else {
        promptStore.historyMessages = []
      }
    },
  },
})
