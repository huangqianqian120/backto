import { useState, useRef, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

// 使用Vite的动态导入加载音频文件，并添加类型断言
const audioFiles = (import.meta as any).glob('../assets/*.m4a', { eager: true, as: 'url' });

const tracks = [
  {
    title: '素敵だね',
    artist: 'RIKKI',
    src: audioFiles['../assets/素敵だね--RIKKI.m4a'],
  },
];

export default function VintageMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.8;
      console.log('Audio element initialized with source:', audio.src);
      audio.addEventListener('loadedmetadata', () => {
        console.log('Audio metadata loaded:', audio.duration);
      });
      audio.addEventListener('error', (e) => {
        console.error('Audio error:', e);
      });
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

  const track = tracks[0];

  return (
    <div className="w-full h-full bg-gray-100 p-4 font-pixel font-pixel-md flex flex-col items-center justify-center">
      <h1 className="text-center text-lg mb-4">
        {track.title} - {track.artist}
      </h1>

      <button
        onClick={handlePlayPause}
        className="bg-gray-200 text-gray-800 border-2 border-gray-400 p-3 rounded-full mb-4"
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>

      <audio
        ref={audioRef}
        src={track.src}
        onError={(e) => console.error('Audio element error:', e)}
        autoPlay={isPlaying}
      />
    </div>
  );
}