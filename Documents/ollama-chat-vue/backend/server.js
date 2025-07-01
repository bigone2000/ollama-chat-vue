import express from "express";
import cors from "cors";
import multer from "multer";
import fetch from "node-fetch";
import { exec, spawn } from "child_process";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: "50mb" }));

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fieldSize: 50 * 1024 * 1024, fileSize: 50 * 1024 * 1024 }, // 將欄位大小限制增加到 50MB
});

app.get("/api/models", async (req, res) => {
  try {
    const tagsResponse = await fetch("http://localhost:11434/api/tags");
    const tagsData = await tagsResponse.json();
    res.json(tagsData.models); // Return the original, simple list
  } catch (error) {
    console.error("Error fetching models:", error);
    res.status(500).json({ error: "Failed to fetch models" });
  }
});

app.post("/api/generate", upload.single("image"), async (req, res) => {
  try {
    // 解析 request 中的 history 和 model
    const { history, model } = req.body;
    const image = req.file ? req.file.buffer.toString("base64") : null;
    // 解析 history 並準備消息給 Ollama
    // 使用 map 函數將 history 中的每個消息轉換為 { role, content } 的格式
    const messages = JSON.parse(history).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // 如果存在圖片且消息列表不空，將圖片添加到最後一條用戶消息中
    if (image && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        lastMessage.images = [image];
      }
    }

    // 定義系統消息
    const systemMessage = {
      role: "system",
      content:
        "You are a helpful assistant. Please respond in Traditional Chinese and use Markdown format.",
    };

    // 發送 POST 請求到 Ollama API
    const ollamaResponse = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [systemMessage, ...messages],
        stream: false,
      }),
    });

    // 檢查 Ollama API 的響應狀態
    if (!ollamaResponse.ok) {
      const errorText = await ollamaResponse.text();
      throw new Error(
        `Ollama API responded with ${ollamaResponse.status}: ${errorText}`
      );
    }

    // 解析 Ollama API 的回應
    const data = await ollamaResponse.json();
    res.json({ response: data.message.content });
  } catch (error) {
    // 處理錯誤
    console.error("Error calling Ollama API:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Failed to call Ollama API" });
    }
  }
});

app.post("/api/restart-ollama", (req, res) => {
  console.log("接收到重啟 Ollama 的請求");

  const startCommand = "ollama serve";
  const findPortProcessCommand = 'netstat -ano | findstr ":11434"';

  const startOllama = () => {
    console.log("正在以分離模式嘗試啟動 Ollama...");

    const [command, ...args] = startCommand.split(" ");

    const ollamaProcess = spawn(command, args, {
      detached: true,
      stdio: "ignore", // 將子進程的 I/O 與父進程分離
    });

    // unref() 允許父進程退出，而子進程繼續運行
    ollamaProcess.unref();

    console.log("Ollama 啟動命令已發送。");

    if (!res.headersSent) {
      res.json({ message: "Ollama 重啟程序已成功啟動" });
    }
  };

  const killProcessByPort = (callback) => {
    exec(findPortProcessCommand, (error, stdout, stderr) => {
      if (stdout) {
        const lines = stdout.trim().split("\n");
        const pids = lines
          .map((line) => {
            const columns = line.trim().split(/\s+/);
            return columns[columns.length - 1];
          })
          .filter((pid) => pid && pid !== "0"); // 過濾掉無效的 PID

        const uniquePids = [...new Set(pids)];

        if (uniquePids.length > 0) {
          const killCommand = `taskkill /F ${uniquePids
            .map((pid) => `/PID ${pid}`)
            .join(" ")}`;
          console.log(`正在執行: ${killCommand}`);
          exec(killCommand, (killError, killStdout, killStderr) => {
            if (killError) {
              console.error(`終止 PID 時發生錯誤: ${killError.message}`);
            }
            console.log(`終止 PID 的輸出: ${killStdout}`);
            // 在終止後稍作等待
            setTimeout(callback, 2000);
          });
        } else {
          console.log("沒有找到有效的 PID 需要終止。");
          callback();
        }
      } else {
        // 沒有找到進程，直接繼續
        console.log("端口 11434 未被佔用。");
        callback();
      }
    });
  };

  // 首先，嘗試按名稱終止
  exec("taskkill /F /IM ollama.exe", (error, stdout, stderr) => {
    if (error && !stderr.includes("not found")) {
      console.error(`停止 ollama.exe 時發生錯誤: ${error.message}`);
    }
    // 然後，按端口終止任何剩餘的進程
    killProcessByPort(() => {
      startOllama();
    });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
