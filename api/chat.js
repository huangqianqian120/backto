// Vercel Serverless Function for Chat API
// Note: WebSocket is not supported in Vercel serverless functions
// This is a simplified REST API version for basic chat functionality

import cors from 'cors';

// Global storage that persists across function invocations
// Using a simple approach with timestamps for user management
global.chatData = global.chatData || {
  messages: [],
  users: new Map(), // username -> { joinTime, lastSeen }
  userCleanupInterval: null
};

// Clean up inactive users (older than 30 seconds)
function cleanupInactiveUsers() {
  const now = Date.now();
  const timeout = 30000; // 30 seconds
  
  for (const [username, userData] of global.chatData.users.entries()) {
    if (now - userData.lastSeen > timeout) {
      global.chatData.users.delete(username);
      
      // Add leave message
      const leaveMessage = {
        id: Date.now() + Math.random(),
        sender: '系统',
        content: `${username} 离开了聊天室`,
        timestamp: new Date().toLocaleTimeString(),
        isSystem: true
      };
      global.chatData.messages.push(leaveMessage);
    }
  }
  
  // Keep only last 100 messages to prevent memory bloat
  if (global.chatData.messages.length > 100) {
    global.chatData.messages = global.chatData.messages.slice(-100);
  }
}

// Start cleanup interval if not already running
if (!global.chatData.userCleanupInterval) {
  global.chatData.userCleanupInterval = setInterval(cleanupInactiveUsers, 10000); // Every 10 seconds
}

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export default async function handler(req, res) {
  // Handle CORS
  await new Promise((resolve, reject) => {
    cors(corsOptions)(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    switch (req.method) {
      case 'GET':
        // Clean up inactive users before returning data
        cleanupInactiveUsers();
        
        // Get recent messages
        return res.status(200).json({
          success: true,
          messages: global.chatData.messages.slice(-50), // Return last 50 messages
          users: Array.from(global.chatData.users.keys())
        });

      case 'POST':
        const { type, username, message } = req.body;

        if (type === 'join') {
          // Clean up inactive users first
          cleanupInactiveUsers();
          
          if (global.chatData.users.has(username)) {
            // Update existing user's last seen time
            global.chatData.users.set(username, {
              joinTime: global.chatData.users.get(username).joinTime,
              lastSeen: Date.now()
            });
          } else {
            // Add new user
            const now = Date.now();
            global.chatData.users.set(username, {
              joinTime: now,
              lastSeen: now
            });
            
            const joinMessage = {
              id: Date.now() + Math.random(),
              sender: '系统',
              content: `${username} 加入了聊天室`,
              timestamp: new Date().toLocaleTimeString(),
              isSystem: true
            };
            global.chatData.messages.push(joinMessage);
          }

          return res.status(200).json({
            success: true,
            message: 'Successfully joined',
            username: username
          });
        }

        if (type === 'message') {
          // Clean up inactive users and check if user exists
          cleanupInactiveUsers();
          
          if (!global.chatData.users.has(username)) {
            return res.status(400).json({
              success: false,
              error: '请先加入聊天室'
            });
          }

          // Update user's last seen time
          const userData = global.chatData.users.get(username);
          global.chatData.users.set(username, {
            ...userData,
            lastSeen: Date.now()
          });

          const chatMessage = {
            id: Date.now() + Math.random(),
            sender: username,
            content: message,
            timestamp: new Date().toLocaleTimeString(),
            isUser: false
          };
          global.chatData.messages.push(chatMessage);

          return res.status(200).json({
            success: true,
            message: 'Message sent',
            messageId: chatMessage.id
          });
        }

        if (type === 'leave') {
          global.chatData.users.delete(username);
          const leaveMessage = {
            id: Date.now() + Math.random(),
            sender: '系统',
            content: `${username} 离开了聊天室`,
            timestamp: new Date().toLocaleTimeString(),
            isSystem: true
          };
          global.chatData.messages.push(leaveMessage);

          return res.status(200).json({
            success: true,
            message: 'Successfully left'
          });
        }

        return res.status(400).json({
          success: false,
          error: 'Invalid request type'
        });

      default:
        return res.status(405).json({
          success: false,
          error: 'Method not allowed'
        });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}