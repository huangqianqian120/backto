import React, { useState } from 'react';
import MenuBar from './MenuBar';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import desktopBg from '../assets/desktop-background.png';

const Desktop = () => {
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);

  // 桌面图标数据
  const desktopIcons = [
    { id: 'virtual-pc', name: 'Virtual PC', icon: '🖥️', position: { x: 1200, y: 60 } },
    { id: 'photo-booth', name: 'Photo Booth', icon: '📷', position: { x: 1300, y: 60 } },
    { id: 'macintosh-hd', name: 'Macintosh HD', icon: '💾', position: { x: 1400, y: 60 } },
    { id: 'soundboard', name: 'Soundboard', icon: '🎵', position: { x: 1200, y: 160 } },
    { id: 'chats', name: 'Chats', icon: '💬', position: { x: 1300, y: 160 } },
    { id: 'synth', name: 'Synth', icon: '🎹', position: { x: 1200, y: 260 } },
    { id: 'internet-explorer', name: 'Internet Explorer', icon: '🌐', position: { x: 1300, y: 260 } },
    { id: 'terminal', name: 'Terminal', icon: '⚫', position: { x: 1200, y: 360 } },
    { id: 'ipod', name: 'iPod', icon: '🎧', position: { x: 1300, y: 360 } },
    { id: 'textedit', name: 'TextEdit', icon: '📝', position: { x: 1200, y: 460 } },
    { id: 'minesweeper', name: 'Minesweeper', icon: '💣', position: { x: 1300, y: 460 } },
    { id: 'videos', name: 'Videos', icon: '📀', position: { x: 1200, y: 560 } },
    { id: 'paint', name: 'Paint', icon: '🎨', position: { x: 1300, y: 560 } },
  ];

  const handleIconDoubleClick = (iconId) => {
    // 检查窗口是否已经打开
    if (!openWindows.find(window => window.id === iconId)) {
      const icon = desktopIcons.find(icon => icon.id === iconId);
      const newWindow = {
        id: iconId,
        title: icon.name,
        position: { x: 200 + openWindows.length * 30, y: 100 + openWindows.length * 30 },
        size: { width: 600, height: 400 },
        isMinimized: false,
        zIndex: openWindows.length + 1
      };
      setOpenWindows([...openWindows, newWindow]);
      setActiveWindow(iconId);
    } else {
      // 如果窗口已经打开，将其置于顶层
      setActiveWindow(iconId);
    }
  };

  const handleCloseWindow = (windowId) => {
    setOpenWindows(openWindows.filter(window => window.id !== windowId));
    if (activeWindow === windowId) {
      setActiveWindow(null);
    }
  };

  const handleMinimizeWindow = (windowId) => {
    setOpenWindows(openWindows.map(window => 
      window.id === windowId ? { ...window, isMinimized: true } : window
    ));
  };

  const handleMaximizeWindow = (windowId) => {
    setOpenWindows(openWindows.map(window => 
      window.id === windowId ? { 
        ...window, 
        position: { x: 0, y: 24 },
        size: { width: window.size.width === window.innerWidth ? 600 : window.innerWidth, 
                height: window.size.height === window.innerHeight - 24 ? 400 : window.innerHeight - 24 }
      } : window
    ));
  };

  const handleWindowFocus = (windowId) => {
    setActiveWindow(windowId);
    // 更新z-index
    setOpenWindows(openWindows.map(window => 
      window.id === windowId ? { ...window, zIndex: Math.max(...openWindows.map(w => w.zIndex)) + 1 } : window
    ));
  };

  return (
    <div 
      className="h-screen w-screen overflow-hidden relative"
      style={{
        backgroundImage: `url(${desktopBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* 菜单栏 */}
      <MenuBar />
      
      {/* 桌面图标 */}
      {desktopIcons.map(icon => (
        <DesktopIcon
          key={icon.id}
          id={icon.id}
          name={icon.name}
          icon={icon.icon}
          position={icon.position}
          onDoubleClick={handleIconDoubleClick}
        />
      ))}
      
      {/* 窗口 */}
      {openWindows.map(window => (
        !window.isMinimized && (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            position={window.position}
            size={window.size}
            zIndex={window.zIndex}
            isActive={activeWindow === window.id}
            onClose={handleCloseWindow}
            onMinimize={handleMinimizeWindow}
            onMaximize={handleMaximizeWindow}
            onFocus={handleWindowFocus}
          />
        )
      ))}
    </div>
  );
};

export default Desktop;

