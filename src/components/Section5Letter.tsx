import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { audioEngine } from '../audio/AudioEngine';
import { InteractiveCard } from './InteractiveCard';

interface Section5LetterProps {
  nickname: string;
  letterText: string;
  onFinishReading: () => void;
}

export const Section5Letter: React.FC<Section5LetterProps> = ({
  nickname,
  letterText,
  onFinishReading,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpenEnvelope = () => {
    if (isOpen) return;
    audioEngine.playSealBreakSound();
    setIsOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-3.5 sm:px-6 pt-20 pb-12 sm:py-16 text-center z-10 overflow-hidden">
      {/* Decorative warm lighting */}
      <div className="absolute w-[320px] sm:w-[500px] h-[320px] sm:h-[500px] bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {!isOpen ? (
          /* FLOATING ENVELOPE VIEW */
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: -100, rotate: -5 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-5 sm:gap-6 cursor-pointer max-w-md w-full"
            onClick={handleOpenEnvelope}
            id="envelope-wrapper"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/15 border border-amber-300/30 text-amber-200 text-xs sm:text-sm font-medium">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>For My Dearest {nickname}</span>
            </div>

            {/* Luxurious Wax Sealed Envelope Graphic */}
            <InteractiveCard depth="subtle" className="w-full">
              <div className="card-hover-premium relative w-full aspect-[4/3] rounded-3xl bg-gradient-to-b from-[#FDF8F0] via-[#F5E6D3] to-[#E6CBB2] p-4 sm:p-6 shadow-2xl border-2 border-amber-300/50 flex flex-col items-center justify-center transition-transform duration-500 group overflow-hidden">
                <div className="animate-shimmer-sheen opacity-40" />
                {/* Envelope Flap Triangles */}
                <div className="absolute top-0 left-0 right-0 h-1/2 border-b-2 border-amber-800/10 bg-amber-100/40 rounded-t-3xl clip-path-triangle pointer-events-none" />

                {/* Envelope To Address */}
                <div className="z-10 text-center space-y-1">
                  <span className="font-script text-3xl sm:text-5xl text-amber-950 font-bold block drop-shadow-sm px-2">
                    To: My Favorite Person
                  </span>
                  <span className="font-serif-cormorant text-base sm:text-lg text-amber-900/80 italic block font-medium">
                    (Tap to break wax seal ❤️)
                  </span>
                </div>

                {/* Wax Seal Button */}
                <div className="z-20 mt-4 sm:mt-6 w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-rose-700 via-rose-600 to-amber-600 border-2 border-amber-300/80 shadow-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-rose-300/40 flex items-center justify-center">
                    <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-amber-100 fill-amber-100/40 animate-pulse" />
                  </div>
                </div>
              </div>
            </InteractiveCard>

            <p className="text-amber-200/80 font-serif-cormorant text-base sm:text-lg italic">
              Tap the wax seal to open your letter 💌
            </p>
          </motion.div>
        ) : (
          /* UNFOLDED LOVE LETTER PAPER VIEW */
          <InteractiveCard depth="subtle" className="max-w-2xl w-full mx-auto">
            <motion.div
              key="letter"
              initial={{ opacity: 0, scale: 0.85, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="w-full glass-card-paper p-5 sm:p-12 rounded-3xl relative text-left shadow-2xl my-2 sm:my-4 text-slate-900 border-2 border-amber-300/40"
            >
              {/* Top Paper Decorative Crest */}
              <div className="flex items-center justify-between border-b border-amber-900/10 pb-3 sm:pb-4 mb-4 sm:mb-6">
                <span className="font-serif-cormorant text-[11px] sm:text-xs uppercase tracking-widest text-amber-900/70 font-semibold">
                  Girlfriend's Day Letter • 2026
                </span>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-rose-600 fill-rose-600/30" />
              </div>

              {/* Letter Body */}
              <div className="font-serif-cormorant text-amber-950 leading-relaxed space-y-5 sm:space-y-7 my-5 sm:my-7">
                {letterText.split('\n\n').map((paragraph, i) => {
                  const trimmed = paragraph.trim();
                  if (trimmed.startsWith('My Dearest') || trimmed.startsWith('## Love Letter')) {
                    return (
                      <h2 key={i} className="font-script text-4xl sm:text-6xl text-rose-950 font-bold mb-5 sm:mb-7">
                        {trimmed.replace(/^##\s*/, '')}
                      </h2>
                    );
                  }
                  if (trimmed.startsWith('—') || trimmed.startsWith('Your future husband')) {
                    return (
                      <div key={i} className="mt-8 sm:mt-10 pt-5 sm:pt-7 border-t border-amber-900/15 text-right font-script text-3xl sm:text-5xl text-rose-950 font-bold">
                        {trimmed}
                      </div>
                    );
                  }
                  return (
                    <p key={i} className="tracking-wide text-[19px] sm:text-[26px] font-semibold leading-relaxed text-amber-950">
                      {trimmed}
                    </p>
                  );
                })}
              </div>

              {/* Button to Finish Letter */}
              <div className="mt-10 text-center">
                <button
                  onClick={() => {
                    onFinishReading();
                  }}
                  id="finish-letter-button"
                  className="relative z-20 premium-button group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white font-semibold text-base sm:text-lg shadow-xl hover:shadow-rose-600/30 transition-all cursor-pointer overflow-hidden"
                >
                  <div className="animate-shimmer-sheen" />
                  <span>Hold This Moment Forever ❤️</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </InteractiveCard>
        )}
      </AnimatePresence>
    </div>
  );
};
