import { WebSocketServer } from 'ws';
import express from 'express';
import cors from 'cors';
import http from 'http';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// 中间件
app.use(cors());
app.use(express.json());

// 存储连接的客户端和用户信息
const clients = new Map();
const users = new Set();
const messages = []; // 存储聊天消息历史

// HTTP API路由
app.get('/api/chat', (req, res) => {
  res.json({
    success: true,
    messages: messages.slice(-50), // 返回最近50条消息
    users: Array.from(users)
  });
});

app.post('/api/chat', (req, res) => {
  const { type, username, message } = req.body;
  
  if (type === 'join') {
    if (users.has(username)) {
      return res.status(400).json({
        error: '用户名已存在，请选择其他用户名'
      });
    }
    
    users.add(username);
    
    // 广播用户加入消息
    const welcomeMessage = {
      type: 'message',
      id: Date.now(),
      sender: '系统',
      content: `${username} 加入了聊天室`,
      timestamp: new Date().toLocaleTimeString(),
      isSystem: true
    };
    messages.push(welcomeMessage); // 添加到消息历史
    broadcast(welcomeMessage);
    broadcastUserList();
    
    res.json({
      success: true,
      username,
      users: Array.from(users),
      userCount: users.size
    });
  } else if (type === 'leave') {
    users.delete(username);
    
    // 广播用户离开消息
    const leaveMessage = {
      type: 'message',
      id: Date.now(),
      sender: '系统',
      content: `${username} 离开了聊天室`,
      timestamp: new Date().toLocaleTimeString(),
      isSystem: true
    };
    messages.push(leaveMessage); // 添加到消息历史
    broadcast(leaveMessage);
    broadcastUserList();
    
    res.json({
      success: true,
      users: Array.from(users),
      userCount: users.size
    });
  } else if (type === 'message') {
    if (!users.has(username)) {
      return res.status(400).json({
        error: '请先加入聊天室'
      });
    }
    
    const chatMessage = {
      type: 'message',
      id: Date.now(),
      sender: username,
      content: message,
      timestamp: new Date().toLocaleTimeString(),
      isUser: false
    };
    
    messages.push(chatMessage); // 添加到消息历史
    broadcast(chatMessage);
    
    res.json({
      success: true,
      messageId: chatMessage.id
    });
  } else {
    res.status(400).json({
      error: '无效的操作'
    });
  }
});

// 广播消息给所有连接的客户端
function broadcast(message, excludeClient = null) {
  const messageStr = JSON.stringify(message);
  clients.forEach((userData, client) => {
    if (client !== excludeClient && client.readyState === 1) { // 1 = OPEN
      client.send(messageStr);
    }
  });
}

// 发送在线用户列表
function broadcastUserList() {
  const userList = Array.from(users);
  const message = {
    type: 'userList',
    users: userList,
    count: userList.length
  };
  broadcast(message);
}

wss.on('connection', (ws) => {
  console.log('新客户端连接');
  
  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data);
      
      switch (message.type) {
        case 'join':
          // 用户加入聊天室
          const username = message.username;
          if (users.has(username)) {
            ws.send(JSON.stringify({
              type: 'error',
              message: '用户名已存在，请选择其他用户名'
            }));
            return;
          }
          
          clients.set(ws, { username });
          users.add(username);
          
          // 发送欢迎消息
          const welcomeMessage = {
            type: 'message',
            id: Date.now(),
            sender: '系统',
            content: `${username} 加入了聊天室`,
            timestamp: new Date().toLocaleTimeString(),
            isSystem: true
          };
          broadcast(welcomeMessage);
          
          // 更新用户列表
          broadcastUserList();
          
          // 发送确认消息给新用户
          ws.send(JSON.stringify({
            type: 'joined',
            username: username
          }));
          break;
          
        case 'message':
          // 用户发送消息
          const userData = clients.get(ws);
          if (!userData) {
            ws.send(JSON.stringify({
              type: 'error',
              message: '请先加入聊天室'
            }));
            return;
          }
          
          const chatMessage = {
            type: 'message',
            id: Date.now(),
            sender: userData.username,
            content: message.message,
            timestamp: new Date().toLocaleTimeString(),
            isUser: false // 对其他用户来说这是别人的消息
          };
          
          // 广播消息给所有其他用户
          broadcast(chatMessage, ws);
          
          // 给发送者确认消息已发送
          ws.send(JSON.stringify({
            type: 'messageSent',
            id: chatMessage.id
          }));
          break;
      }
    } catch (error) {
      console.error('处理消息错误:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: '消息格式错误'
      }));
    }
  });
  
  ws.on('close', () => {
    console.log('客户端断开连接');
    const userData = clients.get(ws);
    if (userData) {
      users.delete(userData.username);
      clients.delete(ws);
      
      // 发送离开消息
      const leaveMessage = {
        type: 'message',
        id: Date.now(),
        sender: '系统',
        content: `${userData.username} 离开了聊天室`,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      };
      broadcast(leaveMessage);
      
      // 更新用户列表
      broadcastUserList();
    }
  });
  
  ws.on('error', (error) => {
    console.error('WebSocket错误:', error);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`WebSocket聊天服务器运行在端口 ${PORT}`);
});