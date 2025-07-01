# Ollama Chat Vue

一個基於 Vue 3 (前端) 和 Node.js (後端) 的大型語言模型 (LLM) 聊天應用程式，旨在提供一個與 Ollama API 互動的介面。此專案支援文字和圖片輸入，並能顯示格式化的聊天回應，還能選擇要與哪個 LLM 聊天。
![Ollama Chat Vue 預覽](frontend/ollama_chat.gif)

## 專案特色

- **前端**:
  - 使用 Vue 3 構建使用者介面。
  - 狀態管理採用 Pinia。
  - 透過 Axios 進行 API 請求。
  - 使用 `highlight.js` 和 `markdown-it` 處理聊天內容的 Markdown 格式化和程式碼高亮。
  - 開發工具使用 Vite。
  - 支援 TypeScript。
- **後端**:
  - 基於 Node.js 和 Express 框架。
  - 處理 CORS 請求。
  - 使用 Multer 處理圖片上傳。
  - 透過 `node-fetch` 與本地運行的 Ollama API 進行通訊。
  - 提供重啟 Ollama 服務的 API 端點。
- **核心功能**:
  - 與 Ollama 模型進行即時聊天互動。
  - 支援文字訊息輸入。
  - 支援圖片上傳作為聊天輸入的一部分。
  - 顯示完整的聊天歷史記錄。
  - 聊天回應支援 Markdown 格式和程式碼高亮。
  - 提供重啟本地 Ollama 服務的機制。

## 技術棧

- **前端**:
  - Vue 3
  - Pinia
  - Axios
  - highlight.js
  - markdown-it
  - Vite
  - TypeScript
- **後端**:
  - Node.js
  - Express
  - CORS
  - Multer
  - node-fetch

## 專案結構

```
.
├── backend/                  # 後端 Node.js 應用程式
│   ├── package.json          # 後端依賴項
│   └── server.js             # 後端主程式
└── frontend/                 # 前端 Vue 3 應用程式
    ├── public/
    ├── src/
    │   ├── assets/           # 靜態資源 (CSS, 圖片)
    │   ├── components/       # Vue 組件
    │   ├── composables/      # Vue Composition API 可組合函數
    │   ├── services/         # API 服務
    │   ├── stores/           # Pinia 狀態管理
    │   ├── type/             # TypeScript 類型定義
    │   ├── App.vue           # 根組件
    │   └── main.ts           # 應用程式入口
    ├── package.json          # 前端依賴項
    └── vite.config.ts        # Vite 配置
```

## 如何運行

在運行此專案之前，請確保您的系統已安裝 Node.js 和 npm。

### 1. 安裝 Ollama

請確保您已在本地機器上安裝並運行 Ollama 服務。您可以從 [Ollama 官方網站](https://ollama.com/) 下載並安裝。

安裝完成後，請確保 Ollama 服務正在運行 (通常透過執行 `ollama serve` 命令)。

### 2. 啟動後端

進入 `backend` 目錄，安裝依賴項並啟動伺服器：

```bash
cd backend
npm install
node server.js
```

後端伺服器將在 `http://localhost:3001` 運行。

### 3. 啟動前端

在另一個終端機視窗中，進入 `frontend` 目錄，安裝依賴項並啟動開發伺服器：

```bash
cd frontend
npm install
npm run dev
```

前端應用程式將在 `http://localhost:5173` (或 Vite 提供的其他端口) 運行。

### 4. 使用應用程式

打開您的瀏覽器並訪問前端應用程式的地址 (例如 `http://localhost:5173`)，即可開始與 Ollama 模型進行聊天。
