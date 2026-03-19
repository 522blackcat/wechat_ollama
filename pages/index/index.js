Page({
  data: {
    chatHistory: [],
    inputValue: '',
    isLoading: false,
    toView: ''
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  sendMessage() {
    const message = this.data.inputValue.trim();
    if (!message || this.data.isLoading) return;

    // 添加用户消息到历史记录
    const newHistory = [...this.data.chatHistory, { role: 'user', content: message }];
    this.setData({
      chatHistory: newHistory,
      inputValue: '',
      isLoading: true,
      toView: `msg-${newHistory.length - 1}`
    });

    // 添加一个空的 bot 消息占位
    const botMessageIndex = newHistory.length;
    newHistory.push({ role: 'assistant', content: '' });
    this.setData({ chatHistory: newHistory });

    const requestTask = wx.request({
      url: 'http://localhost:3000/chat', // 注意：真机调试时需要换成局域网 IP
      method: 'POST',
      data: {
        message: message,
        history: this.data.chatHistory.slice(0, -2) // 发送之前的历史记录，不包含刚发的和正在生成的
      },
      enableChunked: true, // 开启流式传输
      header: {
        'content-type': 'application/json'
      },
      success: (res) => {
        console.log('Request success', res);
      },
      fail: (err) => {
        console.error('Request failed', err);
        // 更新错误信息
        const history = this.data.chatHistory;
        history[botMessageIndex].content = '请求失败，请检查网络或服务器状态。';
        this.setData({ chatHistory: history });
      },
      complete: () => {
        this.setData({ isLoading: false });
      }
    });

    // 监听流式数据
    // 注意：TextDecoder 需要在开发者工具中开启“增强编译”或基础库版本足够高
    const decoder = new TextDecoder('utf-8');
    requestTask.onChunkReceived((response) => {
      const arrayBuffer = response.data;
      const text = decoder.decode(arrayBuffer, { stream: true });

      const history = this.data.chatHistory;
      // 找到最后一条消息（即机器人的消息）并追加内容
      const lastMsg = history[history.length - 1];
      if (lastMsg.role === 'assistant') {
         lastMsg.content += text;
         this.setData({
            chatHistory: history,
         });
         // 滚动到底部
         this.setData({
            toView: `msg-${history.length - 1}`
         })
      }
    });
  }
});