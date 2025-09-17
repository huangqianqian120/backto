import React, { useState, useRef, useEffect } from 'react';
import MenuBar from './MenuBar';
import DesktopIcon from './DesktopIcon';
import Window from './Window';
import FireworksEffect from './FireworksEffect';
import { useIsMobile } from '../hooks/use-mobile';
import useSoundEffect from '../hooks/useSoundEffect';
import bgImage from '../assets/111.jpg';

const Desktop = () => {
  const [openWindows, setOpenWindows] = useState([]);
  const [activeWindow, setActiveWindow] = useState(null);
  const [showFireworks, setShowFireworks] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const isMobile = useIsMobile();
  const { playDoubleClickSound, playCloseSound } = useSoundEffect();

  // 监听窗口尺寸变化
  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 桌面图标数据 - 响应式位置
  const getDesktopIcons = () => {
    if (isMobile) {
      // 移动端：图标排列在右侧，垂直排列
      const iconSize = windowDimensions.width < 480 ? 60 : 80;
      const startX = windowDimensions.width - iconSize - 20;
      const startY = 80;
      const spacing = iconSize + 20;
      
      return [
        { id: 'virtual-pc', name: 'Virtual PC', icon: '🖥️', position: { x: startX, y: startY } },
        { id: 'music', name: 'Music', icon: '🎵', position: { x: startX, y: startY + spacing } },
        { id: 'chats', name: 'Chats', icon: '💬', position: { x: startX, y: startY + spacing * 2 } },
        { id: 'internet-explorer', name: 'Internet Explorer', icon: '🌐', position: { x: startX, y: startY + spacing * 3 } },
        { id: 'terminal', name: 'Terminal', icon: '⚫', position: { x: startX, y: startY + spacing * 4 } },
        { id: 'textedit', name: 'TextEdit', icon: '📝', position: { x: startX, y: startY + spacing * 5 } },
        { id: 'videos', name: 'Videos', icon: '📀', position: { x: startX, y: startY + spacing * 6 } },
        { id: 'library', name: 'Library', icon: '📚', position: { x: startX, y: startY + spacing * 7 } },
      ];
    } else {
      // 桌面端：原有布局
      return [
        { id: 'virtual-pc', name: 'Virtual PC', icon: '🖥️', position: { x: 1150, y: 60 } },
        { id: 'music', name: 'Music', icon: '🎵', position: { x: 1280, y: 60 } },
        { id: 'chats', name: 'Chats', icon: '💬', position: { x: 1150, y: 180 } },
        { id: 'internet-explorer', name: 'Internet Explorer', icon: '🌐', position: { x: 1280, y: 180 } },
        { id: 'terminal', name: 'Terminal', icon: '⚫', position: { x: 1150, y: 300 } },
        { id: 'textedit', name: 'TextEdit', icon: '📝', position: { x: 1280, y: 300 } },
        { id: 'videos', name: 'Videos', icon: '📀', position: { x: 1150, y: 420 } },
        { id: 'library', name: 'Library', icon: '📚', position: { x: 1280, y: 420 } },
      ];
    }
  };
  
  const desktopIcons = getDesktopIcons();

  const handleIconDoubleClick = (iconId) => {
    // 检查窗口是否已经打开
    if (!openWindows.find(window => window.id === iconId)) {
      const icon = desktopIcons.find(icon => icon.id === iconId);
      // 确保新窗口的zIndex总是最大的
      const newZIndex = openWindows.length > 0 ? Math.max(...openWindows.map(w => w.zIndex)) + 1 : 1;
      
      // 移动端窗口大小和位置优化
      let windowSize, windowPosition;
      if (isMobile) {
        // 移动端：窗口占据大部分屏幕
        const margin = 20;
        windowSize = {
          width: windowDimensions.width - margin * 2,
          height: windowDimensions.height - 100 // 为菜单栏和底部留空间
        };
        windowPosition = {
          x: margin,
          y: 50 + openWindows.length * 10 // 稍微错开位置
        };
      } else {
        // 桌面端：原有逻辑
        windowSize = iconId === 'videos' ? { width: 800, height: 600 } : { width: 600, height: 400 };
        windowPosition = { x: 200 + openWindows.length * 30, y: 100 + openWindows.length * 30 };
      }
      
      const newWindow = {
        id: iconId,
        title: iconId === 'library' ? 'Library - System Folder' : icon.name,
        position: windowPosition,
        size: windowSize,
        isMinimized: false,
        zIndex: newZIndex,
        musicUrl: iconId === 'music' ? 'https://archive.org/details/reiko-sunset-road' : undefined,
        videoUrl: iconId === 'videos' ? 'https://www.youtube.com/watch?v=Unr_oOjXKq8&list=RDUnr_oOjXKq8&start_radio=1' : undefined
      };
      setOpenWindows([...openWindows, newWindow]);
      setActiveWindow(iconId);
      // 播放应用打开音效
      playDoubleClickSound();
    } else {
      // 如果窗口已经打开，将其置于顶层
      handleWindowFocus(iconId);
    }
  };

  const handleCloseWindow = (windowId) => {
    setOpenWindows(openWindows.filter(window => window.id !== windowId));
    if (activeWindow === windowId) {
      setActiveWindow(null);
    }
    // 如果关闭的是Terminal窗口，停止烟花效果
    if (windowId === 'terminal') {
      setShowFireworks(false);
    }
    // 播放窗口关闭音效
    playCloseSound();
  };

  const handleMinimizeWindow = (windowId) => {
    setOpenWindows(openWindows.map(window => 
      window.id === windowId ? { ...window, isMinimized: true } : window
    ));
  };

  const handleMaximizeWindow = (windowId) => {
    setOpenWindows(openWindows.map(window => {
      if (window.id === windowId) {
        const isMaximized = window.position.x === 0 && window.position.y === 24 && 
                           window.size.width === windowDimensions.width && 
                           window.size.height === windowDimensions.height - 24;
        
        if (isMaximized) {
          // 恢复原始大小
          return {
            ...window,
            position: window.originalPosition || { x: 200, y: 100 },
            size: window.originalSize || { width: 600, height: 400 }
          };
        } else {
          // 最大化
          return {
            ...window,
            originalPosition: window.position,
            originalSize: window.size,
            position: { x: 0, y: 24 },
            size: { width: windowDimensions.width, height: windowDimensions.height - 24 }
          };
        }
      }
      return window;
    }));
  };

  const handleWindowFocus = (windowId) => {
    setActiveWindow(windowId);
    // 更新z-index
    setOpenWindows(openWindows.map(window => 
      window.id === windowId ? { ...window, zIndex: Math.max(...openWindows.map(w => w.zIndex)) + 1 } : window
    ));
  };

  const handleResizeWindow = (windowId, newPosition, newSize) => {
    setOpenWindows(openWindows.map(window =>
      window.id === windowId ? { ...window, position: newPosition, size: newSize } : window
    ));
  };

  const handleTerminalCommand = (command) => {
    switch (command) {
      case 'aloha':
        setShowFireworks(true);
        break;
      case 'open internet-explorer://easteregg':
        // 打开Internet Explorer窗口并跳转到彩蛋页面
        const ieWindow = openWindows.find(window => window.id === 'internet-explorer');
        if (!ieWindow) {
          // 如果IE窗口未打开，先打开它
          handleIconDoubleClick('internet-explorer');
        }
        // 通过全局事件通知IE组件跳转到彩蛋页面
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('ieNavigate', { detail: { page: 'easteregg' } }));
        }, 100);
        break;
      case 'open textedit://poem':
        // 打开TextEdit窗口并加载诗歌
        const textEditWindow = openWindows.find(window => window.id === 'textedit');
        if (!textEditWindow) {
          // 如果TextEdit窗口未打开，先打开它
          handleIconDoubleClick('textedit');
        }
        // 通过全局事件通知TextEdit组件加载诗歌
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('textEditNavigate', { detail: { command: 'textedit://poem' } }));
        }, 100);
        break;
      case 'open library://secrets':
        // 打开Library窗口并显示隐藏档案
        const libraryWindow = openWindows.find(window => window.id === 'library');
        if (!libraryWindow) {
          // 如果Library窗口未打开，先打开它
          handleIconDoubleClick('library');
        }
        // 通过全局事件通知Library组件显示隐藏档案
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('libraryNavigate', { detail: { command: 'library://secrets' } }));
        }, 100);
        break;
      default:
        break;
    }
  };

  // 菜单操作处理函数
  const handleMenuAction = (action, data) => {
    switch (action) {
      // Apple Menu Actions
      case 'about-mac':
        alert('About This Mac\n\nMac OS 8.6\nMemory: 128 MB\nProcessor: PowerPC G3\n\nThis is a vintage Mac OS simulation.');
        break;
      case 'software-update':
        alert('Software Update\n\nChecking for updates...\nNo updates available.');
        break;
      case 'control-appearance':
      case 'control-datetime':
      case 'control-extensions':
      case 'control-internet':
        alert(`Control Panel: ${action.replace('control-', '').replace('-', ' & ').toUpperCase()}\n\nThis control panel is not available in this simulation.`);
        break;
      case 'sleep':
        alert('Sleep\n\nThe computer will now go to sleep.');
        break;
      case 'restart':
        if (confirm('Are you sure you want to restart the computer?')) {
          window.location.reload();
        }
        break;
      case 'shutdown':
        if (confirm('Are you sure you want to shut down the computer?')) {
          document.body.style.background = 'black';
          document.body.innerHTML = '<div style="color: white; text-align: center; padding-top: 50vh; font-family: VT323, monospace; font-size: 24px;">It is now safe to turn off your computer.</div>';
        }
        break;
      case 'empty-trash':
        alert('Empty Trash\n\nThe Trash is empty.');
        break;
      case 'focus-window':
        if (data) {
          setActiveWindow(data);
          // 将窗口置于最前
          setOpenWindows(prev => prev.map(window => 
            window.id === data 
              ? { ...window, zIndex: Math.max(...prev.map(w => w.zIndex)) + 1 }
              : window
          ));
        }
        break;
      case 'exit-to-finder':
        // 关闭所有窗口
        setOpenWindows([]);
        setActiveWindow(null);
        break;

      // File Menu Actions
      case 'file-new':
        handleIconDoubleClick('textedit');
        break;
      case 'file-open':
        alert('Open File\n\nFile dialog is not available in this simulation.');
        break;
      case 'file-close':
        if (activeWindow) {
          handleCloseWindow(activeWindow);
        }
        break;
      case 'file-save':
        alert('Save\n\nError: Disk full. Cannot save file.\nPlease insert a new floppy disk.');
        break;
      case 'file-save-as':
        alert('Save As\n\nSave dialog is not available in this simulation.');
        break;
      case 'file-page-setup':
        alert('Page Setup\n\nPage setup options are not available in this simulation.');
        break;
      case 'file-print':
        alert('Print\n\nError: No printer connected.\nPlease check your printer connection.');
        break;

      // Edit Menu Actions
      case 'edit-undo':
      case 'edit-cut':
      case 'edit-copy':
      case 'edit-paste':
      case 'edit-clear':
      case 'edit-select-all':
        alert(`${action.replace('edit-', '').replace('-', ' ').toUpperCase()}\n\nThis function is not available in this simulation.`);
        break;
      case 'edit-find':
        alert('Find\n\nSearch function is not supported.\nFull-text search is not available.');
        break;
      case 'edit-spelling':
        alert('Spelling\n\nSpelling checker is not available.');
        break;

      // View Menu Actions
      case 'view-icons':
      case 'view-list':
        alert(`View ${action.replace('view-', '').replace('-', ' ').toUpperCase()}\n\nView mode changed (decorative effect only).`);
        break;
      case 'view-sort-date':
      case 'view-sort-name':
      case 'view-sort-size':
        alert(`Sort by ${action.replace('view-sort-', '').toUpperCase()}\n\nItems sorted (decorative effect only).`);
        break;
      case 'view-hide-toolbar':
        alert('Hide Toolbar\n\nToolbar visibility toggled.');
        break;
      case 'view-show-fonts':
        alert('Show Fonts\n\nFont preview window would open here.');
        break;
      case 'view-dark-mode':
        alert('Dark Mode\n\nDark mode is not available in Mac OS 8.');
        break;

      // Go Menu Actions
      case 'go-back':
        alert('Back\n\nNo previous location to navigate to.');
        break;
      case 'go-home':
        // 关闭所有窗口，回到桌面
        setOpenWindows([]);
        setActiveWindow(null);
        break;
      case 'go-documents':
        alert('Documents\n\nDocuments folder opened (simulation).');
        break;
      case 'go-applications':
        alert('Applications\n\nApplications folder opened (simulation).');
        break;
      case 'go-control-panels':
        handleIconDoubleClick('library');
        break;
      case 'go-recent-system':
      case 'go-recent-extensions':
      case 'go-recent-preferences':
      case 'go-recent-desktop':
        alert(`Recent: ${action.replace('go-recent-', '').replace('-', ' ').toUpperCase()}\n\nNavigating to recent folder (simulation).`);
        break;

      // Help Menu Actions
      case 'help-macos':
        alert('Mac OS Help\n\nLoading Apple Guide...\n\nHelp system is not available in this simulation.');
        break;
      case 'help-internet':
        alert('Internet Setup Assistance\n\nDialup connection failed.\nPlease check your modem connection.');
        break;
      case 'help-about-app':
        if (activeWindow) {
          const window = openWindows.find(w => w.id === activeWindow);
          alert(`About ${window?.title || 'This Application'}\n\nVersion 1.0\nClassic Mac OS Application\n\nThis is a vintage Mac OS simulation.`);
        } else {
          alert('About Finder\n\nFinder 8.6\nClassic Mac OS Desktop\n\nThis is a vintage Mac OS simulation.');
        }
        break;
      case 'help-report-bug':
        alert('Report a Bug\n\nNetwork connection unavailable.\nPlease try again later.');
        break;

      // Desktop Icons Menu Actions
      case 'open-desktop-icon':
        if (data) {
          handleIconDoubleClick(data);
        }
        break;

      default:
        console.log('Unhandled menu action:', action, data);
    }
  };

  const handleFireworksComplete = () => {
    setShowFireworks(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden relative" style={{ minHeight: '600px', minWidth: '800px' }}>
      <img
          className="absolute top-0 left-0 w-full h-full object-cover bg-image"
          src={bgImage}
          alt="Background"
          style={{ objectFit: 'cover' }}
        />
      {/* 菜单栏 */}
      <MenuBar 
         openWindows={openWindows}
         activeWindow={activeWindow}
         onMenuAction={handleMenuAction}
       />
      
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
      {/* 按zIndex排序窗口，确保zIndex大的在上面 */}
      {[...openWindows]
        .filter(window => !window.isMinimized)
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(window => (
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
            onResize={handleResizeWindow}
            musicUrl={window.musicUrl}
            videoUrl={window.videoUrl}
            onTerminalCommand={handleTerminalCommand}
          />
        ))}
      
      {/* 烟花效果 */}
      <FireworksEffect 
        isActive={showFireworks} 
        onComplete={handleFireworksComplete} 
      />
    </div>
  );
};

export default Desktop;

