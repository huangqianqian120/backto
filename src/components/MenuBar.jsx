import React from 'react';

const MenuBar = () => {
  const currentTime = new Date().toLocaleString('zh-CN', {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="fixed top-0 left-0 right-0 h-6 menu-bar flex items-center justify-between px-4 z-50 text-white text-sm">
      {/* 左侧菜单 */}
      <div className="flex items-center space-x-4">
        <div className="text-white">🍎</div>
        <div className="menu-item px-2 py-1 rounded cursor-pointer">File</div>
        <div className="menu-item px-2 py-1 rounded cursor-pointer">Edit</div>
        <div className="menu-item px-2 py-1 rounded cursor-pointer">View</div>
        <div className="menu-item px-2 py-1 rounded cursor-pointer">Go</div>
        <div className="menu-item px-2 py-1 rounded cursor-pointer">Help</div>
      </div>
      
      {/* 右侧状态栏 */}
      <div className="flex items-center space-x-4">
        <div className="text-white">🔊</div>
        <div className="text-white">{currentTime}</div>
      </div>
    </div>
  );
};

export default MenuBar;

