import React, { useState, useRef, useEffect } from 'react';

const InteractiveTerminal = ({ onCommand }) => {
  const [history, setHistory] = useState([
    'Welcome to yunaOS Terminal v1.0',
    'Type `help` for a list of available commands.',
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);

  const commands = {
    help: () => [
      'Available commands:',
      '  help        - Show this help message',
      '  clear       - Clear terminal screen',
      '  aloha       - Launch fireworks on desktop',
      '  date        - Show current date and time',
      '  whoami      - Show current user',
      '  ls          - List directory contents',
      '  pwd         - Show current directory',
      '  open internet-explorer://easteregg - Access secret portal',
      '  open textedit://poem - Load vintage poem in TextEdit',
      '  open library://secrets - Access hidden library archives',
    ],
    clear: () => {
      setHistory([]);
      return [];
    },
    aloha: () => {
      onCommand && onCommand('aloha');
      return ['🎆 Launching fireworks on desktop...'];
    },
    'open internet-explorer://easteregg': () => {
      onCommand && onCommand('open internet-explorer://easteregg');
      return ['🌌 Opening secret cyberspace portal...'];
    },
    'open textedit://poem': () => {
      onCommand && onCommand('open textedit://poem');
      return ['📝 Loading vintage poem in TextEdit...'];
    },
    'open library://secrets': () => {
      onCommand && onCommand('open library://secrets');
      return ['🔍 Accessing hidden library archives...'];
    },
    date: () => [new Date().toString()],
    whoami: () => ['vintage-user'],
    ls: () => [
      'Desktop    Documents  Downloads  Music',
      'Pictures   Videos     Applications'
    ],
    pwd: () => ['/Users/vintage-user'],
  };

  const executeCommand = (cmd) => {
    const trimmedCmd = cmd.trim();
    if (!trimmedCmd) return;

    // 添加命令到历史记录
    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);

    // 添加命令行到显示历史
    const newHistory = [...history, `~ $ ${trimmedCmd}`];

    if (commands[trimmedCmd]) {
      const output = commands[trimmedCmd]();
      if (output && output.length > 0) {
        setHistory([...newHistory, ...output]);
      } else {
        setHistory(newHistory);
      }
    } else {
      setHistory([...newHistory, `command not found: ${trimmedCmd}`]);
    }

    setCurrentInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(currentInput);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCurrentInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex !== -1) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCurrentInput('');
        } else {
          setHistoryIndex(newIndex);
          setCurrentInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleTerminalClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    // 自动滚动到底部
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // 自动聚焦输入框
    inputRef.current?.focus();
  }, []);

  return (
    <div 
      ref={terminalRef}
      className="h-full bg-black text-green-400 font-mono text-lg p-4 overflow-y-auto cursor-text"
      onClick={handleTerminalClick}
      style={{ fontFamily: 'VT323, monospace' }}
    >
      {/* 历史记录 */}
      {history.map((line, index) => (
        <div key={index} className="mb-1 whitespace-pre-wrap">
          {line}
        </div>
      ))}
      
      {/* 当前输入行 */}
      <div className="flex items-center">
        <span className="text-green-400">~ $ </span>
        <input
          ref={inputRef}
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent text-green-400 outline-none border-none ml-1"
          style={{ fontFamily: 'VT323, monospace' }}
          autoComplete="off"
          spellCheck={false}
        />
        <div className="w-2 h-4 bg-green-400 ml-1 animate-pulse"></div>
      </div>
    </div>
  );
};

export default InteractiveTerminal;