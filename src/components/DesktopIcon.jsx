import React, { useState } from 'react';

const DesktopIcon = ({ id, name, icon, position, onDoubleClick }) => {
  const [isSelected, setIsSelected] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    setIsSelected(true);
    setTimeout(() => setIsSelected(false), 300);
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    onDoubleClick(id);
  };

  return (
    <div
      className={`absolute flex flex-col items-center cursor-pointer select-none desktop-icon ${
        isSelected ? 'icon-selected' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        width: '80px',
        height: '80px'
      }}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
    >
      {/* 图标 */}
      <div className="text-4xl mb-1 transition-transform duration-200 pointer-events-none">
        {icon}
      </div>
      
      {/* 图标名称 */}
      <div className="desktop-icon-text text-white text-center leading-tight px-1 py-0.5 rounded max-w-full pointer-events-none">
        {name}
      </div>
    </div>
  );
};

export default DesktopIcon;

