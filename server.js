const express = require('express');
const cors = require('cors');
const { Ollama } = require('ollama');

const app = express();
const port = 3000;

// 允许跨域访问，方便小程序调用
app.use(cors());
app.use(express.json());

const ollama = new Ollama({ host: 'http://127.0.0.1:11434' });

// 聊天接口
app.post('/chat', async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  // 构建消息历史
  const messages = history || [];
  messages.push({ role: 'user', content: message });

  try {
    // 设置响应头，支持流式输出
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    const response = await ollama.chat({
      model: 'qwen3.5:latest', // 使用您本地的模型
      messages: messages,
      stream: true,
    });

    for await (const part of response) {
      // 将每个片段发送给客户端
      res.write(part.message.content);
    }

    res.end();
  } catch (error) {
    console.error('Error calling Ollama:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});