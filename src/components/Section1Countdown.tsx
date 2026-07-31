import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Clock, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../audio/AudioEngine';
import { InteractiveCard } from './InteractiveCard';

const safeConfetti = confetti.create(undefined, {
  resize: true,
  useWorker: false,
});

interface Section1CountdownProps {
  onOpenSurprise: () => void;
  nickname: string;
}

export const Section1Countdown: React.FC<Section1CountdownProps> = ({
  onOpenSurprise,
  nickname,
}) => {
  // Default target date: Girlfriend's Day (August 1st) or immediate zero countdown mode
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
    hours: 0,
    minutes: 0,
    seconds: 5,
  });
  const [isZero, setIsZero] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          setIsZero(true);
          audioEngine.playBloomSound();
          return { hours: 0, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isZero) {
      safeConfetti({
        particleCount: 65,
        spread: 80,
        startVelocity: 40,
        origin: { y: 0.6 },
        colors: ['#E8A598', '#FFB7C5', '#D4AF37', '#FFFDF7'],
      });
    }
  }, [isZero]);

  const handleSkipCountdown = () => {
    setIsZero(true);
    audioEngine.playClickSound();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-3.5 sm:px-6 pt-20 pb-12 sm:py-16 text-center z-10 overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-64 sm:w-80 h-64 sm:h-80 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

      <InteractiveCard depth="subtle" className="max-w-2xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-5 sm:p-10 rounded-3xl relative overflow-hidden"
        >
          {/* Subtle top rose gold border shine */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E8A598] to-transparent opacity-60" />

          <AnimatePresence mode="wait">
            {!isZero ? (
              /* COUNTDOWN ACTIVE VIEW */
              <motion.div
                key="countdown"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center gap-6"
              >
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/15 border border-rose-300/20 text-rose-200 text-xs sm:text-sm font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
                  <span>Special Surprise Preparation</span>
                </div>

                <h1 className="font-cinzel text-2xl sm:text-4xl md:text-5xl text-gold-gradient font-bold leading-tight px-2 tracking-wide">
                  Someone has been working on something for the prettiest girl... ❤️
                </h1>

                <p className="font-serif-cormorant text-xl sm:text-2xl text-rose-100/90 italic max-w-lg font-medium leading-relaxed">
                  Counting down the magical moments until your surprise is ready.
                </p>

                {/* Countdown Timer Display */}
                <div className="grid grid-cols-3 gap-3 sm:gap-6 my-4 w-full max-w-md">
                  <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-amber-200/15 shadow-inner">
                    <span className="font-cinzel text-3xl sm:text-5xl font-bold text-amber-200 drop-shadow-md">
                      {String(timeLeft.hours).padStart(2, '0')}
                    </span>
                    <span className="font-serif-cormorant text-xs sm:text-sm text-rose-200/80 uppercase tracking-widest mt-1">
                      Hours
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-amber-200/15 shadow-inner">
                    <span className="font-cinzel text-3xl sm:text-5xl font-bold text-amber-200 drop-shadow-md">
                      {String(timeLeft.minutes).padStart(2, '0')}
                    </span>
                    <span className="font-serif-cormorant text-xs sm:text-sm text-rose-200/80 uppercase tracking-widest mt-1">
                      Minutes
                    </span>
                  </div>
                  <div className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-slate-900/60 border border-amber-200/15 shadow-inner">
                    <span className="font-cinzel text-3xl sm:text-5xl font-bold text-rose-300 drop-shadow-md">
                      {String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    <span className="font-serif-cormorant text-xs sm:text-sm text-rose-200/80 uppercase tracking-widest mt-1">
                      Seconds
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleSkipCountdown}
                  id="skip-countdown-button"
                  className="premium-button mt-2 group relative flex items-center gap-2 px-6 py-2.5 rounded-full bg-rose-500/20 hover:bg-rose-500/30 border border-rose-300/40 text-rose-100 text-sm font-medium transition-all duration-300 cursor-pointer shadow-md overflow-hidden"
                >
                  <div className="animate-shimmer-sheen" />
                  <span>Reveal Now</span>
                  <Heart className="w-4 h-4 text-rose-300 group-hover:scale-125 transition-transform" />
                </button>
              </motion.div>
            ) : (
              /* COUNTDOWN REACHED ZERO / REVEALED VIEW */
              <motion.div
                key="message"
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center gap-6"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500/30 to-amber-300/30 border border-amber-200/40 flex items-center justify-center shadow-xl animate-bounce">
                  <Heart className="w-8 h-8 text-rose-300 fill-rose-300/40" />
                </div>

                <h2 className="font-display text-3xl sm:text-5xl text-gold-gradient font-bold tracking-tight">
                  Happy Girlfriend's Day, Mira ❤️
                </h2>

                <div className="space-y-4 font-serif-cormorant text-lg sm:text-2xl text-rose-100/90 leading-relaxed italic max-w-xl text-center px-2">
                  <p>
                    I wanted to give you something that couldn't be bought off a shelf, so I decided to show my love using the one thing I know how to create.
                  </p>
                  <p>
                    Every little part of this was made with you in mind.
                  </p>
                  <p className="text-amber-200/95 font-semibold not-italic">
                    I hope it makes you smile. ❤️
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      onOpenSurprise();
                    }}
                    id="open-surprise-button"
                    className="premium-button group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-slate-950 font-semibold text-base sm:text-lg shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 transition-all duration-300 cursor-pointer overflow-hidden"
                  >
                    <div className="animate-shimmer-sheen" />
                    <span>Open Your Surprise ❤️</span>
                    <ArrowRight className="w-5 h-5 text-slate-950 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </InteractiveCard>
    </div>
  );
};
