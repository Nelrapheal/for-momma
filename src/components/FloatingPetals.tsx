import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface PetalConfig {
  id: number;
  left: number; // percentage
  size: number; // px
  duration: number; // seconds
  delay: number; // seconds
  swayAmount: number; // px
  rotationDirection: number; // 1 or -1
  petalType: 'rose' | 'sakura' | 'heart' | 'golden';
  opacity: number;
}

export const FloatingPetals: React.FC = () => {
  // Generate an optimized set of organic floating petals for smooth mobile 60fps
  const petals = useMemo<PetalConfig[]>(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const count = isMobile ? 12 : 20;
    const types: PetalConfig['petalType'][] = ['rose', 'sakura', 'rose', 'golden', 'heart'];
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 96 + 2, // 2% to 98%
      size: Math.floor(Math.random() * 14) + 14, // 14px - 28px
      duration: Math.random() * 8 + 14, // 14s - 22s for gentle slow drift
      delay: Math.random() * -15, // negative delay so screen is immediately filled on load
      swayAmount: Math.random() * 30 + 15, // 15px - 45px horizontal sway
      rotationDirection: Math.random() > 0.5 ? 1 : -1,
      petalType: types[i % types.length],
      opacity: Math.random() * 0.35 + 0.55, // 0.55 - 0.90 opacity
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 select-none">
      {petals.map((petal) => {
        return (
          <motion.div
            key={petal.id}
            initial={{
              y: '-10vh',
              x: 0,
              rotate: 0,
              opacity: petal.opacity,
            }}
            animate={{
              y: '108vh',
              x: [
                0,
                petal.swayAmount,
                -petal.swayAmount * 0.7,
                petal.swayAmount * 0.5,
                0,
              ],
              rotate: [0, 180 * petal.rotationDirection, 360 * petal.rotationDirection],
            }}
            transition={{
              y: {
                duration: petal.duration,
                repeat: Infinity,
                ease: 'linear',
                delay: petal.delay,
              },
              x: {
                duration: petal.duration * 0.8,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
                delay: petal.delay,
              },
              rotate: {
                duration: petal.duration * 0.9,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: petal.delay,
              },
            }}
            style={{
              position: 'absolute',
              left: `${petal.left}%`,
              width: `${petal.size}px`,
              height: `${petal.size * 1.3}px`,
            }}
            className="will-change-transform filter drop-shadow-[0_2px_8px_rgba(232,165,152,0.3)]"
          >
            {/* Organic SVG Petal Shapes */}
            {petal.petalType === 'sakura' && (
              <svg viewBox="0 0 30 40" className="w-full h-full transform fill-current">
                <defs>
                  <linearGradient id={`grad-sakura-${petal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFC0CB" stopOpacity="0.95" />
                    <stop offset="60%" stopColor="#E8A598" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#B76E79" stopOpacity="0.75" />
                  </linearGradient>
                </defs>
                <path
                  d="M15,0 C22,8 30,15 28,27 C26,36 18,40 15,40 C12,40 4,36 2,27 C0,15 8,8 15,0 Z"
                  fill={`url(#grad-sakura-${petal.id})`}
                />
              </svg>
            )}

            {petal.petalType === 'rose' && (
              <svg viewBox="0 0 30 40" className="w-full h-full transform fill-current">
                <defs>
                  <linearGradient id={`grad-rose-${petal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFB7C5" stopOpacity="0.95" />
                    <stop offset="50%" stopColor="#F472B6" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#E11D48" stopOpacity="0.80" />
                  </linearGradient>
                </defs>
                <path
                  d="M15,2 C25,2 30,12 28,26 C26,37 18,39 15,39 C12,39 4,37 2,26 C0,12 5,2 15,2 Z"
                  fill={`url(#grad-rose-${petal.id})`}
                />
              </svg>
            )}

            {petal.petalType === 'golden' && (
              <svg viewBox="0 0 30 40" className="w-full h-full transform fill-current">
                <defs>
                  <linearGradient id={`grad-gold-${petal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.9" />
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#D97706" stopOpacity="0.7" />
                  </linearGradient>
                </defs>
                <path
                  d="M15,0 C24,6 29,18 26,29 C23,38 17,40 15,40 C13,40 7,38 4,29 C1,18 6,6 15,0 Z"
                  fill={`url(#grad-gold-${petal.id})`}
                />
              </svg>
            )}

            {petal.petalType === 'heart' && (
              <svg viewBox="0 0 30 35" className="w-full h-full transform fill-current">
                <defs>
                  <linearGradient id={`grad-heart-${petal.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FECDD3" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#FB7185" stopOpacity="0.8" />
                  </linearGradient>
                </defs>
                <path
                  d="M15,30 C15,30 2,20 2,11 C2,5 6,2 11,2 C13.5,2 15,3.5 15,3.5 C15,3.5 16.5,2 19,2 C24,2 28,5 28,11 C28,20 15,30 15,30 Z"
                  fill={`url(#grad-heart-${petal.id})`}
                />
              </svg>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};
