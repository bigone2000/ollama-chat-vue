<template>
  <div :class="['chat-message', message.role]" style="min-height: auto">
    <div class="markdown-content">
      <div class="inner">
        <!-- 直接渲染圖片，如果 imageUrl 存在的話 -->
        <img v-if="message.imageUrl" :src="message.imageUrl" alt="pasted"
          style="max-width: 100%; max-height: 400px; display: block; margin: 10px 0" />

        <div v-html="renderedMessageContent" class="markdown-body"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, toRef } from 'vue'
import { useMarkdownRenderer } from '@/composables/useMarkdownRenderer'
import type { HistoryMessage } from '@/type'

const props = defineProps<{
  message: HistoryMessage
  isLastMessage: boolean
}>()

const messageContentRef = toRef(props.message, 'content')
const { md } = useMarkdownRenderer()

const renderedMessageContent = computed(() => {
  return md.render(messageContentRef.value || '')
})
</script>

<style lang="scss" scoped>
@import url(../assets/chat-message.css);
</style>
