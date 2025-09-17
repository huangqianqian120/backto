import React, { useState, useRef, useEffect } from 'react';

const VintageTextEdit = ({ onCommand }) => {
  const [content, setContent] = useState('');
  const [selectedFont, setSelectedFont] = useState('Chicago');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef(null);

  // 监听终端命令
  useEffect(() => {
    const handleTextEditCommand = (event) => {
      if (event.detail && event.detail.command === 'textedit://poem') {
        setContent(`roses are #FF0000
violets are #0000FF
you look like a Macintosh
from 1992`);
      }
    };

    window.addEventListener('textEditNavigate', handleTextEditCommand);
    return () => {
      window.removeEventListener('textEditNavigate', handleTextEditCommand);
    };
  }, []);

  // 更新字数统计
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  // 检查彩蛋
  useEffect(() => {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('rosebud')) {
      setEasterEggMessage('Easter Egg Unlocked: Welcome, Citizen Kane.');
      setShowEasterEgg(true);
    } else if (lowerContent.includes('sudo write')) {
      setEasterEggMessage('You are not root. Access denied.');
      setShowEasterEgg(true);
    } else if (content.length > 500) {
      setEasterEggMessage("That's a lot of typing...");
      setShowEasterEgg(true);
    }
  }, [content]);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleFontChange = (font) => {
    setSelectedFont(font);
    setActiveMenu(null);
  };

  const handleFormatChange = (format) => {
    switch (format) {
      case 'bold':
        setIsBold(!isBold);
        break;
      case 'italic':
        setIsItalic(!isItalic);
        break;
      case 'underline':
        setIsUnderline(!isUnderline);
        break;
    }
    setActiveMenu(null);
  };

  const handleSave = () => {
    setShowSaveDialog(true);
    setActiveMenu(null);
  };

  const handlePrint = () => {
    setShowPrintDialog(true);
    setActiveMenu(null);
  };

  const handleNew = () => {
    setContent('');
    setActiveMenu(null);
  };

  const getFontFamily = () => {
    const fonts = {
      'Monaco': 'Monaco, monospace',
      'Chicago': 'Chicago, Charcoal, Impact, Arial Black, sans-serif',
      'Geneva': 'Geneva, Helvetica, Arial, sans-serif'
    };
    return fonts[selectedFont] || 'Chicago, Charcoal, Impact, Arial Black, sans-serif';
  };

  const getTextStyle = () => {
    return {
      fontFamily: getFontFamily(),
      fontWeight: isBold ? 'bold' : 'normal',
      fontStyle: isItalic ? 'italic' : 'normal',
      textDecoration: isUnderline ? 'underline' : 'none'
    };
  };

  return (
    <div className="h-full bg-white flex flex-col" style={{ fontFamily: 'Chicago, Charcoal, Impact, Arial Black, sans-serif' }}>
      {/* 菜单栏 */}
      <div className="bg-gray-100 border-b border-gray-300 px-2 py-1 flex items-center space-x-4 text-xs relative">
        <div className="relative">
          <button 
            className={`px-2 py-1 hover:bg-gray-200 ${activeMenu === 'file' ? 'bg-gray-200' : ''}`}
            onClick={() => handleMenuClick('file')}
          >
            File
          </button>
          {activeMenu === 'file' && (
            <div className="absolute top-full left-0 bg-white border border-gray-400 shadow-lg z-10 min-w-24">
              <button className="block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white" onClick={handleNew}>New</button>
              <button className="block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white">Open</button>
              <button className="block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white" onClick={handleSave}>Save</button>
              <div className="border-t border-gray-300 my-1"></div>
              <button className="block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white" onClick={handlePrint}>Print</button>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            className={`px-2 py-1 hover:bg-gray-200 ${activeMenu === 'edit' ? 'bg-gray-200' : ''}`}
            onClick={() => handleMenuClick('edit')}
          >
            Edit
          </button>
          {activeMenu === 'edit' && (
            <div className="absolute top-full left-0 bg-white border border-gray-400 shadow-lg z-10 min-w-24">
              <button className="block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white">Undo</button>
              <div className="border-t border-gray-300 my-1"></div>
              <button className="block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white">Cut</button>
              <button className="block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white">Copy</button>
              <button className="block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white">Paste</button>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            className={`px-2 py-1 hover:bg-gray-200 ${activeMenu === 'font' ? 'bg-gray-200' : ''}`}
            onClick={() => handleMenuClick('font')}
          >
            Font
          </button>
          {activeMenu === 'font' && (
            <div className="absolute top-full left-0 bg-white border border-gray-400 shadow-lg z-10 min-w-24">
              <button 
                className={`block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white ${selectedFont === 'Monaco' ? 'bg-blue-100' : ''}`}
                onClick={() => handleFontChange('Monaco')}
              >
                Monaco
              </button>
              <button 
                className={`block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white ${selectedFont === 'Chicago' ? 'bg-blue-100' : ''}`}
                onClick={() => handleFontChange('Chicago')}
              >
                Chicago
              </button>
              <button 
                className={`block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white ${selectedFont === 'Geneva' ? 'bg-blue-100' : ''}`}
                onClick={() => handleFontChange('Geneva')}
              >
                Geneva
              </button>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button 
            className={`px-2 py-1 hover:bg-gray-200 ${activeMenu === 'format' ? 'bg-gray-200' : ''}`}
            onClick={() => handleMenuClick('format')}
          >
            Format
          </button>
          {activeMenu === 'format' && (
            <div className="absolute top-full left-0 bg-white border border-gray-400 shadow-lg z-10 min-w-24">
              <button 
                className={`block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white ${isBold ? 'bg-blue-100' : ''}`}
                onClick={() => handleFormatChange('bold')}
              >
                Bold
              </button>
              <button 
                className={`block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white ${isItalic ? 'bg-blue-100' : ''}`}
                onClick={() => handleFormatChange('italic')}
              >
                Italic
              </button>
              <button 
                className={`block w-full text-left px-3 py-1 hover:bg-blue-500 hover:text-white ${isUnderline ? 'bg-blue-100' : ''}`}
                onClick={() => handleFormatChange('underline')}
              >
                Underline
              </button>
            </div>
          )}
        </div>
        
        {/* 字数统计 */}
        <div className="ml-auto text-gray-600">
          Words: {wordCount}
        </div>
      </div>

      {/* 文本编辑区域 */}
      <div className="flex-1 p-4">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleContentChange}
          placeholder="Start typing..."
          className="w-full h-full resize-none border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          style={{
            ...getTextStyle(),
            backgroundColor: '#ffffff',
            lineHeight: '1.4'
          }}
        />
      </div>

      {/* 保存对话框 */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-2 border-gray-400 p-4 shadow-lg" style={{ fontFamily: 'Chicago, serif' }}>
            <div className="text-sm font-bold mb-3">Save Document</div>
            <div className="mb-3">
              <input 
                type="text" 
                placeholder="Untitled" 
                className="border border-gray-300 px-2 py-1 text-xs w-48"
              />
            </div>
            <div className="text-xs text-red-600 mb-3">Error: Disk Full</div>
            <div className="flex space-x-2">
              <button 
                className="px-3 py-1 bg-gray-200 border border-gray-400 text-xs hover:bg-gray-100"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </button>
              <button 
                className="px-3 py-1 bg-gray-200 border border-gray-400 text-xs hover:bg-gray-100"
                onClick={() => setShowSaveDialog(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 打印对话框 */}
      {showPrintDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-2 border-gray-400 p-4 shadow-lg" style={{ fontFamily: 'Chicago, serif' }}>
            <div className="text-sm font-bold mb-3">🖨️ Print Document</div>
            <div className="mb-3 text-xs">
              <div>Your document is being printed...</div>
              <div className="mt-2">
                <input type="checkbox" id="printer" className="mr-2" />
                <label htmlFor="printer">Epson Stylus Color 740</label>
              </div>
            </div>
            <div className="flex justify-center">
              <button 
                className="px-4 py-1 bg-gray-200 border border-gray-400 text-xs hover:bg-gray-100"
                onClick={() => setShowPrintDialog(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 彩蛋提示 */}
      {showEasterEgg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white border-2 border-gray-400 p-4 shadow-lg" style={{ fontFamily: 'Chicago, serif' }}>
            <div className="text-sm font-bold mb-3">System Message</div>
            <div className="mb-3 text-xs">{easterEggMessage}</div>
            <div className="flex justify-center">
              <button 
                className="px-4 py-1 bg-gray-200 border border-gray-400 text-xs hover:bg-gray-100"
                onClick={() => setShowEasterEgg(false)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 点击其他地方关闭菜单 */}
      {activeMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setActiveMenu(null)}
        ></div>
      )}
    </div>
  );
};

export default VintageTextEdit;