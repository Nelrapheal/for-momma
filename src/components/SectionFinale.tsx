import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../audio/AudioEngine';
import { InteractiveCard } from './InteractiveCard';

const safeConfetti = confetti.create(undefined, {
  resize: true,
  useWorker: false,
});

interface SectionFinaleProps {
  nickname: string;
}

export const SectionFinale: React.FC<SectionFinaleProps> = ({ nickname }) => {
  const [kissCount, setKissCount] = useState(0);
  const bfPhone = '+2347067905508';

  const getKissMessage = () => {
    return `Hey my love! ❤️ I just finished my Girlfriend's Day surprise and I'm sending you ${kissCount} big kiss${
      kissCount > 1 ? 'es' : ''
    } back! 💋💋💋 Forever yours! ❤️`;
  };

  const handleSendWhatsApp = () => {
    const message = encodeURIComponent(getKissMessage());
    const cleanPhone = bfPhone.replace(/[^0-9]/g, '');
    const url = cleanPhone
      ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${message}`
      : `https://api.whatsapp.com/send?text=${message}`;
    window.open(url, '_blank');
  };

  const handleSendKiss = () => {
    setKissCount((prev) => prev + 1);
    audioEngine.playBloomSound();
    safeConfetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 },
      colors: ['#E8A598', '#FFB7C5', '#F43F5E', '#FFFDF7'],
    });
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-3.5 sm:px-6 pt-20 pb-12 sm:py-16 text-center z-20 overflow-hidden">
      {/* Edge Flowers Frame Overlay (Flowers growing from edges) */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {/* Top left corner bloom */}
        <div className="absolute -top-6 -left-6 sm:-top-10 sm:-left-10 text-5xl sm:text-8xl opacity-80 animate-float-slow transform -rotate-12">
          🌸
        </div>
        <div className="absolute top-2 left-10 sm:top-4 sm:left-16 text-3xl sm:text-6xl opacity-70 animate-pulse">
          🌹
        </div>

        {/* Top right corner bloom */}
        <div className="absolute -top-6 -right-6 sm:-top-10 sm:-right-10 text-5xl sm:text-8xl opacity-80 animate-float-slow transform rotate-12">
          🌸
        </div>
        <div className="absolute top-2 right-10 sm:top-4 sm:right-16 text-3xl sm:text-6xl opacity-70 animate-pulse">
          🌺
        </div>

        {/* Bottom left corner bloom */}
        <div className="absolute -bottom-6 -left-6 sm:-bottom-10 sm:-left-10 text-5xl sm:text-8xl opacity-80 animate-float-slow transform rotate-45">
          🌺
        </div>
        <div className="absolute bottom-4 left-12 sm:bottom-6 sm:left-20 text-3xl sm:text-6xl opacity-70 animate-pulse">
          🌸
        </div>

        {/* Bottom right corner bloom */}
        <div className="absolute -bottom-6 -right-6 sm:-bottom-10 sm:-right-10 text-5xl sm:text-8xl opacity-80 animate-float-slow transform -rotate-45">
          🌸
        </div>
        <div className="absolute bottom-4 right-12 sm:bottom-6 sm:right-20 text-3xl sm:text-6xl opacity-70 animate-pulse">
          🌹
        </div>
      </div>

      {/* Center Final Message */}
      <InteractiveCard depth="medium" className="max-w-xl w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card p-6 sm:p-12 rounded-3xl relative overflow-hidden border border-amber-300/30 shadow-2xl space-y-5 sm:space-y-6"
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-tr from-rose-500/30 to-amber-300/30 border border-amber-300/40 flex items-center justify-center shadow-2xl animate-pulse">
            <Heart className="w-10 h-10 text-rose-300 fill-rose-300/40" />
          </div>

          <h1 className="font-cinzel text-3xl sm:text-5xl md:text-6xl text-gold-gradient font-bold tracking-wide leading-tight">
            Happy Girlfriend's Day, {nickname} ❤️
          </h1>

          <p className="font-serif-cormorant text-xl sm:text-3xl text-rose-100/95 leading-relaxed italic max-w-md mx-auto font-medium">
            Thank you for taking this little journey through my heart.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3 text-amber-200">
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span className="font-signature text-3xl sm:text-4xl text-rose-200">Forever Yours</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          </div>

          {/* Interactive touch button for phone */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleSendKiss}
              id="send-kiss-button"
              className="premium-button group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-slate-950 font-semibold text-base shadow-xl transition-all cursor-pointer overflow-hidden"
            >
              <div className="animate-shimmer-sheen" />
              <span>Send a Kiss Back 💋</span>
              {kissCount > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-slate-950/20 text-xs font-bold">
                  {kissCount}
                </span>
              )}
            </button>
          </div>

          {/* Slide-in Kiss Delivery Card */}
          <AnimatePresence>
            {kissCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 15 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="pt-6 border-t border-amber-300/20 space-y-4"
              >
                <div className="space-y-1">
                  <p className="font-serif-cormorant text-xl sm:text-2xl text-amber-100 font-medium italic">
                    Deliver your {kissCount} kiss{kissCount > 1 ? 'es' : ''} to him right now! 💌
                  </p>
                  <p className="text-sm text-rose-200/80 italic">
                    (Keep clicking the button above to send as many kisses as you want! 💋💋)
                  </p>
                </div>

                <div className="flex items-center justify-center pt-1">
                  <button
                    onClick={handleSendWhatsApp}
                    id="send-whatsapp-kiss"
                    className="premium-button group relative inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base sm:text-lg shadow-xl transition-all cursor-pointer overflow-hidden"
                  >
                    <div className="animate-shimmer-sheen" />
                    <MessageCircle className="w-5 h-5" />
                    <span>WhatsApp Him My Kisses 💋</span>
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
