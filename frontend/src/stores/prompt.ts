import { defineStore } from 'pinia'
import { sendHistoryMessages } from '@/services/ApiService'
import { useModelStore } from '@/stores/model'
import type { HistoryMessage } from '@/type'
import { usePrompt } from '@/composables/usePrompt'
import localforage from 'localforage' // 引入 localforage
// 初始化 localforage 實例
const historyStore = localforage.createInstance({
  name: 'chatHistory', // 資料庫名稱
  storeName: 'modelConversations', // 儲存區名稱
  description: 'Stores chat history for different models',
})
export const usePromptStore = defineStore('prompt', {
  state() {
    return {
      prompt: '',
      pastedImageUrl: null as string | null, // 允許為 null
      historyMessages: new Array<HistoryMessage>(),
      isLoading: false, // 添加 isLoading 狀態
    }
  },
  actions: {
    // 載入指定模型的歷史對話
    async loadHistory(modelName: string) {
      try {
        const history = await historyStore.getItem<HistoryMessage[]>(modelName)
        this.historyMessages.splice(0, this.historyMessages.length, ...(history || []))
      } catch (error) {
        console.error(`[PromptStore] 載入模型 ${modelName} 的歷史對話失敗:`, error)
        this.historyMessages = []
      }
    },

    // 保存當前模型的歷史對話
    async saveHistory(modelName: string) {
      try {
        const plainHistoryMessages = JSON.parse(JSON.stringify(this.historyMessages))
        await historyStore.setItem(modelName, plainHistoryMessages)
      } catch (error) {
        console.error(`[PromptStore] 保存模型 ${modelName} 的歷史對話失敗:`, error)
      }
    },

    // 清空指定模型的歷史對話
    async clearHistory(modelName: string) {
      try {
        await historyStore.removeItem(modelName)
        this.historyMessages = []
      } catch (error) {
        console.error(`[PromptStore] 清空模型 ${modelName} 的歷史對話失敗:`, error)
      }
    },

    async setPrompt(prompt: string, pastedImageUrl?: string | null) {
      const modelStore = useModelStore()
      this.prompt = prompt

      if (modelStore.selectModel) {
        const { format } = usePrompt(prompt)
        const userHistoryMessage = {
          role: 'user',
          content: format(),
          ...(pastedImageUrl && { imageUrl: pastedImageUrl }),
        } as HistoryMessage
        this.historyMessages.push(userHistoryMessage)

        await this.saveHistory(modelStore.selectModel.name)

        const formData = new FormData()
        formData.append('history', JSON.stringify(this.historyMessages))
        formData.append('model', modelStore.selectModel.name)

        if (pastedImageUrl) {
          const blob = await fetch(pastedImageUrl).then((res) => res.blob())
          formData.append('image', blob, 'pasted_image.png')
        }

        try {
          this.isLoading = true // 開始請求，設置為 true
          this.prompt = ''
          this.pastedImageUrl = null

          const respone = await sendHistoryMessages(formData)
          const assistantHistoryMessage = {
            role: 'assistant',
            content: respone.data.response,
          } as HistoryMessage
          this.historyMessages.push(assistantHistoryMessage)

          await this.saveHistory(modelStore.selectModel.name)
        } catch (error) {
          console.error('[PromptStore] 發送訊息失敗:', error)
        } finally {
          this.isLoading = false // 請求完成，設置為 false
        }
      } else {
        console.error('[PromptStore] 請先選擇模型')
      }
    },
  },
})
