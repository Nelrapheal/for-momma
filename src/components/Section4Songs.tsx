import React from 'react';
import { motion } from 'motion/react';
import { Disc3, ExternalLink, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { RomanticSong } from '../types';
import { audioEngine } from '../audio/AudioEngine';

interface Section4SongsProps {
  songs: RomanticSong[];
  onContinueToLetter: () => void;
}

export const Section4Songs: React.FC<Section4SongsProps> = ({
  songs,
  onContinueToLetter, }) => {
  const handleOpenYouTube = (url: string) => {
    audioEngine.playClickSound();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-3.5 sm:px-6 pt-20 pb-12 sm:py-16 text-center z-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-2xl w-full mx-auto space-y-2.5 sm:space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-300/20 text-rose-200 text-xs sm:text-sm font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Our Special Playlist</span>
        </div>

        <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl text-gold-gradient font-bold tracking-wide px-2">
          Songs That Always Make Me Think of You ❤️
        </h2>

        <p className="font-serif-cormorant text-base sm:text-xl text-rose-100/90 italic max-w-lg mx-auto font-medium px-2">
          Every note of these melodies carries a quiet memory of us.
        </p>
      </motion.div>

      {/* Two Song Cards */}
      <div className="w-full max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 my-8 px-2">
        {songs.map((song, idx) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: idx * 0.2 }}
            className="card-hover-premium glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between text-left border border-amber-200/20 shadow-xl group hover:border-amber-300/40 transition-all duration-300"
          >
            <div className="animate-shimmer-sheen opacity-30" />
            {/* Top gradient cover bar */}
            <div
              className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${song.coverGradient}`}
            />

            <div>
              {/* Vinyl record animated icon */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-slate-950 border-2 border-amber-300/30 flex items-center justify-center shadow-lg group-hover:rotate-180 transition-transform duration-1000">
                  <Disc3 className="w-8 h-8 text-rose-300 animate-spin-slow" />
                </div>
                <div>
                  <h3 className="font-cinzel text-xl sm:text-2xl text-amber-100 font-bold leading-snug">
                    {song.title}
                  </h3>
                  <p className="font-serif-cormorant text-xs sm:text-sm text-rose-200/80 uppercase tracking-widest font-semibold">
                    {song.artist}
                  </p>
                </div>
              </div>

              {/* Heartfelt Note */}
              <div className="p-4 rounded-2xl bg-slate-950/50 border border-rose-300/10 mb-6">
                <p className="font-serif-cormorant text-lg sm:text-xl text-rose-100/95 italic leading-relaxed font-medium">
                  "{song.note}"
                </p>
              </div>
            </div>

            {/* YouTube Redirect Button */}
            <button
              onClick={() => handleOpenYouTube(song.youtubeUrl)}
              id={`listen-youtube-${song.id}`}
              className="relative z-20 premium-button w-full py-3.5 px-4 rounded-2xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-300/30 text-rose-100 font-semibold text-sm transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 group/btn overflow-hidden"
            >
              <div className="animate-shimmer-sheen opacity-40" />
              <span>Listen on YouTube</span>
              <ExternalLink className="w-4 h-4 text-amber-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        ))}
      </div>

      {/* Transition to Love Letter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="my-4"
      >
        <button
          onClick={() => {
            onContinueToLetter();
          }}
          id="continue-to-letter-button"
          className="relative z-20 premium-button group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-slate-950 font-semibold text-base sm:text-lg shadow-2xl transition-all cursor-pointer overflow-hidden"
        >
          <div className="animate-shimmer-sheen" />
          <span>Open My Love Letter ❤️</span>
          <Heart className="w-5 h-5 fill-slate-950/20 group-hover:scale-125 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
};
