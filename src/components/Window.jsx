import React, { useRef, useEffect, useState } from 'react';
import VintageMusicPlayer from './VintageMusicPlayer';
import VintageChat from './VintageChat';
import VintageVideoPlayer from './VintageVideoPlayer';
import InteractiveTerminal from './InteractiveTerminal';
import VirtualMac from './VirtualMac';
import InternetExplorer from './InternetExplorer';
import VintageTextEdit from './VintageTextEdit';
import VintageLibrary from './VintageLibrary';
import useSoundEffect from '../hooks/useSoundEffect';

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
  onFocus, 
  onResize,
  musicUrl,
  videoUrl,
  onTerminalCommand 
}) => {
  const { playCloseSound } = useSoundEffect();
  const windowRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartPos, setResizeStartPos] = useState({ x: 0, y: 0 });
  const [resizeStartSize, setResizeStartSize] = useState({ width: 0, height: 0 });
  const currentPosition = position;
  const currentSize = size;

  useEffect(() => {
    // 空的effect，保持位置和大小固定
  }, []);

  // 处理拖拽开始
  const handleMouseDown = (e) => {
    if (e.target.closest('.window-controls')) {
      return; // 如果点击的是窗口控制按钮，不启动拖拽
    }
    
    setIsDragging(true);
    const rect = windowRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    onFocus(id);
  };

  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeStartPos({ x: e.clientX, y: e.clientY });
    setResizeStartSize({ width: currentSize.width, height: currentSize.height });
    onFocus(id);
  };

  // 处理拖拽移动和调整大小
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragOffset.x;
        const newY = Math.max(24, e.clientY - dragOffset.y); // 确保不会拖拽到菜单栏下方
        
        if (onResize) {
          onResize(id, { x: newX, y: newY }, currentSize);
        }
      } else if (isResizing) {
        const deltaX = e.clientX - resizeStartPos.x;
        const deltaY = e.clientY - resizeStartPos.y;
        
        const newWidth = Math.max(200, resizeStartSize.width + deltaX);
        const newHeight = Math.max(150, resizeStartSize.height + deltaY);
        
        if (onResize) {
          onResize(id, currentPosition, { width: newWidth, height: newHeight });
        }
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, dragOffset, resizeStartPos, resizeStartSize, id, onResize, currentSize, currentPosition]);

  const getWindowContent = () => {
    switch (id) {
      case 'terminal':
        return (
          <InteractiveTerminal onCommand={onTerminalCommand} />
        );
      case 'textedit':
        return (
          <VintageTextEdit onCommand={onTerminalCommand} />
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
      case 'music':
        return (
          <div className="h-full flex items-center justify-center p-4">
            <VintageMusicPlayer />
          </div>
        );
      case 'chats':
        return (
          <div className="h-full">
            <VintageChat />
          </div>
        );
      case 'videos':
        return (
          <div className="h-full">
            <VintageVideoPlayer videoUrl={videoUrl} />
          </div>
        );
      case 'virtual-pc':
        return (
          <div className="h-full">
            <VirtualMac />
          </div>
        );
      case 'internet-explorer':
        return (
          <div className="h-full">
            <InternetExplorer onCommand={onTerminalCommand} />
          </div>
        );
      case 'library':
        return (
          <div className="h-full">
            <VintageLibrary onCommand={onTerminalCommand} />
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
      }`}
      style={{
        left: currentPosition.x,
        top: currentPosition.y,
        width: currentSize.width,
        height: currentSize.height,
        zIndex: zIndex
      }}
      onClick={() => onFocus(id)}
    >
      {/* 调整大小手柄 */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-gray-400 hover:bg-gray-500"
        onMouseDown={handleResizeMouseDown}
        style={{
          background: 'linear-gradient(-45deg, transparent 30%, #666 30%, #666 40%, transparent 40%, transparent 60%, #666 60%, #666 70%, transparent 70%)'
        }}
      />
      {/* 窗口标题栏 */}
      <div
        className="vintage-titlebar flex items-center justify-between px-2 cursor-move"
        onMouseDown={handleMouseDown}
      >
        {/* 窗口控制按钮 */}
        <div className="window-controls flex space-x-1">
          <button
            className="vintage-button close"
            onClick={(e) => {
              e.stopPropagation();
              playCloseSound();
              onClose(id);
            }}
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
        <div className="font-pixel-sm font-medium text-gray-700 flex-1 text-center font-pixel">
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

