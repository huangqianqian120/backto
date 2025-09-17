import React, { useState, useRef, useEffect } from 'react';

const SimpleMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    console.log('SimpleMusicPlayer component mounted');
    const audio = audioRef.current;
    if (audio) {
      console.log('Audio element created:', audio);
      audio.volume = 0.8;
      
      // 尝试预加载音频
      audio.load();
      console.log('Audio preloaded');
    }
  }, []);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play()
        .then(() => console.log('Audio playing successfully'))
        .catch(error => console.error('Error playing audio:', error));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-xl mb-6">素敵だね - RIKKI</h1>
      <button
        onClick={handlePlayPause}
        className="bg-amber-100 text-amber-800 p-4 rounded-full border-2 border-amber-300"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <audio
        ref={audioRef}
        src="/src/assets/素敵だね--RIKKI.m4a"
        onError={(e) => {
          console.error('Audio error:', e);
          console.error('Audio src:', audioRef.current?.src);
        }}
        onLoadedMetadata={(e) => console.log('Audio metadata loaded:', (e.target as HTMLAudioElement).duration)}
        onPlay={() => console.log('Audio started playing')}
        onPause={() => console.log('Audio paused')}
      />
    </div>
  );
};

export default SimpleMusicPlayer;