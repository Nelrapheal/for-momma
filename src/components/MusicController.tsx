import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { audioEngine } from '../audio/AudioEngine';

const YOUTUBE_VIDEO_ID = 'PhW56WaPwfY';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export const MusicController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<any>(null);
  const isReadyRef = useRef(false);
  const hasAutoStartedRef = useRef(false);

  useEffect(() => {
    const initPlayer = () => {
      if (playerRef.current || !window.YT || !window.YT.Player) return;

      playerRef.current = new window.YT.Player('youtube-audio-player', {
        height: '10',
        width: '10',
        videoId: YOUTUBE_VIDEO_ID,
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: YOUTUBE_VIDEO_ID,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            isReadyRef.current = true;
            event.target.setVolume(100);
            event.target.unMute();
            event.target.playVideo();
            startMusic();
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            } else if (event.data === window.YT.PlayerState.ENDED) {
              event.target.playVideo();
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    }

    const checkInterval = setInterval(() => {
      if (window.YT && window.YT.Player && !playerRef.current) {
        initPlayer();
      }
    }, 400);

    // Immediately attempt autoplay on load
    startMusic();

    return () => {
      clearInterval(checkInterval);
    };
  }, []);

  const startMusic = () => {
    try {
      if (playerRef.current && isReadyRef.current) {
        playerRef.current.unMute();
        playerRef.current.setVolume(100);
        playerRef.current.playVideo();
      }
      setIsPlaying(true);
    } catch {
      // Ignore autoplay error
    }
  };

  const pauseMusic = () => {
    try {
      if (playerRef.current && isReadyRef.current) {
        playerRef.current.pauseVideo();
      }
      setIsPlaying(false);
    } catch {
      // Ignore pause error
    }
  };

  // Automatically start music on load and on any interaction (click, touch, scroll, move, key)
  useEffect(() => {
    const handleFirstUserInteraction = () => {
      if (!hasAutoStartedRef.current) {
        hasAutoStartedRef.current = true;
        startMusic();
      }
    };

    const options = { passive: true };
    window.addEventListener('click', handleFirstUserInteraction, options);
    window.addEventListener('touchstart', handleFirstUserInteraction, options);
    window.addEventListener('pointerdown', handleFirstUserInteraction, options);
    window.addEventListener('keydown', handleFirstUserInteraction, options);
    window.addEventListener('scroll', handleFirstUserInteraction, options);
    window.addEventListener('mousemove', handleFirstUserInteraction, options);

    // Also trigger startMusic immediately on mount
    startMusic();

    return () => {
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('touchstart', handleFirstUserInteraction);
      window.removeEventListener('pointerdown', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
      window.removeEventListener('scroll', handleFirstUserInteraction);
      window.removeEventListener('mousemove', handleFirstUserInteraction);
    };
  }, []);

  const toggleMusic = () => {
    hasAutoStartedRef.current = true;
    if (isPlaying) {
      pauseMusic();
    } else {
      startMusic();
    }
  };

  return (
    <>
      {/* 10x10 transparent container so mobile browsers treat it as active/visible and never throttle playback */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '10px',
          height: '10px',
          opacity: 0.01,
          pointerEvents: 'none',
          zIndex: -100,
          overflow: 'hidden',
        }}
      >
        <div id="youtube-audio-player" />
      </div>

      <div className="fixed top-3.5 sm:top-5 right-3.5 sm:right-5 z-50 flex items-center gap-2">
        {/* Floating Sound Control Box */}
        <button
          type="button"
          onClick={toggleMusic}
          id="audio-toggle-button"
          aria-label="Toggle Background Music"
          className="touch-manipulation select-none group relative flex items-center gap-2 sm:gap-2.5 px-3 py-2 sm:px-3.5 rounded-full glass-card hover:border-rose-300/50 text-amber-200 transition-all duration-300 active:scale-95 shadow-xl cursor-pointer min-h-[44px]"
        >
          <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-rose-500/20 text-amber-200 group-hover:scale-110 transition-transform shrink-0">
            {isPlaying ? (
              <Volume2 className="w-4 h-4 text-amber-200 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-300/70" />
            )}
          </div>

          <div className="relative flex flex-col text-left pr-1">
            <span className="text-[11px] font-medium tracking-wide text-amber-100/90 leading-tight">
              {isPlaying ? 'Music On' : 'Tap for Sound'}
            </span>
            <span className="text-[9px] text-rose-200/60 leading-none hidden sm:block">
              {isPlaying ? 'Now Playing' : 'Background Track'}
            </span>
          </div>

          <Music className={`w-3.5 h-3.5 shrink-0 ${isPlaying ? 'text-rose-300 animate-bounce' : 'text-slate-400/50'}`} />
        </button>
      </div>
    </>
  );
};



