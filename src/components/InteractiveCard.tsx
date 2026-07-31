import React from 'react';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  depth?: 'subtle' | 'medium' | 'deep';
  enableTilt?: boolean;
}

/**
 * InteractiveCard
 * Clean 2D container with subtle ambient sheen without 3D transforms
 * ensuring 100% reliable button click/touch hit testing across all mobile and desktop browsers.
 */
export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={`relative transition-shadow duration-500 ${className}`}>
      {/* Subtle ambient rose-gold shimmer backdrop */}
      <div
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255, 230, 210, 0.12), transparent 70%)',
        }}
        className="absolute inset-0 rounded-inherit pointer-events-none z-0"
      />
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

