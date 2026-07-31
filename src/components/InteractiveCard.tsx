import React, { useState, useEffect, useRef } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'motion/react';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: 'subtle' | 'medium' | 'deep';
  enableTilt?: boolean;
}

/**
 * InteractiveCard
 * Adds subtle, elegant 3D tilt and floating parallax that reacts to:
 * - Mouse movement on desktop
 * - Touch & gyroscope device tilt on mobile phones (where it will be majorly viewed)
 */
export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  depth = 'medium',
  enableTilt = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Motion values for smooth parallax tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring physics for ultra-smooth, luxurious easing (never jittery)
  const springConfig = { damping: 25, stiffness: 180, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Max rotation angle based on depth setting
  const maxAngle = depth === 'subtle' ? 2 : depth === 'medium' ? 4 : 6;

  const rotateX = useTransform(smoothY, [-1, 1], [maxAngle, -maxAngle]);
  const rotateY = useTransform(smoothX, [-1, 1], [-maxAngle, maxAngle]);
  const translateZ = useTransform(smoothY, [-1, 0, 1], [5, 12, 5]);

  useEffect(() => {
    // Check if touch / phone device
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();

    // On mobile phone: listen to device orientation for subtle physical tilt
    if (enableTilt && 'DeviceOrientationEvent' in window) {
      const handleOrientation = (e: DeviceOrientationEvent) => {
        if (e.gamma !== null && e.beta !== null) {
          // Normalize gamma (-30 to 30 deg) -> [-1, 1]
          const normX = Math.max(-1, Math.min(1, (e.gamma || 0) / 30));
          // Normalize beta around holding angle of 45 deg -> [-1, 1]
          const normY = Math.max(-1, Math.min(1, ((e.beta || 45) - 45) / 30));
          mouseX.set(normX);
          mouseY.set(normY);
        }
      };

      window.addEventListener('deviceorientation', handleOrientation, { passive: true });
      return () => {
        window.removeEventListener('deviceorientation', handleOrientation);
      };
    }
  }, [enableTilt, mouseX, mouseY]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !enableTilt) return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Calculate mouse position relative to center of card (-1 to 1)
    const width = rect.width;
    const height = rect.height;
    const x = (e.clientX - rect.left - width / 2) / (width / 2);
    const y = (e.clientY - rect.top - height / 2) / (height / 2);

    mouseX.set(Math.max(-1, Math.min(1, x)));
    mouseY.set(Math.max(-1, Math.min(1, y)));
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX: enableTilt ? rotateX : 0,
        rotateY: enableTilt ? rotateY : 0,
        translateZ: enableTilt ? translateZ : 0,
        transformStyle: 'preserve-3d',
      }}
      className={`relative transition-shadow duration-500 will-change-transform ${className}`}
    >
      {/* Dynamic ambient rose-gold shimmer light-sheen on hover/tilt */}
      <motion.div
        style={{
          opacity: useTransform(smoothX, [-1, 0, 1], [0.15, 0.05, 0.15]),
          background: 'radial-gradient(circle at 50% 0%, rgba(255, 230, 210, 0.25), transparent 70%)',
        }}
        className="absolute inset-0 rounded-inherit pointer-events-none z-10"
      />
      {children}
    </motion.div>
  );
};
