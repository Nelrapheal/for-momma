import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, Mail, Star, Flame, Compass } from 'lucide-react';

export interface FlowerBloomOverlayProps {
  isTriggered: boolean;
  type?: 'bloom' | 'sparkle' | 'petal' | 'envelope' | 'dreamy';
  onBloomComplete?: () => void;
}

export const FlowerBloomOverlay: React.FC<FlowerBloomOverlayProps> = ({
  isTriggered,
  type = 'bloom',
  onBloomComplete,
}) => {
  const [active, setActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Preserve callback in a ref to avoid infinite re-trigger loop when parent re-renders
  const onCompleteRef = React.useRef(onBloomComplete);
  useEffect(() => {
    onCompleteRef.current = onBloomComplete;
  }, [onBloomComplete]);

  // Determine transition timing based on type
  // Set all transitions to last exactly 2 seconds before the content swap, then fade out
  const transitionDuration = 2000;
  const fadeOutStart = 2300;
  const deRenderTime = 3000;

  useEffect(() => {
    if (isTriggered && !active) {
      setActive(true);
    }
  }, [isTriggered, active]);

  useEffect(() => {
    if (active) {
      setIsVisible(true);
      setIsFadingOut(false);

      // Trigger page complete/content swap while covered
      const completeTimer = setTimeout(() => {
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }, transitionDuration);

      // Smoothly initiate the fade-out
      const fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
      }, fadeOutStart);

      // De-render completely once fade completes
      const hideTimer = setTimeout(() => {
        setIsVisible(false);
        setIsFadingOut(false);
        setActive(false);
      }, deRenderTime);

      return () => {
        clearTimeout(completeTimer);
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [active, type, transitionDuration, fadeOutStart, deRenderTime]);

  const renderContent = () => {
    switch (type) {
      case 'sparkle':
        return (
          <div className="flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.6, rotate: -45, opacity: 0 }}
              animate={{ scale: [0.8, 1.15, 1], rotate: 0, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-20 h-20 rounded-full border border-amber-300/30 bg-amber-500/10 flex items-center justify-center relative shadow-[0_0_20px_rgba(217,119,6,0.15)]"
            >
              <div className="absolute inset-1 border border-dashed border-amber-200/20 rounded-full animate-spin" style={{ animationDuration: '4s' }} />
              <Sparkles className="w-8 h-8 text-amber-300 animate-pulse" />
            </motion.div>
            <div className="text-center mt-4">
              <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-widest text-amber-200/90">
                PREPARING JOURNEY
              </span>
              <p className="font-serif-cormorant text-[11px] text-rose-100/50 italic mt-1">
                Aligning the stars for you...
              </p>
            </div>
          </div>
        );

      case 'petal':
        return (
          <div className="flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: [0.8, 1.1, 1], opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-20 h-20 rounded-full border border-rose-300/30 bg-rose-500/10 flex items-center justify-center relative shadow-[0_0_20px_rgba(244,63,94,0.15)]"
            >
              <Heart className="w-8 h-8 text-rose-400 fill-rose-400/20" />
              {/* Petals spinning inside */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-1.5 h-3 bg-pink-400 rounded-full absolute -top-1 left-1/2 -translate-x-1/2 rotate-12 animate-pulse" />
                <div className="w-1.5 h-3 bg-pink-400 rounded-full absolute -bottom-1 left-1/2 -translate-x-1/2 -rotate-12 animate-pulse" />
              </div>
            </motion.div>
            <div className="text-center mt-4">
              <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-widest text-rose-200/90">
                SCATTERING PETALS
              </span>
              <p className="font-serif-cormorant text-[11px] text-rose-100/50 italic mt-1">
                Gathering sweet reasons...
              </p>
            </div>
          </div>
        );

      case 'envelope':
        return (
          <div className="flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.5, y: 15, opacity: 0 }}
              animate={{ scale: [0.7, 1.12, 1], y: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-20 h-20 rounded-2xl border border-rose-300/30 bg-gradient-to-br from-rose-900/40 to-slate-900/60 flex items-center justify-center relative shadow-2xl"
            >
              <Mail className="w-8 h-8 text-rose-300" />
              <div className="absolute -bottom-1 right-3 px-1.5 py-0.5 rounded-full bg-rose-500/80 border border-rose-300/40 text-[8px] font-bold text-white tracking-widest">
                LOVE
              </div>
            </motion.div>
            <div className="text-center mt-4">
              <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-widest text-rose-200/90">
                UNSEALING THE LETTER
              </span>
              <p className="font-serif-cormorant text-[11px] text-rose-100/50 italic mt-1">
                Opening my heart...
              </p>
            </div>
          </div>
        );

      case 'dreamy':
        return (
          <div className="flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0.6, rotate: 180, opacity: 0 }}
              animate={{ scale: [0.8, 1.15, 1], rotate: 0, opacity: 1 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="w-20 h-20 rounded-full border border-amber-300/30 bg-slate-950/80 flex items-center justify-center relative shadow-[0_0_25px_rgba(251,191,36,0.1)]"
            >
              <Star className="w-8 h-8 text-amber-300 fill-amber-300/10 animate-pulse" />
              <div className="absolute inset-1 border border-dashed border-amber-300/10 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
            </motion.div>
            <div className="text-center mt-4">
              <span className="font-cinzel text-xs sm:text-sm font-semibold tracking-widest text-amber-200/90">
                DESTINATION SURPRISE
              </span>
              <p className="font-serif-cormorant text-[11px] text-rose-100/50 italic mt-1">
                Entering the beautiful twilight...
              </p>
            </div>
          </div>
        );

      case 'bloom':
      default:
        return (
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: isFadingOut ? 1.05 : 1, opacity: isFadingOut ? 0 : 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center"
          >
            {/* Pulsing Outer Core Circles */}
            <div className="relative flex items-center justify-center">
              {/* Expanding Ripple Rings */}
              <div className="absolute w-44 h-44 rounded-full border border-rose-500/20 animate-ping" style={{ animationDuration: '1.8s' }} />
              <div className="absolute w-56 h-56 rounded-full border border-rose-500/10 animate-ping" style={{ animationDuration: '2.5s', animationDelay: '0.4s' }} />

              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-amber-300/40 bg-rose-500/10 flex items-center justify-center shadow-2xl relative">
                <div className="absolute inset-1.5 border border-dashed border-rose-300/30 rounded-full animate-spin-slow" />
                <motion.div
                  animate={{ scale: [0.93, 1.07, 0.93] }}
                  transition={{ repeat: Infinity, duration: 1.0, ease: 'easeInOut' }}
                  className="z-10 flex items-center justify-center"
                >
                  <Heart className="w-10 h-10 text-rose-400 fill-rose-400/20 filter drop-shadow-[0_0_8px_rgba(251,113,133,0.45)]" />
                </motion.div>
              </div>
            </div>

            <div className="text-center mt-7 space-y-1">
              <div className="flex items-center gap-1.5 justify-center">
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                <span className="font-cinzel text-base sm:text-lg font-bold tracking-widest text-gold-gradient">
                  BLOOMING SURPRISE
                </span>
                <Sparkles className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
              <p className="font-serif-cormorant text-xs sm:text-sm text-rose-100/70 italic tracking-wide">
                Preparing your magical moment...
              </p>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isFadingOut ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: isFadingOut ? 0.5 : 0.35, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-tr from-[#1E0E20] via-[#2F1127] to-[#0B1026] pointer-events-auto overflow-hidden"
          style={{ willChange: 'opacity' }}
        >
          {/* Subtle Twinkling Sparkle Background */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-amber-200 rounded-full animate-ping" />
            <div className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-rose-300 rounded-full animate-pulse" />
            <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full animate-pulse" />
            <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-amber-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          </div>

          {/* Warm Backdrop Ambient Glow */}
          <div className="absolute w-72 h-72 rounded-full bg-rose-500/10 pointer-events-none animate-pulse" />
          <div className="absolute w-56 h-56 rounded-full bg-amber-400/5 pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

          {/* Render content specific to selected transition style */}
          {renderContent()}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
