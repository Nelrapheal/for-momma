import React, { useState } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';
import { audioEngine } from '../audio/AudioEngine';

export const MusicController: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);

  const toggleMusic = () => {
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (nextState) {
      audioEngine.startAmbientMusic();
    } else {
      audioEngine.toggleMute();
    }
  };

  return (
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
  );
};

