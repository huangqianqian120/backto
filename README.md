# BackTo - 复古苹果OS桌面

一个完美重现经典Mac OS界面的互动网站，带您回到苹果电脑的黄金时代。

## ✨ 特色功能

- 🖥️ **完美复古界面**：精确还原经典Mac OS的视觉设计
- 🎯 **可点击图标**：双击图标打开对应的应用程序窗口
- 🪟 **真实窗口系统**：支持窗口拖拽、最小化、最大化和关闭
- 🎨 **复古视觉效果**：渐变、阴影、半透明等经典设计元素
- 📱 **响应式设计**：在不同设备上都能完美展示

## 🚀 在线体验

访问 [BackTo 复古苹果OS桌面](https://huangqianqian120.github.io/BackTo) 立即体验

## 💬 聊天功能配置

项目现已支持与Yuna的AI聊天功能！要启用聊天功能，请按以下步骤配置：

1. 复制 `.env.example` 文件为 `.env`
2. 在 [Deepseek平台](https://platform.deepseek.com/) 获取API key
3. 在 `.env` 文件中设置：
   ```
   VITE_DEEPSEEK_API_KEY=your_api_key_here
   ```
4. 重启开发服务器
5. 双击桌面上的 "Chats" 图标开始与Yuna聊天！

## 🛠️ 技术栈

- **React 19** - 现代化前端框架
- **Tailwind CSS** - 实用优先的CSS框架
- **Vite** - 快速的构建工具
- **JavaScript** - 核心编程语言

## 📦 本地运行

```bash
# 克隆项目
git clone https://github.com/huangqianqian120/BackTo.git
cd BackTo

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 🎮 使用说明

1. **桌面交互**：点击桌面图标可选中，双击打开应用
2. **窗口操作**：
   - 🔴 红色按钮：关闭窗口
   - 🟡 黄色按钮：最小化窗口
   - 🟢 绿色按钮：最大化窗口
   - 拖拽标题栏：移动窗口位置
3. **应用程序**：包含Terminal、TextEdit、Paint、Minesweeper等经典应用

## 🎯 应用列表

- **Virtual PC** - 虚拟机程序
- **Photo Booth** - 相机应用
- **Macintosh HD** - 硬盘图标
- **Soundboard** - 音频工具
- **Chats** - AI聊天程序（与Yuna对话，需配置Deepseek API）
- **Synth** - 音乐合成器
- **Internet Explorer** - 网页浏览器
- **Terminal** - 命令行终端
- **iPod** - 音乐播放器
- **TextEdit** - 文本编辑器
- **Minesweeper** - 扫雷游戏
- **Videos** - 视频播放器
- **Paint** - 画图程序

## 🎨 设计亮点

- 精确的复古色彩搭配
- 真实的窗口阴影和渐变效果
- 流畅的动画过渡
- 经典的三色窗口控制按钮
- 半透明菜单栏效果

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

**BackTo** - 让我们一起回到那个充满创新与美好的苹果时代 🍎

