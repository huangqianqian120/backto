import React, { useState, useRef, useEffect } from 'react';
import { Send, Users, MessageCircle } from 'lucide-react';

const VintageChat = () => {
  const [activeTab, setActiveTab] = useState('yuna'); // 'yuna' or 'chatroom'
  const [username, setUsername] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(0);
  const [userList, setUserList] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('disconnected'); // 'connecting', 'connected', 'disconnected'
  const [pollInterval, setPollInterval] = useState(null);
  
  // Yuna聊天相关状态
  const [yunaMessages, setYunaMessages] = useState([
    {
      id: 1,
      sender: 'Yuna',
      content: '你好！我是Yuna，很高兴见到你！有什么想聊的吗？',
      timestamp: new Date().toLocaleTimeString(),
      isUser: false
    }
  ]);
  
  // 聊天室相关状态
  const [chatroomMessages, setChatroomMessages] = useState([]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 从本地存储加载用户信息
  useEffect(() => {
    const savedUsername = localStorage.getItem('plaza_username');
    const savedUserIP = localStorage.getItem('plaza_user_ip');
    const currentIP = getUserIP();
    
    if (savedUsername && savedUserIP === currentIP) {
      setUsername(savedUsername);
      setIsUsernameSet(true);
    }
  }, []);

  // 处理组件卸载时的离开逻辑
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (connectionStatus === 'connected' && username) {
        // 使用 navigator.sendBeacon 确保在页面卸载时能发送请求
        const leaveData = JSON.stringify({
          type: 'leave',
          username
        });
        navigator.sendBeacon('/api/chat', leaveData);
      }
    };

    const handleUnload = () => {
      if (connectionStatus === 'connected' && username) {
        const leaveData = JSON.stringify({
          type: 'leave',
          username
        });
        navigator.sendBeacon('/api/chat', leaveData);
      }
    };

    // 监听页面卸载事件
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('unload', handleUnload);

    // 组件卸载时的清理函数
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unload', handleUnload);
      
      // 组件卸载时发送离开请求
      if (connectionStatus === 'connected' && username) {
        fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'leave',
            username
          })
        }).catch(console.error);
      }
    };
  }, [connectionStatus, username]);

  // 获取用户IP地址（简化版本）
  const getUserIP = () => {
    // 在实际应用中，你可能需要调用外部API来获取真实IP
    // 这里使用一个简化的方法
    return localStorage.getItem('user_session_id') || 
           Math.random().toString(36).substring(2, 15);
  };

  // 保存用户信息到本地存储
  const saveUserToLocalStorage = (username) => {
    const userIP = getUserIP();
    localStorage.setItem('plaza_username', username);
    localStorage.setItem('plaza_user_ip', userIP);
    if (!localStorage.getItem('user_session_id')) {
      localStorage.setItem('user_session_id', userIP);
    }
  };
  
  // REST API连接管理
  useEffect(() => {
    if (activeTab === 'chatroom' && isUsernameSet) {
      console.log('开始连接到聊天室...');
      connectToChat();
    } else if (activeTab !== 'chatroom') {
      // 切换到其他标签时停止轮询
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollInterval(null);
      }
      setConnectionStatus('disconnected');
    }
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
        setPollInterval(null);
      }
    };
  }, [activeTab, isUsernameSet]);

  // 清理轮询
  useEffect(() => {
    return () => {
      if (pollInterval) {
        clearInterval(pollInterval);
      }
    };
  }, [pollInterval]);

  const connectToChat = async () => {
    setConnectionStatus('connecting');
    
    try {
      // 尝试加入聊天室
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'join',
          username: username
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log('成功加入聊天室:', data);
        
        // 立即开始轮询消息，这会设置连接状态
        startPolling();
        
        // 添加加入成功的系统消息
        const joinMessage = {
          id: Date.now(),
          sender: '系统',
          content: `欢迎 ${username} 加入聊天室！`,
          timestamp: new Date().toLocaleTimeString(),
          isSystem: true
        };
        setChatroomMessages(prev => [...prev, joinMessage]);
      } else {
        console.error('连接失败:', data.error);
        setConnectionStatus('disconnected');
        alert(data.error || '连接失败，请重试');
        // 如果用户名已存在，清除本地存储的用户名
        if (data.error && data.error.includes('用户名已存在')) {
          localStorage.removeItem('plaza_username');
          localStorage.removeItem('plaza_user_ip');
          setIsUsernameSet(false);
          setUsername('');
        }
      }
    } catch (error) {
      console.error('连接错误:', error);
      setConnectionStatus('disconnected');
      alert('网络连接错误，请检查网络后重试');
    }
  };
  
  const startPolling = () => {
    console.log('开始轮询消息...');
    // 清除现有的轮询
    if (pollInterval) {
      clearInterval(pollInterval);
    }
    
    // 立即获取一次消息
    fetchMessages();
    
    // 设置定期轮询
    const interval = setInterval(() => {
      console.log('轮询获取消息...');
      fetchMessages();
    }, 2000); // 每2秒轮询一次
    setPollInterval(interval);
  };
  
  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/chat');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success) {
        // 更新聊天室消息
        setChatroomMessages(data.messages || []);
        // 更新用户列表和在线人数
        setUserList(data.users || []);
        setOnlineUsers((data.users || []).length);
        // 确保连接状态为已连接
        if (connectionStatus !== 'connected') {
          setConnectionStatus('connected');
          console.log('连接状态已更新为：已连接');
        }
      } else {
        console.error('API返回失败:', data.error);
        setConnectionStatus('disconnected');
      }
    } catch (error) {
      console.error('获取消息失败:', error);
      setConnectionStatus('disconnected');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [yunaMessages, chatroomMessages]);

  const currentMessages = activeTab === 'yuna' ? yunaMessages : chatroomMessages;



  const sendYunaMessage = async (message) => {
    const userMessage = {
      id: Date.now(),
      sender: '我',
      content: message,
      timestamp: new Date().toLocaleTimeString(),
      isUser: true
    };

    setYunaMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 调用Deepseek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是Yuna，来自最终幻想X的召唤师。你温柔、善良、坚强且充满希望。请用简洁自然的对话方式回复，不要包含任何动作描述、表情符号或括号内的动作文字。只需要用Yuna温和有礼的语气直接回答问题或进行对话，保持她乐观友善的性格特点。回复要简洁明了，就像普通的聊天对话一样。'
            },
            {
              role: 'user',
              content: message
            }
          ],
          max_tokens: 150,
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const botMessage = {
        id: Date.now() + 1,
        sender: 'Yuna',
        content: data.choices[0].message.content,
        timestamp: new Date().toLocaleTimeString(),
        isUser: false
      };

      setYunaMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('发送消息失败:', error);
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'Yuna',
        content: '抱歉，我现在无法回复你的消息。请检查网络连接或API配置。',
        timestamp: new Date().toLocaleTimeString(),
        isUser: false
      };
      setYunaMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendChatroomMessage = async (messageContent) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'message',
          username: username,
          message: messageContent
        })
      });
      
      if (response.ok) {
        // 消息发送成功，轮询会获取到新消息
        console.log('消息发送成功');
      } else {
        const errorData = await response.json();
        console.error('发送消息失败:', errorData.error);
        throw new Error(errorData.error || '发送失败');
      }
    } catch (error) {
      console.error('发送消息错误:', error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;
    
    const messageToSend = inputMessage.trim();
    setInputMessage('');
    
    try {
      if (activeTab === 'yuna') {
        await sendYunaMessage(messageToSend);
      } else {
        // 立即显示用户发送的消息
        const userMessage = {
          id: Date.now(),
          sender: username,
          content: messageToSend,
          timestamp: new Date().toLocaleTimeString(),
          isUser: true
        };
        setChatroomMessages(prev => [...prev, userMessage]);
        
        await sendChatroomMessage(messageToSend);
      }
    } catch (error) {
      console.error('发送消息失败:', error);
      alert('消息发送失败，请重试');
    }
  };

  const handleUsernameSubmit = () => {
    if (username.trim()) {
      setIsUsernameSet(true);
      saveUserToLocalStorage(username.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 用户名输入界面
  if (activeTab === 'chatroom' && !isUsernameSet) {
    return (
      <div className="h-full flex flex-col bg-gradient-to-b from-gray-100 to-gray-200 font-pixel font-pixel-md">
        <div className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-4 py-2 border-b-2 border-blue-600">
          <div className="flex items-center space-x-2">
            <Users size={16} />
            <span className="font-pixel-lg font-bold">Plaza</span>
          </div>
        </div>
        
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md border-2 border-gray-300">
            <h3 className="font-pixel-lg font-bold text-center mb-4 text-gray-800">欢迎来到Plaza</h3>
            <p className="font-pixel-md text-gray-600 text-center mb-6">请输入您的用户名以开始聊天</p>
            
            <div className="space-y-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleUsernameSubmit()}
                placeholder="输入用户名..."
                className="w-full px-3 py-2 border-2 border-gray-400 rounded-md font-pixel-md focus:outline-none focus:border-blue-500 bg-white"
                maxLength={20}
              />
              
              <button
                onClick={handleUsernameSubmit}
                disabled={!username.trim()}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors border-2 border-blue-600 shadow-md font-pixel-md"
              >
进入Plaza
              </button>
            </div>
            
            <div className="mt-4 text-center">
              <span className="font-pixel-sm text-gray-500">当前在线: {onlineUsers} 人</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex bg-gradient-to-b from-gray-100 to-gray-200 font-pixel font-pixel-md">
      {/* 左侧选择菜单 */}
      <div className="w-48 bg-gray-800 text-white border-r-2 border-gray-600 flex flex-col">
        <div className="p-4 border-b border-gray-600">
          <h2 className="font-pixel-lg font-bold text-center">聊天选择</h2>
        </div>
        
        <div className="flex-1 p-2">
          <button
            onClick={() => setActiveTab('yuna')}
            className={`w-full p-3 mb-2 rounded-md font-pixel-md transition-colors border-2 ${
              activeTab === 'yuna'
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <MessageCircle size={16} />
              <span>Chat with Yuna</span>
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('chatroom')}
            className={`w-full p-3 rounded-md font-pixel-md transition-colors border-2 ${
              activeTab === 'chatroom'
                ? 'bg-blue-600 border-blue-400 text-white'
                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Users size={16} />
              <span>Plaza</span>
            </div>
          </button>
          
          {activeTab === 'chatroom' && isUsernameSet && (
            <div className="mt-4 p-2 bg-gray-700 rounded-md border border-gray-600">
              <div className="font-pixel-sm text-gray-300 text-center">
                <div>用户: {username}</div>
                <div className="mt-1">在线: {onlineUsers} 人</div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* 右侧聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 聊天标题栏 */}
        <div className={`text-white px-4 py-2 border-b-2 ${
          activeTab === 'yuna'
            ? 'bg-gradient-to-r from-blue-400 to-blue-500 border-blue-600'
            : 'bg-gradient-to-r from-blue-400 to-blue-500 border-blue-600'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                activeTab === 'yuna' ? 'bg-blue-400 animate-pulse' :
                connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                'bg-red-400'
              }`}></div>
              <span className="font-pixel-lg font-bold">
                {activeTab === 'yuna' ? '与 Yuna 的聊天' : 'Plaza'}
              </span>
              {activeTab === 'chatroom' && (
                <div className="flex items-center space-x-2">
                  <span className="font-pixel-sm opacity-75">{
                    connectionStatus === 'connected' ? '已连接' :
                    connectionStatus === 'connecting' ? '连接中...' :
                    '未连接'
                  }</span>
                  {connectionStatus === 'disconnected' && (
                    <button
                      onClick={connectToChat}
                      className="font-pixel-sm px-2 py-1 bg-blue-600 hover:bg-blue-700 rounded text-white"
                    >
                      重连
                    </button>
                  )}
                </div>
              )}
            </div>
            {activeTab === 'chatroom' && (
              <div className="flex items-center space-x-2">
                <Users size={16} />
                <span className="font-pixel-sm">{onlineUsers} 在线</span>
              </div>
            )}
          </div>
        </div>

        {/* 消息区域 */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {currentMessages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-2 ${
                message.isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg shadow-md ${
                  message.isUser
                    ? activeTab === 'yuna'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-blue-500 text-white rounded-br-none'
                    : message.isSystem
                    ? 'bg-yellow-100 text-gray-700 border border-yellow-300 rounded-lg'
                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-300'
                }`}
              >
                <div className="font-pixel-sm font-bold mb-1">
                  {message.sender}
                </div>
                <div className="font-pixel-md whitespace-pre-wrap">
                  {message.content}
                </div>
                <div className="font-pixel-sm opacity-70 mt-1">
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && activeTab === 'yuna' && (
            <div className="flex items-start justify-start">
              <div className="bg-white text-gray-800 rounded-lg rounded-bl-none border border-gray-300 px-3 py-2 shadow-md">
                <div className="font-pixel-sm font-bold mb-1">Yuna</div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* 输入区域 */}
        <div className="bg-gray-200 border-t-2 border-gray-300 p-3">
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={activeTab === 'yuna' ? '与Yuna聊天...' : '在Plaza发言...'}
              className="flex-1 px-3 py-2 border-2 border-gray-400 rounded-md font-pixel-md focus:outline-none focus:border-blue-500 bg-white"
              disabled={isLoading || (activeTab === 'chatroom' && !isUsernameSet)}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !inputMessage.trim() || (activeTab === 'chatroom' && !isUsernameSet)}
              className={`px-4 py-2 text-white rounded-md hover:opacity-90 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors border-2 shadow-md ${
                activeTab === 'yuna'
                  ? 'bg-blue-500 border-blue-600 hover:bg-blue-600'
                  : 'bg-blue-500 border-blue-600 hover:bg-blue-600'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VintageChat;