import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

/**
 * 配置並返回一個 MarkdownIt 實例，用於解析 Markdown 並進行程式碼高亮。
 * @returns 配置好的 MarkdownIt 實例。
 */

export function useMarkdownRenderer() {
  const md: MarkdownIt = new MarkdownIt({ // 明確指定 md 的類型
    html: true, // 啟用在 Markdown 中使用 HTML 標籤
    linkify: true, // 自動將 URL 轉換為連結
    typographer: true, // 啟用一些排版替換，例如引號、破折號等

    // highlight 函數用於程式碼高亮
    highlight: function (str: string, lang: string) : string { // 明確指定 str, lang 的類型和返回類型
      if (lang && hljs.getLanguage(lang)) {
        try {
          // 使用 highlight.js 進行高亮
          return (
            '<pre><code class="hljs language-' +
            lang +
            '">' +
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
            '</code></pre>'
          )
        } catch (__) {}
      }

      // 如果沒有指定語言或高亮失敗，則返回原始程式碼，並添加 hljs 類名
      return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>'
    },
  })

  return {
    md,
  }
}
