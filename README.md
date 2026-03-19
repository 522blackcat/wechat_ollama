# Ollama 微信小程序对话助手

本项目实现了一个简单的微信小程序，能够与本地运行的 Ollama 大模型进行实时流式对话。项目包含 Node.js 后端服务和微信小程序前端代码。

## 目录结构

- `server/`: Node.js 后端服务，负责转发小程序请求到本地 Ollama 接口。
- `miniprogram/`: 微信小程序前端，提供聊天界面和流式响应处理。
- `test/`: 包含一个 `index.html` 文件，用于在浏览器中直接测试后端服务。

## 前置要求

- [Node.js](https://nodejs.org/) (建议 v18+)
- [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
- [Ollama](https://ollama.com/) (需安装并运行)

## 快速开始

### 1. 准备 Ollama 环境

确保您已经安装并启动了 Ollama。

下载一个模型（例如 `qwen2.5:latest` 或 `llama3`）：

```bash
ollama pull qwen2.5:latest
```

*注意：如果使用其他模型，请记得修改 `server/server.js` 中的 `model` 字段。*

### 2. 启动后端服务

进入 `server` 目录，安装依赖并启动服务：

```bash
cd server
npm install
node server.js
```

如果看到 `Server running at http://0.0.0.0:3000`，说明后端服务启动成功。

### 3. 导入微信小程序

1.  打开 **微信开发者工具**。
2.  点击 **导入项目**。
3.  **目录** 选择本项目下的 `miniprogram` 文件夹。
4.  **AppID** 可以使用测试号（或者您自己的 AppID）。
5.  点击 **导入**。

### 4. 调试与预览

#### 模拟器调试 (推荐)

1.  在微信开发者工具中，点击右上角的 **详情** -> **本地设置**。
2.  **必须勾选**：`不校验合法域名、web-view（业务域名）、TLS版本以及HTTPS证书`。
3.  现在您应该可以在模拟器中与 AI 对话了。

#### 真机预览 (局域网)

如果要用手机预览，需要确保手机和电脑在同一局域网（Wi-Fi）下。

1.  获取电脑的局域网 IP 地址（例如 `192.168.1.5`）。
2.  修改 `miniprogram/pages/index/index.js` 文件，将 `url` 中的 `localhost` 替换为您的电脑 IP：
    ```javascript
    // miniprogram/pages/index/index.js
    url: 'http://192.168.1.5:3000/chat',
    ```
3.  点击开发者工具的 **预览**，用手机微信扫码即可。

### 5. Web 浏览器测试

为了方便在电脑浏览器中直接测试后端服务，项目提供了一个简单的 Web 测试页面。

1.  确保您的后端服务正在运行 (`node server.js`)。
2.  用浏览器打开项目根目录下的 `test/index.html` 文件。
3.  在输入框中输入消息并发送，即可与 Ollama 模型进行对话。

## 常见问题

### 1. `npm install` 失败
如果您在 `server` 目录下执行 `npm install` 失败，请尝试以下步骤：

**方法一：使用淘宝镜像源（推荐）**
```bash
npm install --registry=https://registry.npmmirror.com
```

**方法二：清理缓存并重试**
如果方法一无效，请尝试删除 `package-lock.json` 和 `node_modules` 文件夹，清理缓存后重新安装：
```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install --registry=https://registry.npmmirror.com
```

**方法三：使用 cnpm**
如果以上方法都失败，可以尝试安装 `cnpm`：
```bash
npm install -g cnpm --registry=https://registry.npmmirror.com
cnpm install
```

### 2. 连接失败 / 请求超时
- 检查后端服务是否正在运行 (`npm start` 或 `node server.js`)。
- 检查 Ollama 是否正在运行 (`ollama serve`)。
- 检查微信开发者工具中是否勾选了“不校验合法域名”。
- 如果是真机调试，请确保防火墙允许 3000 端口访问，且手机电脑在同一 Wi-Fi。

### 2. 回复乱码
- 前端代码使用了 `TextDecoder` 处理流式数据。
- 请确保微信开发者工具的 **基础库版本** 较高（建议 2.19.0 以上）。
- 在开发者工具设置中开启 **增强编译**。

### 3. 如何修改模型？
打开 `server/server.js`，修改 `ollama.chat` 调用中的 `model` 参数：

```javascript
const response = await ollama.chat({
  model: 'deepseek-r1:latest', // 修改为你想要使用的模型
  messages: messages,
  stream: true,
});

## 版本控制

本项目包含一个 `.gitignore` 文件，用于在版本控制中忽略不需要提交的文件和目录，例如：

- `/node_modules/` 和 `/server/node_modules/`: 项目依赖，应在部署时通过 `npm install` 重新安装。
- 敏感的环境变量文件（如 `.env`）。
- IDE 或编辑器自动生成的配置。

这有助于保持 Git 仓库的整洁和安全。