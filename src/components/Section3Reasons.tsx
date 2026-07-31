import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, X, CheckCircle2, ArrowRight } from 'lucide-react';
import { LoveReason } from '../types';
import { audioEngine } from '../audio/AudioEngine';

interface Section3ReasonsProps {
  reasons: LoveReason[];
  unlockedIds: number[];
  onReasonClick: (id: number) => void;
  onAllCompleted: () => void;
}

export const Section3Reasons: React.FC<Section3ReasonsProps> = ({
  reasons,
  unlockedIds,
  onReasonClick,
  onAllCompleted,
}) => {
  const [selectedReason, setSelectedReason] = useState<LoveReason | null>(null);

  const isAllUnlocked = unlockedIds.length === reasons.length;

  const handleFlowerClick = (reason: LoveReason) => {
    audioEngine.playBloomSound();
    onReasonClick(reason.id);
    setSelectedReason(reason);
  };

  // SVG Flower rendering helper based on flowerType
  const renderFlowerSvg = (type: LoveReason['flowerType'], isUnlocked: boolean) => {
    switch (type) {
      case 'rose':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg">
            {/* Stem */}
            <path d="M50 60 Q48 80 50 100" stroke="#4A7C59" strokeWidth="3" fill="none" />
            <path d="M50 75 Q35 70 42 62" stroke="#4A7C59" strokeWidth="2.5" fill="#4A7C59" />
            {/* Outer Petals */}
            <path
              d="M50 25 C30 25 25 45 35 58 C45 68 55 68 65 58 C75 45 70 25 50 25 Z"
              fill={isUnlocked ? '#E8A598' : '#B76E79'}
              className="transition-colors duration-500"
            />
            {/* Layered Petals */}
            <circle cx="50" cy="42" r="14" fill={isUnlocked ? '#FFB7C5' : '#8B3A4A'} />
            <path d="M44 42 Q50 32 56 42 Q50 52 44 42" fill="#FFFDF7" opacity="0.8" />
          </svg>
        );

      case 'sakura':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg">
            <path d="M50 60 Q52 80 50 100" stroke="#4A7C59" strokeWidth="3" fill="none" />
            {Array.from({ length: 5 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 72} 50 45)`}>
                <path
                  d="M50 45 C42 20 58 20 50 45"
                  fill={isUnlocked ? '#FFB7C5' : '#E8A598'}
                  stroke="#FFFDF7"
                  strokeWidth="1"
                />
              </g>
            ))}
            <circle cx="50" cy="45" r="6" fill="#D4AF37" />
          </svg>
        );

      case 'lotus':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg">
            <path d="M50 60 Q48 80 50 100" stroke="#4A7C59" strokeWidth="3" fill="none" />
            <path d="M25 55 Q50 20 75 55 Z" fill={isUnlocked ? '#FFB7C5' : '#B76E79'} />
            <path d="M35 55 Q50 25 65 55 Z" fill={isUnlocked ? '#FFFDF7' : '#FDF8F0'} />
            <circle cx="50" cy="50" r="5" fill="#D4AF37" />
          </svg>
        );

      case 'sunflower':
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg">
            <path d="M50 60 Q52 80 50 100" stroke="#4A7C59" strokeWidth="3" fill="none" />
            {Array.from({ length: 12 }).map((_, i) => (
              <g key={i} transform={`rotate(${i * 30} 50 45)`}>
                <ellipse cx="50" cy="28" rx="4" ry="12" fill={isUnlocked ? '#D4AF37' : '#C59B27'} />
              </g>
            ))}
            <circle cx="50" cy="45" r="12" fill="#4A2E1A" />
          </svg>
        );

      default: // Tulip / Lily / Jasmine / Peony
        return (
          <svg viewBox="0 0 100 100" className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-lg">
            <path d="M50 60 Q50 80 50 100" stroke="#4A7C59" strokeWidth="3" fill="none" />
            <path
              d="M32 58 C30 35 42 22 50 22 C58 22 70 35 68 58 C60 62 40 62 32 58 Z"
              fill={isUnlocked ? '#FDF8F0' : '#E8A598'}
            />
            <circle cx="50" cy="40" r="7" fill={isUnlocked ? '#FFB7C5' : '#D4AF37'} />
          </svg>
        );
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-between px-3.5 sm:px-6 pt-20 pb-12 sm:py-16 text-center z-10 overflow-hidden">
      {/* Top Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-xl w-full mx-auto space-y-2.5 sm:space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-300/20 text-rose-200 text-xs sm:text-sm font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Interactive Floral Garden</span>
        </div>

        <h2 className="font-cinzel text-2xl sm:text-4xl md:text-5xl text-gold-gradient font-bold tracking-wide">
          10 Reasons I Love You ❤️
        </h2>

        <p className="font-serif-cormorant text-base sm:text-xl text-rose-100/90 italic font-medium px-2">
          Tap each swaying flower to unlock a blooming reason from my heart.
        </p>

        {/* Progress tracker */}
        <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full bg-slate-900/60 border border-amber-200/20 text-amber-200 text-xs font-medium mt-1">
          <span>
            {unlockedIds.length} of {reasons.length} Reasons Unlocked 🌸
          </span>
          <div className="w-20 sm:w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-amber-300 transition-all duration-500"
              style={{ width: `${(unlockedIds.length / reasons.length) * 100}%` }}
            />
          </div>
        </div>
      </motion.div>

      {/* Swaying Flower Garden Grid */}
      <div className="w-full max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-6 my-6 sm:my-8 px-1">
        {reasons.map((reason, index) => {
          const isUnlocked = unlockedIds.includes(reason.id);

          return (
            <motion.div
              key={reason.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className="relative flex flex-col items-center"
            >
              <button
                onClick={() => handleFlowerClick(reason)}
                id={`flower-button-${reason.id}`}
                className="relative z-20 card-hover-premium group flex flex-col items-center p-3 sm:p-4 rounded-3xl glass-card hover:border-amber-300/40 transition-all duration-300 active:scale-95 cursor-pointer w-full h-full min-h-[145px] sm:min-h-[160px] justify-between overflow-hidden"
              >
                <div className="animate-shimmer-sheen opacity-40" />
                {/* Unlocked indicator badge */}
                {isUnlocked && (
                  <span className="absolute top-2 right-2 text-emerald-400 bg-emerald-950/60 p-1 rounded-full border border-emerald-400/30">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                )}

                {/* Swaying Flower SVG */}
                <div
                  className={`relative transform origin-bottom transition-transform duration-300 group-hover:scale-110 ${
                    index % 2 === 0 ? 'animate-float-slow' : 'animate-pulse'
                  }`}
                >
                  {renderFlowerSvg(reason.flowerType, isUnlocked)}
                </div>

                <div className="mt-2 text-center">
                  <span className="text-xs font-serif-cormorant font-semibold text-amber-100 block">
                    Reason #{reason.id}
                  </span>
                  <span className="text-[11px] text-rose-200/70 truncate block max-w-[100px]">
                    {isUnlocked ? reason.title : 'Tap to Bloom 🌸'}
                  </span>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Final transition trigger button once all 10 flowers unlocked */}
      {isAllUnlocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="my-4"
        >
          <button
            onClick={onAllCompleted}
            id="continue-to-songs-button"
            className="relative z-20 premium-button group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 text-slate-950 font-semibold text-base sm:text-lg shadow-2xl transition-all cursor-pointer overflow-hidden"
          >
            <div className="animate-shimmer-sheen" />
            <span>Listen To Our Songs ❤️</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      )}

      {/* Flower Reason Detail Modal */}
      <AnimatePresence>
        {selectedReason && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md w-full glass-card p-6 sm:p-8 rounded-3xl relative border border-amber-300/30 shadow-2xl text-center"
            >
              <button
                onClick={() => setSelectedReason(null)}
                id="close-reason-modal"
                className="absolute top-4 right-4 p-2 rounded-full bg-slate-800/60 hover:bg-slate-700/80 text-rose-200 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/20 border border-amber-300/30 flex items-center justify-center shadow-lg">
                <span className="text-3xl">🌸</span>
              </div>

              <span className="font-serif-cormorant text-sm uppercase tracking-widest text-amber-300 font-semibold">
                Reason #{selectedReason.id}
              </span>

              <h3 className="font-cinzel text-2xl sm:text-3xl text-gold-gradient font-bold mt-1 mb-4">
                {selectedReason.title}
              </h3>

              <div className="p-4 sm:p-5 rounded-2xl bg-slate-950/60 border border-rose-300/15 mb-6 text-left">
                <p className="font-serif-cormorant text-xl sm:text-2xl text-rose-100/95 leading-relaxed italic font-medium">
                  "{selectedReason.reason}"
                </p>
              </div>

              <button
                onClick={() => setSelectedReason(null)}
                id="keep-blooming-button"
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-semibold text-base shadow-lg hover:brightness-110 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Heart className="w-4 h-4 fill-slate-950/30" />
                <span>Keep Blooming ❤️</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
