# 部署指南

## 项目部署配置

这个复古macOS项目已经配置好了Vercel部署。项目包含：
- React + Vite 前端
- Express serverless API 后端

## 部署步骤

### 1. 安装 Vercel CLI（如果还没有安装）
```bash
npm install -g vercel
```

### 2. 登录 Vercel
```bash
vercel login
```

### 3. 部署到生产环境
```bash
npm run deploy
```

### 4. 部署预览版本
```bash
npm run deploy:preview
```

## 配置文件说明

### vercel.json
- 配置了Vite构建
- 设置了API路由重写
- 配置了serverless函数运行时

### API 端点
- `/api/chat` - 聊天功能API（REST版本，替代了原来的WebSocket）

## 注意事项

1. **WebSocket限制**: Vercel serverless函数不支持WebSocket，所以聊天功能已改为REST API实现
2. **状态管理**: serverless函数是无状态的，聊天消息和用户列表会在函数重启时重置
3. **生产环境**: 建议使用数据库（如Supabase、PlanetScale等）来持久化聊天数据

## 本地测试

```bash
# 构建项目
npm run build

# 预览构建结果
npm run preview
```

## 环境变量

如果需要配置环境变量，在Vercel项目设置中添加，或创建`.env.local`文件（不要提交到git）。

## 故障排除

1. 如果部署失败，检查构建日志
2. 确保所有依赖都在`dependencies`中，而不是`devDependencies`
3. API路由问题可以通过Vercel函数日志查看