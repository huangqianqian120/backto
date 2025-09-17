import React, { useState, useEffect } from 'react';

const VintageLibrary = ({ onCommand }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogContent, setDialogContent] = useState('');
  const [openFolder, setOpenFolder] = useState(null);
  const [statusText, setStatusText] = useState('6 items');

  // 主文件夹内容
  const libraryItems = [
    {
      id: 'extensions',
      name: 'Extensions',
      icon: '📖',
      type: 'folder',
      description: 'System extension plugins',
      lastModified: '3/15/1999'
    },
    {
      id: 'control-panels',
      name: 'Control Panels',
      icon: '🧩',
      type: 'folder',
      description: 'System control panel entries',
      lastModified: '3/12/1999'
    },
    {
      id: 'appearance',
      name: 'Appearance',
      icon: '🎨',
      type: 'folder',
      description: 'System theme related files',
      lastModified: '2/28/1999'
    },
    {
      id: 'fonts',
      name: 'Fonts',
      icon: '🔠',
      type: 'folder',
      description: 'TrueType font files',
      lastModified: '3/10/1999'
    },
    {
      id: 'preferences',
      name: 'Preferences',
      icon: '📑',
      type: 'folder',
      description: 'User preference settings',
      lastModified: '3/16/1999'
    },
    {
      id: 'utilities',
      name: 'Utilities',
      icon: '🧰',
      type: 'folder',
      description: 'System utility tools',
      lastModified: '3/8/1999'
    }
  ];

  // Extensions 文件夹内容
  const extensionsItems = [
    { id: 'quicktime', name: 'QuickTime', icon: '🎬', type: 'extension', description: 'QuickTime multimedia extension' },
    { id: 'appletalk', name: 'AppleTalk', icon: '🍎', type: 'extension', description: 'AppleTalk networking protocol' },
    { id: 'colorsync', name: 'ColorSync', icon: '🌈', type: 'extension', description: 'Color management system' },
    { id: 'opengl', name: 'OpenGL', icon: '🔺', type: 'extension', description: '3D graphics acceleration' }
  ];

  // Control Panels 文件夹内容
  const controlPanelsItems = [
    { id: 'sound', name: 'Sound', icon: '🔊', type: 'control-panel', description: 'Audio settings and preferences' },
    { id: 'monitors', name: 'Monitors', icon: '🖥️', type: 'control-panel', description: 'Display configuration' },
    { id: 'modem', name: 'Modem', icon: '📞', type: 'control-panel', description: 'Modem and dial-up settings' },
    { id: 'network', name: 'Network', icon: '🌐', type: 'control-panel', description: 'Network configuration' }
  ];

  // Appearance 文件夹内容
  const appearanceItems = [
    { id: 'platinum', name: 'Platinum.theme', icon: '💎', type: 'theme', description: 'Default Platinum theme' },
    { id: 'copland', name: 'Copland.theme', icon: '🌟', type: 'theme', description: 'Experimental Copland theme' },
    { id: 'classic', name: 'Classic.theme', icon: '🏛️', type: 'theme', description: 'Classic Mac OS theme' }
  ];

  // Fonts 文件夹内容
  const fontsItems = [
    { id: 'chicago', name: 'Chicago', icon: '🏙️', type: 'font', description: 'System font for menus and dialogs' },
    { id: 'geneva', name: 'Geneva', icon: '🇨🇭', type: 'font', description: 'Clean sans-serif font' },
    { id: 'monaco', name: 'Monaco', icon: '🏎️', type: 'font', description: 'Monospaced programming font' },
    { id: 'wingdings', name: 'Wingdings', icon: '🦋', type: 'font', description: 'Symbol and dingbat font' }
  ];

  // Preferences 文件夹内容
  const preferencesItems = [
    { id: 'finder-prefs', name: 'Finder Prefs', icon: '🔍', type: 'pref', description: 'Finder preferences file' },
    { id: 'system-prefs', name: 'System Prefs', icon: '⚙️', type: 'pref', description: 'System preferences file' },
    { id: 'user-prefs', name: 'User Prefs', icon: '👤', type: 'pref', description: 'User preferences file' }
  ];

  // Utilities 文件夹内容
  const utilitiesItems = [
    { id: 'keychain', name: 'Keychain Access', icon: '🔐', type: 'utility', description: 'Password management utility' },
    { id: 'disk-aid', name: 'Disk First Aid', icon: '🩹', type: 'utility', description: 'Disk repair utility' },
    { id: 'calculator', name: 'Calculator', icon: '🧮', type: 'utility', description: 'Simple calculator application' }
  ];

  // 获取当前显示的项目
  const getCurrentItems = () => {
    switch (openFolder) {
      case 'extensions': return extensionsItems;
      case 'control-panels': return controlPanelsItems;
      case 'appearance': return appearanceItems;
      case 'fonts': return fontsItems;
      case 'preferences': return preferencesItems;
      case 'utilities': return utilitiesItems;
      default: return libraryItems;
    }
  };

  // 获取当前路径
  const getCurrentPath = () => {
    if (!openFolder) return 'Library';
    const folderNames = {
      'extensions': 'Extensions',
      'control-panels': 'Control Panels',
      'appearance': 'Appearance',
      'fonts': 'Fonts',
      'preferences': 'Preferences',
      'utilities': 'Utilities'
    };
    return `Library > ${folderNames[openFolder]}`;
  };

  // 处理项目点击
  const handleItemClick = (item) => {
    setSelectedItem(item.id);
    setStatusText(`Last modified: ${item.lastModified || 'Unknown'}`);
  };

  // 处理项目双击
  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      setOpenFolder(item.id);
      setSelectedItem(null);
      setStatusText(`${getCurrentItems().length} items`);
    } else {
      // 处理文件双击
      handleFileOpen(item);
    }
  };

  // 处理文件打开
  const handleFileOpen = (item) => {
    switch (item.id) {
      case 'wingdings':
        setDialogContent('🕹 THE HIDDEN CODE IS NEAR 🕹');
        setShowDialog(true);
        break;
      case 'finder-prefs':
      case 'system-prefs':
      case 'user-prefs':
        setDialogContent('⚠️ 文件损坏，是否恢复默认？');
        setShowDialog(true);
        break;
      case 'quicktime':
        setDialogContent('QuickTime Extension v4.1.2\n\nProvides multimedia playback capabilities for audio and video files. Supports MOV, AVI, and MPEG formats.');
        setShowDialog(true);
        break;
      case 'appletalk':
        setDialogContent('AppleTalk Protocol Stack\n\nEnables network communication between Macintosh computers. Required for file sharing and network printing.');
        setShowDialog(true);
        break;
      case 'sound':
        setDialogContent('🔊 Sound Control Panel\n\nInput Volume: ████████░░\nOutput Volume: ██████████\nAlert Sound: Sosumi');
        setShowDialog(true);
        break;
      case 'monitors':
        setDialogContent('🖥️ Monitors Control Panel\n\nResolution: 800 x 600\nColors: Thousands\nRefresh Rate: 75 Hz');
        setShowDialog(true);
        break;
      default:
        setDialogContent(`Opening ${item.name}...\n\n${item.description}`);
        setShowDialog(true);
        break;
    }
  };

  // 返回上级目录
  const handleBackClick = () => {
    setOpenFolder(null);
    setSelectedItem(null);
    setStatusText('6 items');
  };

  // 监听终端命令
  useEffect(() => {
    const handleLibraryCommand = (event) => {
      const { command } = event.detail;
      if (command === 'library://secrets') {
        setDialogContent('🔍 Secret Library Archives\n\nHidden files detected:\n• System 6.0.8 Beta\n• Unreleased Copland Build\n• Steve Jobs Demo Reel');
        setShowDialog(true);
      }
    };

    window.addEventListener('libraryNavigate', handleLibraryCommand);
    return () => window.removeEventListener('libraryNavigate', handleLibraryCommand);
  }, []);

  const currentItems = getCurrentItems();

  return (
    <div className="h-full bg-gray-100 flex flex-col" style={{ fontFamily: 'Chicago, Geneva, sans-serif' }}>
      {/* 工具栏 */}
      <div className="bg-gray-200 border-b border-gray-400 p-2 flex items-center gap-2">
        {openFolder && (
          <button
            onClick={handleBackClick}
            className="px-3 py-1 bg-gray-300 border border-gray-500 rounded text-xs hover:bg-gray-400 transition-colors"
          >
            ← Back
          </button>
        )}
        <span className="text-xs font-bold">{getCurrentPath()}</span>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-4 gap-4">
          {currentItems.map((item) => (
            <div
              key={item.id}
              className={`flex flex-col items-center p-3 rounded cursor-pointer transition-colors ${
                selectedItem === item.id ? 'bg-blue-200' : 'hover:bg-gray-200'
              }`}
              onClick={() => handleItemClick(item)}
              onDoubleClick={() => handleItemDoubleClick(item)}
            >
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-xs text-center font-medium">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 状态栏 */}
      <div className="bg-gray-200 border-t border-gray-400 px-3 py-1 text-xs">
        {statusText}
      </div>

      {/* 对话框 */}
      {showDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-100 border-2 border-gray-400 rounded p-4 max-w-md mx-4" style={{ fontFamily: 'Chicago, Geneva, sans-serif' }}>
            <div className="text-sm mb-4 whitespace-pre-line">{dialogContent}</div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDialog(false)}
                className="px-4 py-1 bg-gray-300 border border-gray-500 rounded text-xs hover:bg-gray-400 transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VintageLibrary;