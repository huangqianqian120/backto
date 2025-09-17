import React, { useEffect, useState } from 'react';

const FireworksEffect = ({ isActive, onComplete }) => {
  const [fireworks, setFireworks] = useState([]);
  const [particles, setParticles] = useState([]);

  const colors = [
    '#ff6b6b', '#ff4757', '#ff3838', '#ff6348', '#ff5722',
    '#e74c3c', '#c0392b', '#ff1744', '#d32f2f', '#b71c1c',
    '#4ecdc4', '#45b7d1', '#feca57', '#ff9ff3', '#54a0ff'
  ];

  const createFirework = () => {
    const id = Math.random();
    const x = Math.random() * window.innerWidth;
    const y = window.innerHeight;
    const targetY = Math.random() * (window.innerHeight * 0.3) + 100;
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    return {
      id,
      x,
      y,
      targetY,
      color,
      phase: 'rising', // rising, exploding, fading
      opacity: 1,
      size: 6
    };
  };

  const createParticles = (x, y, color) => {
    const particleCount = 25 + Math.random() * 20;
    const newParticles = [];
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount + (Math.random() - 0.5) * 0.5;
      const velocity = 3 + Math.random() * 6;
      const life = 80 + Math.random() * 60;
      
      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity,
        color,
        life,
        maxLife: life,
        size: 3 + Math.random() * 5
      });
    }
    
    return newParticles;
  };

  useEffect(() => {
    if (!isActive) return;

    let animationFrame;
    let fireworkInterval;
    
    // 创建烟花的间隔
    fireworkInterval = setInterval(() => {
      setFireworks(prev => [...prev, createFirework()]);
    }, 400 + Math.random() * 600);

    // 动画循环
    const animate = () => {
      setFireworks(prev => {
        return prev.map(firework => {
          if (firework.phase === 'rising') {
            const newY = firework.y - 6;
            if (newY <= firework.targetY) {
              // 到达目标高度，开始爆炸
              setParticles(prevParticles => [
                ...prevParticles,
                ...createParticles(firework.x, firework.targetY, firework.color)
              ]);
              return { ...firework, phase: 'exploding', y: firework.targetY };
            }
            return { ...firework, y: newY };
          }
          return firework;
        }).filter(firework => firework.phase !== 'exploding');
      });

      setParticles(prev => {
        return prev.map(particle => {
          const newLife = particle.life - 1;
          const opacity = newLife / particle.maxLife;
          
          return {
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy + 0.1, // 重力效果
            vy: particle.vy + 0.05, // 重力加速度
            life: newLife,
            opacity: Math.max(0, opacity),
            size: particle.size * opacity
          };
        }).filter(particle => particle.life > 0);
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    // 55秒后停止创建新烟花
    const stopTimeout = setTimeout(() => {
      clearInterval(fireworkInterval);
    }, 55000);

    // 60秒后完全结束
    const completeTimeout = setTimeout(() => {
      clearInterval(fireworkInterval);
      cancelAnimationFrame(animationFrame);
      setFireworks([]);
      setParticles([]);
      onComplete && onComplete();
    }, 60000);

    return () => {
      clearInterval(fireworkInterval);
      clearTimeout(stopTimeout);
      clearTimeout(completeTimeout);
      cancelAnimationFrame(animationFrame);
    };
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* 上升的烟花 */}
      {fireworks.map(firework => (
        <div
          key={firework.id}
          className="absolute rounded-full"
          style={{
            left: firework.x - firework.size / 2,
            top: firework.y - firework.size / 2,
            width: firework.size,
            height: firework.size,
            backgroundColor: firework.color,
            opacity: firework.opacity,
            boxShadow: `0 0 ${firework.size * 3}px ${firework.color}, 0 0 ${firework.size * 6}px ${firework.color}`,
            transition: 'none'
          }}
        />
      ))}
      
      {/* 爆炸的粒子 */}
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x - particle.size / 2,
            top: particle.y - particle.size / 2,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}, 0 0 ${particle.size * 4}px ${particle.color}`,
            transition: 'none'
          }}
        />
      ))}
      
      {/* 背景遮罩，增强视觉效果 */}
      <div 
        className="absolute inset-0 bg-black opacity-20"
        style={{
          background: 'radial-gradient(circle, transparent 0%, rgba(0,0,0,0.2) 100%)'
        }}
      />
    </div>
  );
};

export default FireworksEffect;