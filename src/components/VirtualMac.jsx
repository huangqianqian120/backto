import React, { useState, useEffect } from 'react';

const VirtualMac = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [showAppleMenu, setShowAppleMenu] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showSpecialMenu, setShowSpecialMenu] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dragWindowId, setDragWindowId] = useState(null);

  // 经典Mac桌面图标
  const classicIcons = [
    { id: 'system-folder', name: 'System Folder', icon: '📁', position: { x: 50, y: 50 } },
    { id: 'trash', name: 'Trash', icon: '🗑️', position: { x: 50, y: 150 } },
    { id: 'hard-disk', name: 'Macintosh HD', icon: '💾', position: { x: 50, y: 250 } },
    { id: 'note-pad', name: 'Note Pad', icon: '📝', position: { x: 150, y: 50 } },
    { id: 'calculator', name: 'Calculator', position: { x: 150, y: 150 } },
    { id: 'control-panel', name: 'Control Panel', position: { x: 150, y: 250 } },
  ];

  useEffect(() => {
    // 模拟启动过程
    const bootTimer = setTimeout(() => {
      setIsBooting(false);
    }, 3000);

    return () => clearTimeout(bootTimer);
  }, []);

  // 处理拖拽移动
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging && dragWindowId) {
        const newX = e.clientX - dragOffset.x;
        const newY = Math.max(24, e.clientY - dragOffset.y); // 确保不会拖拽到菜单栏下方
        
        setOpenWindows(prevWindows => 
          prevWindows.map(w => 
            w.id === dragWindowId 
              ? { ...w, position: { x: newX, y: newY } }
              : w
          )
        );
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragWindowId(null);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragWindowId, dragOffset]);

  const handleIconDoubleClick = (iconId) => {
    const newWindow = {
      id: iconId + '-' + Date.now(),
      title: classicIcons.find(icon => icon.id === iconId)?.name || 'Window',
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 100 },
      size: { width: 400, height: 300 },
      zIndex: openWindows.length + 1
    };
    setOpenWindows([...openWindows, newWindow]);
    setActiveWindow(newWindow.id);
  };

  const handleCloseWindow = (windowId) => {
    setOpenWindows(openWindows.filter(w => w.id !== windowId));
    if (activeWindow === windowId) {
      setActiveWindow(null);
    }
  };

  const handleWindowFocus = (windowId) => {
    setActiveWindow(windowId);
    // 将窗口移到最前面
    setOpenWindows(prevWindows => {
      const maxZ = Math.max(...prevWindows.map(w => w.zIndex), 0);
      return prevWindows.map(w => 
        w.id === windowId 
          ? { ...w, zIndex: maxZ + 1 }
          : w
      );
    });
  };

  const handleWindowResize = (windowId, newPosition, newSize) => {
    setOpenWindows(prevWindows => 
      prevWindows.map(w => 
        w.id === windowId 
          ? { ...w, position: newPosition, size: newSize }
          : w
      )
    );
  };

  const handleMouseDown = (e, windowId) => {
    if (e.target.closest('.window-close-btn')) {
      return; // 如果点击的是关闭按钮，不启动拖拽
    }
    
    setIsDragging(true);
    setDragWindowId(windowId);
    const window = openWindows.find(w => w.id === windowId);
    if (window) {
      setDragOffset({
        x: e.clientX - window.position.x,
        y: e.clientY - window.position.y
      });
    }
    handleWindowFocus(windowId);
  };

  const renderClassicIcon = (icon) => {
    return (
      <div
        key={icon.id}
        className="absolute cursor-pointer select-none"
        style={{
          left: icon.position.x,
          top: icon.position.y,
          width: 64,
          height: 80
        }}
        onDoubleClick={() => handleIconDoubleClick(icon.id)}
      >
        <div className="flex flex-col items-center">
          {/* 黑白线稿风格图标 */}
          <div className="w-8 h-8 border-2 border-black bg-white flex items-center justify-center text-xs">
            {icon.icon || '□'}
          </div>
          {/* 图标名称 */}
          <div className="text-xs text-black mt-1 text-center font-mono max-w-16 break-words">
            {icon.name}
          </div>
        </div>
      </div>
    );
  };

  const renderClassicWindow = (window) => {
    const isActive = activeWindow === window.id;
    return (
      <div
        key={window.id}
        className={`absolute bg-gray-200 border-2 ${
          isActive ? 'border-black' : 'border-gray-400'
        }`}
        style={{
          left: window.position.x,
          top: window.position.y,
          width: window.size.width,
          height: window.size.height,
          zIndex: window.zIndex
        }}
        onClick={() => handleWindowFocus(window.id)}
      >
        {/* 经典标题栏 */}
        <div 
          className={`border-b-2 border-black h-6 flex items-center justify-between px-2 cursor-move ${
            isActive ? 'bg-white' : 'bg-gray-100'
          }`}
          onMouseDown={(e) => handleMouseDown(e, window.id)}
        >
          <div className="text-xs font-mono font-bold">{window.title}</div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCloseWindow(window.id);
            }}
            className="window-close-btn w-4 h-4 border border-black bg-white text-xs flex items-center justify-center hover:bg-gray-100"
          >
            ×
          </button>
        </div>
        {/* 窗口内容 */}
        <div className="p-4 bg-white overflow-auto" style={{ height: 'calc(100% - 24px)' }}>
          <div className="text-xs font-mono">
            {window.title} content area
            {/* 添加更多内容以测试滚动 */}
            <div className="mt-4">
              <p>This is a scrollable window content area.</p>
              <p>You can scroll up and down to see more content.</p>
              <p>Line 1 of content</p>
              <p>Line 2 of content</p>
              <p>Line 3 of content</p>
              <p>Line 4 of content</p>
              <p>Line 5 of content</p>
              <p>Line 6 of content</p>
              <p>Line 7 of content</p>
              <p>Line 8 of content</p>
              <p>Line 9 of content</p>
              <p>Line 10 of content</p>
              <p>Line 11 of content</p>
              <p>Line 12 of content</p>
              <p>Line 13 of content</p>
              <p>Line 14 of content</p>
              <p>Line 15 of content</p>
              <p>Line 16 of content</p>
              <p>Line 17 of content</p>
              <p>Line 18 of content</p>
              <p>Line 19 of content</p>
              <p>Line 20 of content</p>
              <p>End of content - you should be able to scroll to see this!</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (isBooting) {
    return (
      <div className="h-full bg-gray-300 flex flex-col items-center justify-center">
        {/* 经典Mac启动画面 */}
        <div className="bg-white border-4 border-black p-8 rounded-lg">
          <div className="text-center">
            <div className="text-6xl mb-4">🍎</div>
            <div className="text-lg font-mono font-bold mb-2">Macintosh</div>
            <div className="text-sm font-mono">System 6.0.8</div>
            <div className="mt-4">
              <div className="w-32 h-2 border border-black bg-white">
                <div className="h-full bg-black animate-pulse" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="text-xs font-mono mt-2">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-300 relative overflow-hidden">
      {/* 经典菜单栏 */}
      <div className="bg-white border-b-2 border-black h-6 flex items-center px-2 relative">
        {/* Apple菜单 */}
        <div className="relative">
          <button
            className="text-xs font-mono px-2 hover:bg-black hover:text-white"
            onClick={() => {
              setShowAppleMenu(!showAppleMenu);
              setShowFileMenu(false);
              setShowSpecialMenu(false);
            }}
          >
            🍎
          </button>
          {showAppleMenu && (
            <div className="absolute top-6 left-0 bg-white border-2 border-black z-50 min-w-32">
              <div className="text-xs font-mono p-1 hover:bg-black hover:text-white cursor-pointer">About This Macintosh...</div>
              <div className="border-t border-black"></div>
              <div className="text-xs font-mono p-1 hover:bg-black hover:text-white cursor-pointer">Control Panel</div>
              <div className="text-xs font-mono p-1 hover:bg-black hover:text-white cursor-pointer">Chooser</div>
            </div>
          )}
        </div>

        {/* File菜单 */}
        <div className="relative">
          <button
            className="text-xs font-mono px-2 hover:bg-black hover:text-white"
            onClick={() => {
              setShowFileMenu(!showFileMenu);
              setShowAppleMenu(false);
              setShowSpecialMenu(false);
            }}
          >
            File
          </button>
          {showFileMenu && (
            <div className="absolute top-6 left-0 bg-white border-2 border-black z-50 min-w-32">
              <div className="text-xs font-mono p-1 hover:bg-black hover:text-white cursor-pointer">New Folder</div>
              <div className="text-xs font-mono p-1 hover:bg-black hover:text-white cursor-pointer">Open</div>
              <div className="text-xs font-mono p-1 hover:bg-black hover:text-white cursor-pointer">Close</div>
              <div className="border-t border-black"></div>
              <div className="text-xs font-mono p-1 hover:bg-black hover:text-white cursor-pointer">Get Info</div>
              <div className="text-xs font-mono p-1 hover:bg-black hover:text-white cursor-pointer">Duplicate</div>
            </div>
          )}
        </div>

        {/* Special菜单 */}
        <div className="relative">
          <button
            className="text-xs font-mono px-2 hover:bg-black hover:text-white"
            onClick={() => {
              setShowSpecialMenu(!showSpecialMenu);
              setShowAppleMenu(false);
              setShowFileMenu(false);
            }}
          >
            Special
          </button>
          {showSpecialMenu && (
            <div className="absolute top-6 left-0 bg-white border-2 border-black z-50 min-w-32">
              <div className="text-xs font-mono p-1 hover:bg-black hover:text-white cursor-pointer">Clean Up Desktop</div>
              <div className="text-xs font-mono p-1 hover:bg-black hover:text-white cursor-pointer">Empty Trash</div>
              <div className="border-t border-black"></div>
              <div className="text-xs font-mono p-1 hover:bg-black hover:text-white cursor-pointer">Eject Disk</div>
              <div className="text-xs font-mono p-1 hover:bg-black hover:text-white cursor-pointer">Restart</div>
              <div className="text-xs font-mono p-1 hover:bg-black hover:text-white cursor-pointer">Shut Down</div>
            </div>
          )}
        </div>

        {/* 时间显示 */}
        <div className="ml-auto text-xs font-mono">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* 桌面区域 */}
      <div 
        className="flex-1 relative"
        onClick={() => {
          setShowAppleMenu(false);
          setShowFileMenu(false);
          setShowSpecialMenu(false);
        }}
      >
        {/* 桌面图标 */}
        {classicIcons.map(renderClassicIcon)}

        {/* 窗口 */}
        {openWindows.map(renderClassicWindow)}
      </div>
    </div>
  );
};

export default VirtualMac;