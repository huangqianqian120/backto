import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

const VintageVideoPlayer = ({ videoUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  // 从YouTube URL提取视频ID
  const getYouTubeVideoId = (url) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(videoUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0` : null;

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":""}', '*');
      } else {
        videoRef.current.contentWindow.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.contentWindow.postMessage('{"event":"command","func":"unMute","args":""}', '*');
      } else {
        videoRef.current.contentWindow.postMessage('{"event":"command","func":"mute","args":""}', '*');
      }
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.contentWindow.postMessage(`{"event":"command","func":"setVolume","args":"${newVolume * 100}"}`, '*');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (!embedUrl) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-white">
        <p>无效的视频链接</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full bg-black vintage-video-player"
      style={{
        background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
        border: '2px solid #444',
        borderRadius: '8px',
        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)'
      }}
    >
      {/* 视频区域 */}
      <div className="relative w-full" style={{ height: 'calc(100% - 60px)' }}>
        <iframe
          ref={videoRef}
          src={embedUrl}
          className="w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Vintage Video Player"
        />
        
        {/* 复古边框效果 */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            border: '3px solid #666',
            borderRadius: '4px',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.3)'
          }}
        />
      </div>

      {/* 控制栏 */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-15 flex items-center justify-between px-4 py-2"
        style={{
          background: 'linear-gradient(180deg, #3a3a3a, #2a2a2a)',
          borderTop: '1px solid #555',
          borderRadius: '0 0 6px 6px'
        }}
      >
        {/* 左侧控制按钮 */}
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlay}
            className="text-white hover:text-blue-400 transition-colors p-1"
            style={{
              background: 'linear-gradient(145deg, #4a4a4a, #3a3a3a)',
              border: '1px solid #666',
              borderRadius: '4px'
            }}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          
          <button
            onClick={toggleMute}
            className="text-white hover:text-blue-400 transition-colors p-1"
            style={{
              background: 'linear-gradient(145deg, #4a4a4a, #3a3a3a)',
              border: '1px solid #666',
              borderRadius: '4px'
            }}
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          
          {/* 音量滑块 */}
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer vintage-slider"
              style={{
                background: `linear-gradient(to right, #4a90e2 0%, #4a90e2 ${volume * 100}%, #666 ${volume * 100}%, #666 100%)`
              }}
            />
          </div>
        </div>

        {/* 右侧控制按钮 */}
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleFullscreen}
            className="text-white hover:text-blue-400 transition-colors p-1"
            style={{
              background: 'linear-gradient(145deg, #4a4a4a, #3a3a3a)',
              border: '1px solid #666',
              borderRadius: '4px'
            }}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </div>

      {/* 复古显示屏效果 */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.1) 100%)',
          borderRadius: '8px'
        }}
      />
    </div>
  );
};

export default VintageVideoPlayer;