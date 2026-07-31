import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, Calendar } from 'lucide-react';

interface DateLockScreenProps {
  onUnlockBypass: () => void;
}

export const DateLockScreen: React.FC<DateLockScreenProps> = ({ onUnlockBypass }) => {
  const targetDate = new Date('2026-08-01T00:00:00'); // August 1st, 2026
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isLocked: true,
  });

  const [tapCount, setTapCount] = useState(0);
  const [showBypassInput, setShowBypassInput] = useState(false);
  const [bypassCode, setBypassCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isLocked: false });
        onUnlockBypass(); // Auto-unlock if date is passed
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds, isLocked: true });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [onUnlockBypass]);

  const handleLockTap = () => {
    const newCount = tapCount + 1;
    setTapCount(newCount);
    if (newCount >= 5) {
      setShowBypassInput(true);
      setTapCount(0);
    }
  };

  const handleBypassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (bypassCode.trim().toLowerCase() === 'love') {
      onUnlockBypass();
    } else {
      setErrorMsg('Incorrect key. Try again ❤️');
      setTimeout(() => setErrorMsg(''), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-tr from-[#140817] via-[#240b1e] to-[#080b1e] text-white px-4 text-center overflow-hidden">
      {/* Background stars / ambient light */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-amber-200 rounded-full animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 bg-rose-400 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-pink-300 rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-amber-300 rounded-full animate-ping" style={{ animationDuration: '4s' }} />
      </div>

      <div className="absolute w-96 h-96 rounded-full bg-rose-500/5 pointer-events-none filter blur-3xl animate-pulse" />

      {/* Main Locked Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-2xl relative z-10"
      >
        {/* Lock Graphic */}
        <div className="flex justify-center mb-6">
          <motion.button
            onClick={handleLockTap}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-rose-500/20 to-amber-500/20 border border-rose-300/30 flex items-center justify-center relative cursor-pointer"
          >
            <motion.div
              animate={{ rotate: [0, -5, 5, -5, 5, 0] }}
              transition={{ repeat: Infinity, duration: 4, repeatDelay: 2 }}
            >
              <Lock className="w-8 h-8 text-rose-400 fill-rose-400/10" />
            </motion.div>
            <div className="absolute inset-0 rounded-full border border-dashed border-rose-400/20 animate-spin-slow" />
          </motion.button>
        </div>

        {/* Title */}
        <h1 className="font-cinzel text-xl sm:text-2xl font-bold tracking-widest text-gold-gradient mb-2">
          A SURPRISE IN BLOOM
        </h1>
        <p className="font-serif-cormorant text-rose-100/70 italic text-sm sm:text-base mb-6">
          Your special Girlfriend's Day gift is carefully sealed until August 1st...
        </p>

        {/* Countdown Grid */}
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[
            { label: 'Days', value: timeLeft.days },
            { label: 'Hours', value: timeLeft.hours },
            { label: 'Mins', value: timeLeft.minutes },
            { label: 'Secs', value: timeLeft.seconds },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/5 rounded-xl py-3 px-1 sm:p-3 flex flex-col items-center justify-center shadow-inner"
            >
              <span className="font-display text-2xl sm:text-3xl font-extrabold text-amber-200">
                {String(item.value).padStart(2, '0')}
              </span>
              <span className="text-[10px] sm:text-xs text-rose-200/50 uppercase tracking-widest font-semibold mt-1">
                {item.label}
              </span>
            </div>
          ))}
        </div>

        {/* Secret Bypass Code Input or Prompt */}
        <div className="min-h-[60px] flex items-center justify-center">
          {showBypassInput ? (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleBypassSubmit}
              className="w-full space-y-3"
            >
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter secret word..."
                  value={bypassCode}
                  onChange={(e) => setBypassCode(e.target.value)}
                  className="w-full bg-slate-950/60 border border-rose-300/30 rounded-lg py-2 px-4 text-center text-sm font-medium tracking-wider focus:outline-none focus:ring-1 focus:ring-rose-400 text-rose-100"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-lg py-1.5 text-xs font-bold tracking-widest uppercase hover:brightness-110 active:scale-[0.98] transition-all"
              >
                UNSEAL SURPRISE
              </button>
              {errorMsg && (
                <p className="text-xs text-rose-400 font-medium italic animate-pulse">
                  {errorMsg}
                </p>
              )}
            </motion.form>
          ) : (
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 text-rose-300/40 text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>August 1, 2026</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
