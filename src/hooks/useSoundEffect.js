import { useEffect, useRef, useState } from 'react';
// 使用公共路径引用音频文件
const sampleSound = '/sample.mp3';

// 音效钩子，用于播放简单的操作音效
const useSoundEffect = () => {
  const soundRefs = useRef({});
  const [audioEnabled, setAudioEnabled] = useState(false);

  // 初始化音频上下文
  const initializeAudio = async () => {
    if (audioEnabled) return;
    
    try {
      // 创建一个静音的音频来测试是否可以播放
      const testAudio = new Audio();
      testAudio.volume = 0;
      await testAudio.play();
      testAudio.pause();
      setAudioEnabled(true);
    } catch (error) {
      // 如果无法播放，等待用户交互
      console.log('Audio requires user interaction');
    }
  };

  // 预加载音效
  useEffect(() => {
    try {
      // 为不同操作创建音频元素
      soundRefs.current.click = new Audio(sampleSound);
      soundRefs.current.doubleClick = new Audio(sampleSound);
      soundRefs.current.close = new Audio(sampleSound);

      // 设置音量
      Object.values(soundRefs.current).forEach(sound => {
        sound.volume = 0.3;
        sound.preload = 'auto';
      });

      // 添加用户交互监听器来启用音频
      const enableAudio = () => {
        if (!audioEnabled) {
          setAudioEnabled(true);
          document.removeEventListener('click', enableAudio);
          document.removeEventListener('keydown', enableAudio);
          document.removeEventListener('touchstart', enableAudio);
        }
      };

      document.addEventListener('click', enableAudio);
      document.addEventListener('keydown', enableAudio);
      document.addEventListener('touchstart', enableAudio);

      // 清理函数
      return () => {
        Object.values(soundRefs.current).forEach(sound => {
          sound.pause();
          sound.src = '';
        });
        document.removeEventListener('click', enableAudio);
        document.removeEventListener('keydown', enableAudio);
        document.removeEventListener('touchstart', enableAudio);
      };
    } catch (error) {
      console.error('Failed to load sound effect:', error);
    }
  }, []);

  // 播放音效的函数
  const playSound = (type) => {
    if (soundRefs.current[type]) {
      try {
        // 重置音频播放位置
        soundRefs.current[type].currentTime = 0;
        // 播放音效
        const playPromise = soundRefs.current[type].play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log(`Audio play was prevented: ${error}`);
          });
        }
      } catch (error) {
        console.log(`Error playing ${type} sound effect:`, error);
      }
    }
  };

  return {
    playClickSound: () => playSound('click'),
    playDoubleClickSound: () => playSound('doubleClick'),
    playCloseSound: () => playSound('close')
  };
};

// 确保文件末尾有一个空行

export default useSoundEffect;