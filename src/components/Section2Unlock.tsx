import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Key, Sparkles, Heart } from 'lucide-react';
import { audioEngine } from '../audio/AudioEngine';
import { InteractiveCard } from './InteractiveCard';

interface Section2UnlockProps {
  expectedAnswer: string;
  onUnlocked: () => void;
}

export const Section2Unlock: React.FC<Section2UnlockProps> = ({
  expectedAnswer = 'Momma',
  onUnlocked,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleUnlockAttempt = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const normalizedInput = inputValue.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    const normalizedTarget = expectedAnswer.trim().toLowerCase().replace(/[^a-z0-9]/g, '');

    if (normalizedInput === normalizedTarget || normalizedInput === 'momma') {
      setIsSuccess(true);
      audioEngine.playBloomSound();
      setTimeout(() => {
        onUnlocked();
      }, 200);
    } else {
      setIsShaking(true);
      audioEngine.playErrorSound();
      setErrorMessage('Only my favourite girl knows this ❤️');
      setTimeout(() => setIsShaking(false), 600);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-3.5 sm:px-6 pt-20 pb-12 sm:py-16 text-center z-10">
      {/* Background ambient lighting */}
      <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <InteractiveCard depth="subtle" className="max-w-md w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={
            isShaking
              ? { x: [-12, 12, -8, 8, -4, 4, 0], opacity: 1, scale: 1 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{ duration: isShaking ? 0.5 : 0.8 }}
          className="glass-card p-6 sm:p-10 rounded-3xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />

          <div className="flex flex-col items-center gap-5 sm:gap-6">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-400/20 border border-amber-200/30 flex items-center justify-center shadow-lg shrink-0">
              {isSuccess ? (
                <Unlock className="w-7 h-7 sm:w-8 sm:h-8 text-amber-300 animate-bounce" />
              ) : (
                <Lock className="w-7 h-7 sm:w-8 sm:h-8 text-rose-300" />
              )}
            </div>

            <h2 className="font-cinzel text-2xl sm:text-4xl text-gold-gradient font-bold leading-tight tracking-wide">
              Only my favourite girl can unlock this ❤️
            </h2>

            <p className="font-serif-cormorant text-base sm:text-xl text-rose-100/90 italic font-medium">
              Enter the secret nickname meant only for you...
            </p>

            <form onSubmit={handleUnlockAttempt} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Enter the name I call you..."
                  id="unlock-nickname-input"
                  className="w-full px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl bg-slate-950/70 border border-rose-300/30 focus:border-amber-300 focus:ring-2 focus:ring-amber-300/20 text-rose-100 placeholder-rose-200/40 text-center font-serif-cormorant text-lg sm:text-xl tracking-wide outline-none transition-all shadow-inner min-h-[48px]"
                  autoComplete="off"
                  disabled={isSuccess}
                />
                <Key className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-rose-300/40 pointer-events-none" />
              </div>

              <AnimatePresence>
                {errorMessage && (
                  <motion.p
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-amber-200/90 font-serif-cormorant text-base italic"
                  >
                    {errorMessage}
                  </motion.p>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={!inputValue.trim() || isSuccess}
                id="unlock-submit-button"
                className="premium-button w-full py-3.5 sm:py-4 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-semibold text-base sm:text-lg shadow-xl hover:shadow-rose-500/30 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px] overflow-hidden"
              >
                <div className="animate-shimmer-sheen" />
                {isSuccess ? (
                  <>
                    <span>Blooming Garden...</span>
                    <Sparkles className="w-5 h-5 animate-spin" />
                  </>
                ) : (
                  <>
                    <span>Unlock My Heart</span>
                    <Heart className="w-5 h-5 fill-slate-950/20" />
                  </>
                )}
              </button>
            </form>

          </div>
        </motion.div>
      </InteractiveCard>
    </div>
  );
};
