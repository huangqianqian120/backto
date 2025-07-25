import React, { useState, useRef, useEffect } from 'react';

const Window = ({ 
  id, 
  title, 
  position, 
  size, 
  zIndex, 
  isActive, 
  onClose, 
  onMinimize, 
  onMaximize, 
  onFocus 
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState(position);
  const windowRef = useRef(null);

  useEffect(() => {
    setCurrentPosition(position);
  }, [position]);

  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) return;
    
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y
    });
    onFocus(id);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newX = Math.max(0, Math.min(window.innerWidth - size.width, e.clientX - dragOffset.x));
    const newY = Math.max(24, Math.min(window.innerHeight - size.height, e.clientY - dragOffset.y));
    
    setCurrentPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  const getWindowContent = () => {
    switch (id) {
      case 'terminal':
        return (
          <div className="h-full bg-black text-green-400 font-mono p-4 text-sm">
            <div className="mb-2">Last login: {new Date().toLocaleString()}</div>
            <div className="mb-2">type "help" to see available commands</div>
            <div className="flex">
              <span>~ $ </span>
              <div className="w-2 h-4 bg-green-400 ml-1 animate-pulse"></div>
            </div>
          </div>
        );
      case 'textedit':
        return (
          <div className="h-full bg-white p-4">
            <div className="h-full border border-gray-300 p-2 text-sm">
              <div>欢迎使用 TextEdit</div>
              <div className="mt-2">这是一个简单的文本编辑器...</div>
            </div>
          </div>
        );
      case 'photo-booth':
        return (
          <div className="h-full bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <div className="text-6xl mb-4">📷</div>
              <div>Photo Booth</div>
              <div className="text-sm mt-2">相机未连接</div>
            </div>
          </div>
        );
      case 'paint':
        return (
          <div className="h-full bg-gray-100">
            <div className="h-8 bg-gray-200 border-b flex items-center px-2 text-xs">
              <div className="mr-4">文件</div>
              <div className="mr-4">编辑</div>
              <div className="mr-4">视图</div>
            </div>
            <div className="h-full bg-white m-2 border border-gray-300 flex items-center justify-center">
              <div className="text-gray-500">空白画布</div>
            </div>
          </div>
        );
      case 'minesweeper':
        return (
          <div className="h-full bg-gray-200 p-4">
            <div className="text-center mb-4">
              <div className="text-2xl">💣 扫雷游戏</div>
              <div className="text-sm mt-2">点击开始新游戏</div>
            </div>
            <div className="grid grid-cols-8 gap-1 max-w-xs mx-auto">
              {Array.from({ length: 64 }, (_, i) => (
                <div key={i} className="w-6 h-6 bg-gray-300 border border-gray-400 hover:bg-gray-200 cursor-pointer"></div>
              ))}
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full bg-white flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-4">📱</div>
              <div className="text-lg font-medium">{title}</div>
              <div className="text-sm text-gray-500 mt-2">应用程序内容</div>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      ref={windowRef}
      className={`absolute vintage-window overflow-hidden ${
        isActive ? 'ring-2 ring-blue-400' : ''
      } ${isDragging ? 'window-dragging' : ''}`}
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        width: size.width,
        height: size.height,
        zIndex: zIndex
      }}
      onClick={() => onFocus(id)}
    >
      {/* 窗口标题栏 */}
      <div
        className="vintage-titlebar flex items-center justify-between px-2 cursor-move"
        onMouseDown={handleMouseDown}
      >
        {/* 窗口控制按钮 */}
        <div className="window-controls flex space-x-1">
          <button
            className="vintage-button close"
            onClick={() => onClose(id)}
            title="关闭"
          >
          </button>
          <button
            className="vintage-button minimize"
            onClick={() => onMinimize(id)}
            title="最小化"
          >
          </button>
          <button
            className="vintage-button maximize"
            onClick={() => onMaximize(id)}
            title="最大化"
          >
          </button>
        </div>
        
        {/* 窗口标题 */}
        <div className="text-xs font-medium text-gray-700 flex-1 text-center">
          {title}
        </div>
        
        <div className="w-12"></div> {/* 占位符保持标题居中 */}
      </div>
      
      {/* 窗口内容 */}
      <div className="h-full" style={{ height: 'calc(100% - 24px)' }}>
        {getWindowContent()}
      </div>
    </div>
  );
};

export default Window;

