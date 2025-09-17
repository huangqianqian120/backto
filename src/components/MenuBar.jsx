import React, { useState, useRef, useEffect } from 'react';
import { useIsMobile } from '../hooks/use-mobile';
import titleImage from '../assets/title.png';

const MenuBar = ({ onMenuAction, openWindows = [], activeWindow }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [activeSubmenu, setActiveSubmenu] = useState(null);
  const menuRef = useRef(null);
  const isMobile = useIsMobile();

  const currentTime = new Date().toLocaleString('zh-CN', {
    weekday: 'short',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleMenuClick = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
    setActiveSubmenu(null);
  };

  const handleMenuAction = (action, data = null) => {
    setActiveMenu(null);
    setActiveSubmenu(null);
    if (onMenuAction) {
      onMenuAction(action, data);
    }
  };

  const handleSubmenuHover = (submenuName) => {
    setActiveSubmenu(submenuName);
  };

  // 菜单配置
  const menuConfig = {
    apple: {
      items: [
        { label: 'About This Mac', action: 'about-mac' },
        { label: 'Software Update…', action: 'software-update', disabled: true },
        { type: 'divider' },
        { 
          label: 'Control Panels ▶', 
          submenu: [
            { label: 'Appearance', action: 'control-appearance', disabled: true },
            { label: 'Date & Time', action: 'control-datetime', disabled: true },
            { label: 'Extensions', action: 'control-extensions', disabled: true },
            { label: 'Internet', action: 'control-internet', disabled: true }
          ]
        },
        { type: 'divider' },
        { label: 'Sleep', action: 'sleep', disabled: true },
        { label: 'Restart', action: 'restart' },
        { label: 'Shut Down', action: 'shutdown' },
        { type: 'divider' },
        { label: 'Empty Trash', action: 'empty-trash', disabled: true },
        { 
           label: 'Recent Applications ▶',
           submenu: openWindows.length > 0 ? 
             openWindows.map(window => ({ label: window.title, action: 'focus-window', data: window.id })) :
             [{ label: 'No Recent Applications', disabled: true }]
         },
        { type: 'divider' },
        { label: 'Exit to Finder', action: 'exit-to-finder' }
      ]
    },
    file: {
      items: [
        { label: 'New', action: 'file-new', shortcut: '⌘N' },
        { label: 'Open…', action: 'file-open', shortcut: '⌘O', disabled: true },
        { type: 'divider' },
        { label: 'Close', action: 'file-close', shortcut: '⌘W' },
        { type: 'divider' },
        { label: 'Save', action: 'file-save', shortcut: '⌘S', disabled: true },
        { label: 'Save As…', action: 'file-save-as', shortcut: '⇧⌘S', disabled: true },
        { type: 'divider' },
        { label: 'Page Setup…', action: 'file-page-setup', disabled: true },
        { label: 'Print…', action: 'file-print', shortcut: '⌘P', disabled: true }
      ]
    },
    edit: {
      items: [
        { label: 'Undo', action: 'edit-undo', shortcut: '⌘Z', disabled: true },
        { type: 'divider' },
        { label: 'Cut', action: 'edit-cut', shortcut: '⌘X', disabled: true },
        { label: 'Copy', action: 'edit-copy', shortcut: '⌘C', disabled: true },
        { label: 'Paste', action: 'edit-paste', shortcut: '⌘V', disabled: true },
        { label: 'Clear', action: 'edit-clear', disabled: true },
        { type: 'divider' },
        { label: 'Select All', action: 'edit-select-all', shortcut: '⌘A', disabled: true },
        { type: 'divider' },
        { label: 'Find…', action: 'edit-find', shortcut: '⌘F', disabled: true },
        { label: 'Spelling…', action: 'edit-spelling', disabled: true }
      ]
    },
    view: {
      items: [
        { label: 'As Icons', action: 'view-icons', shortcut: '⌘1', disabled: true },
        { label: 'As List', action: 'view-list', shortcut: '⌘2', disabled: true },
        { type: 'divider' },
        { label: 'By Date', action: 'view-sort-date', disabled: true },
        { label: 'By Name', action: 'view-sort-name', disabled: true },
        { label: 'By Size', action: 'view-sort-size', disabled: true },
        { type: 'divider' },
        { label: 'Hide Toolbar', action: 'view-hide-toolbar', disabled: true },
        { label: 'Show Fonts', action: 'view-show-fonts', disabled: true },
        { type: 'divider' },
        { label: 'Switch to Dark Mode', action: 'view-dark-mode', disabled: true }
      ]
    },
    go: {
      items: [
        { label: 'Back', action: 'go-back', shortcut: '⌘[', disabled: true },
        { type: 'divider' },
        { label: 'Home', action: 'go-home', shortcut: '⇧⌘H' },
        { label: 'Documents', action: 'go-documents', disabled: true },
        { label: 'Applications', action: 'go-applications', disabled: true },
        { 
          label: 'Desktop Icons ▶',
          submenu: [
            { label: 'Virtual PC', action: 'open-desktop-icon', data: 'virtual-pc' },
            { label: 'Music', action: 'open-desktop-icon', data: 'music' },
            { label: 'Chats', action: 'open-desktop-icon', data: 'chats' },
            { label: 'Internet Explorer', action: 'open-desktop-icon', data: 'internet-explorer' },
            { label: 'Terminal', action: 'open-desktop-icon', data: 'terminal' },
            { label: 'TextEdit', action: 'open-desktop-icon', data: 'textedit' },
            { label: 'Videos', action: 'open-desktop-icon', data: 'videos' },
            { label: 'Library', action: 'open-desktop-icon', data: 'library' }
          ]
        },
        { label: 'Control Panels', action: 'go-control-panels' },
        { type: 'divider' },
        { 
          label: 'Recent Folders ▶',
          submenu: [
            { label: 'System Folder', action: 'go-recent-system', disabled: true },
            { label: 'Extensions', action: 'go-recent-extensions', disabled: true },
            { label: 'Preferences', action: 'go-recent-preferences', disabled: true },
            { label: 'Desktop', action: 'go-recent-desktop', disabled: true }
          ]
        }
      ]
    },
    help: {
      items: [
        { label: 'Mac OS Help', action: 'help-macos', disabled: true },
        { label: 'Internet Setup Assistance', action: 'help-internet', disabled: true },
        { type: 'divider' },
        { label: 'About This Application', action: 'help-about-app' },
        { type: 'divider' },
        { label: 'Report a Bug', action: 'help-report-bug', disabled: true }
      ]
    }
  };

  const renderMenuItem = (item, isSubmenu = false) => {
    if (item.type === 'divider') {
      return <div key={Math.random()} className="menu-divider" />;
    }

    return (
      <div
        key={item.label}
        className={`menu-dropdown-item ${
          item.disabled ? 'disabled' : ''
        } ${item.submenu ? 'has-submenu' : ''}`}
        onClick={() => !item.disabled && !item.submenu && handleMenuAction(item.action, item.data)}
        onMouseEnter={() => item.submenu && handleSubmenuHover(item.label)}
      >
        <span>{item.label}</span>
        {item.shortcut && <span className="menu-shortcut">{item.shortcut}</span>}
        {item.submenu && activeSubmenu === item.label && (
          <div className="submenu-dropdown">
            {item.submenu.map(subItem => renderMenuItem(subItem, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div ref={menuRef} className={`fixed top-0 left-0 right-0 menu-bar flex items-center justify-between z-50 text-gray-800 font-pixel font-pixel-md ${
      isMobile ? 'px-2 py-1' : 'px-4 py-2'
    }`}>
      {/* 左侧菜单 */}
      <div className={`flex items-center ${isMobile ? 'space-x-0.5' : 'space-x-1'}`}>
        {/* Apple Logo */}
        <div className="menu-item cursor-pointer p-1 relative" onClick={() => handleMenuClick('apple')}>
          <img src={titleImage} alt="Apple" className={`${isMobile ? 'h-4' : 'h-5'} w-auto`} />
          {activeMenu === 'apple' && (
            <div className="menu-dropdown">
              {menuConfig.apple.items.map(item => renderMenuItem(item))}
            </div>
          )}
        </div>
        
        {/* 移动端只显示部分菜单 */}
        {!isMobile ? (
          <>
            {/* File Menu */}
            <div className="menu-item cursor-pointer px-3 py-2 relative" onClick={() => handleMenuClick('file')}>
              File
              {activeMenu === 'file' && (
                <div className="menu-dropdown">
                  {menuConfig.file.items.map(item => renderMenuItem(item))}
                </div>
              )}
            </div>
            
            {/* Edit Menu */}
            <div className="menu-item cursor-pointer px-3 py-2 relative" onClick={() => handleMenuClick('edit')}>
              Edit
              {activeMenu === 'edit' && (
                <div className="menu-dropdown">
                  {menuConfig.edit.items.map(item => renderMenuItem(item))}
                </div>
              )}
            </div>
            
            {/* View Menu */}
            <div className="menu-item cursor-pointer px-3 py-2 relative" onClick={() => handleMenuClick('view')}>
              View
              {activeMenu === 'view' && (
                <div className="menu-dropdown">
                  {menuConfig.view.items.map(item => renderMenuItem(item))}
                </div>
              )}
            </div>
          </>
        ) : (
          /* 移动端显示简化菜单 */
          <div className="menu-item cursor-pointer px-2 py-1 relative text-sm" onClick={() => handleMenuClick('go')}>
            Apps
            {activeMenu === 'go' && (
              <div className="menu-dropdown">
                {menuConfig.go.items.map(item => renderMenuItem(item))}
              </div>
            )}
          </div>
        )}
        
        {/* Go Menu - 桌面端 */}
        {!isMobile && (
          <div className="menu-item cursor-pointer px-3 py-2 relative" onClick={() => handleMenuClick('go')}>
            Go
            {activeMenu === 'go' && (
              <div className="menu-dropdown">
                {menuConfig.go.items.map(item => renderMenuItem(item))}
              </div>
            )}
          </div>
        )}
        
        {/* Help Menu - 桌面端 */}
        {!isMobile && (
          <div className="menu-item cursor-pointer px-3 py-2 relative" onClick={() => handleMenuClick('help')}>
            Help
            {activeMenu === 'help' && (
              <div className="menu-dropdown">
                {menuConfig.help.items.map(item => renderMenuItem(item))}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* 右侧状态栏 */}
      <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
        <div className={`text-gray-800 ${isMobile ? 'text-sm' : ''}`}>🔊</div>
        <div className={`text-gray-800 ${isMobile ? 'text-xs' : ''}`}>{currentTime}</div>
      </div>
    </div>
  );
};

export default MenuBar;

