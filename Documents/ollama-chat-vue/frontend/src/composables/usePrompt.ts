import { ref } from 'vue'

/**
 *prompt 包含程式碼特徵時，格式化字串
 * @param prompt
 * @returns
 */
export function usePrompt(prompt: string) {
  const message = ref(prompt) // 響應式狀態

  const format = () => {
    let textContent = message.value.trim()
    if (textContent.includes('\n') && textContent.match(/[;{}=()]/)) {
      const lines = textContent.split('\n')
      let lastCodeLineIndex = -1
      for (let i = lines.length - 1; i >= 0; i--) {
        if (lines[i].match(/[;{}=()]/)) {
          lastCodeLineIndex = i
          break
        }
      }

      if (lastCodeLineIndex !== -1) {
        const codeLines = lines.slice(0, lastCodeLineIndex + 1).join('\n')
        const textLines = lines.slice(lastCodeLineIndex + 1).join('\n')
        // 確保 textLines 也有內容時才加上分隔
        const separator = textLines.trim() ? '\n\n' : ''
        textContent = `\`\`\`javascript\n${codeLines}\n\`\`\`${separator}${textLines.trim()}`
      }
      return textContent
    } else return textContent
  }

  return {
    format,
  }
}
