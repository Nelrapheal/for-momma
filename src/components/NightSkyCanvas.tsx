import React, { useEffect, useRef } from 'react';

interface NightSkyCanvasProps {
  themeMode?: 'night' | 'sunset' | 'dawn';
}

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
}

interface Petal {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  rotation: number;
  vRot: number;
  colorPrefix: string;
  alpha: number;
  oscillation: number;
}

export const NightSkyCanvas: React.FC<NightSkyCanvasProps> = ({ themeMode = 'night' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Cached gradients
    let bgGrad: CanvasGradient;
    let glowGrad: CanvasGradient;

    const updateGradients = () => {
      if (themeMode === 'sunset') {
        bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#1E1233');
        bgGrad.addColorStop(0.5, '#3D1C38');
        bgGrad.addColorStop(0.8, '#6B2B43');
        bgGrad.addColorStop(1, '#A04A50');
      } else {
        bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, '#070A1A');
        bgGrad.addColorStop(0.6, '#0B1026');
        bgGrad.addColorStop(1, '#131A3A');
      }

      glowGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.4,
        20,
        width * 0.5,
        height * 0.4,
        Math.max(width, height) * 0.6
      );
      glowGrad.addColorStop(0, 'rgba(232, 165, 152, 0.08)');
      glowGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.03)');
      glowGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    };

    updateGradients();

    // Cap star count for 60fps mobile performance
    const isMobile = width < 640;
    const starCount = isMobile ? 50 : Math.min(120, Math.floor((width * height) / 10000) + 40);
    const stars: Star[] = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.4,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: (Math.random() * 0.012 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
    }));

    // Petals setup
    const petalColorPrefixes = [
      'rgba(255, 183, 197,', // Sakura pink
      'rgba(232, 165, 152,', // Rose gold
      'rgba(245, 208, 169,', // Warm gold
      'rgba(253, 248, 240,', // Soft white
    ];

    const petalCount = isMobile ? 12 : Math.min(35, Math.floor(width / 50) + 10);
    const petals: Petal[] = Array.from({ length: petalCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 7 + 5,
      vx: Math.random() * 0.5 + 0.2,
      vy: Math.random() * 0.7 + 0.3,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.015,
      colorPrefix: petalColorPrefixes[Math.floor(Math.random() * petalColorPrefixes.length)],
      alpha: Math.random() * 0.6 + 0.3,
      oscillation: Math.random() * Math.PI * 2,
    }));

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      updateGradients();
    };

    window.addEventListener('resize', handleResize);

    // Interactive 3D Parallax state for smooth mouse & mobile gyroscope tilt
    let targetPx = 0;
    let targetPy = 0;
    let currentPx = 0;
    let currentPy = 0;

    // Device orientation (mobile phone tilt) listener
    const handleDeviceOrientation = (e: DeviceOrientationEvent) => {
      if (e.gamma !== null && e.beta !== null) {
        // gamma is left/right tilt (-90 to 90), beta is front/back tilt (-180 to 180)
        targetPx = Math.max(-35, Math.min(35, (e.gamma || 0) * 1.2));
        // Neutral holding angle around 45 degrees
        targetPy = Math.max(-35, Math.min(35, ((e.beta || 45) - 45) * 1.2));
      }
    };

    window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });

    // Spawn petal & calculate parallax on touch/pointer move (desktop & touch screens)
    let lastPointerTime = 0;
    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = performance.now();
      const clientX = 'touches' in e ? e.touches[0]?.clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0]?.clientY : e.clientY;
      if (clientX === undefined || clientY === undefined) return;

      // Parallax target from pointer center offset
      targetPx = ((clientX / width) - 0.5) * 35;
      targetPy = ((clientY / height) - 0.5) * 35;

      if (now - lastPointerTime < 80) return; // throttle particle spawn
      lastPointerTime = now;

      petals.push({
        x: clientX + (Math.random() - 0.5) * 15,
        y: clientY + (Math.random() - 0.5) * 15,
        size: Math.random() * 8 + 5,
        vx: (Math.random() - 0.5) * 1.2,
        vy: Math.random() * 0.7 + 0.3,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.03,
        colorPrefix: petalColorPrefixes[Math.floor(Math.random() * petalColorPrefixes.length)],
        alpha: 0.8,
        oscillation: Math.random() * Math.PI * 2,
      });
      if (petals.length > petalCount + 15) petals.shift();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const drawPetal = (
      pCtx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      colorPrefix: string,
      alpha: number
    ) => {
      pCtx.save();
      pCtx.translate(x, y);
      pCtx.rotate(rotation);
      pCtx.beginPath();
      pCtx.fillStyle = `${colorPrefix}${alpha})`;
      pCtx.moveTo(0, 0);
      pCtx.bezierCurveTo(size * 0.5, -size * 0.5, size, -size * 0.25, size, size * 0.5);
      pCtx.bezierCurveTo(size * 0.5, size, 0, size * 0.5, 0, 0);
      pCtx.fill();
      pCtx.restore();
    };

    const render = () => {
      // Smoothly interpolate parallax offsets (spring damping)
      currentPx += (targetPx - currentPx) * 0.06;
      currentPy += (targetPy - currentPy) * 0.06;

      // Background
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Ambient radial glow with subtle parallax shift
      ctx.save();
      ctx.translate(currentPx * 0.4, currentPy * 0.4);
      ctx.fillStyle = glowGrad;
      ctx.fillRect(-50, -50, width + 100, height + 100);
      ctx.restore();

      // Render twinkling stars with multi-depth parallax
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i];
        star.alpha += star.twinkleSpeed;
        if (star.alpha > 0.9 || star.alpha < 0.2) {
          star.twinkleSpeed = -star.twinkleSpeed;
        }

        // Depth modifier based on star size (larger stars = closer = more movement)
        const depth = star.size * 0.7;
        const drawX = star.x + currentPx * depth;
        const drawY = star.y + currentPy * depth;

        ctx.beginPath();
        ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 253, 247, ${star.alpha.toFixed(2)})`;
        ctx.fill();
      }

      // Render floating petals with parallax sway
      for (let i = 0; i < petals.length; i++) {
        const petal = petals[i];
        petal.oscillation += 0.015;
        petal.x += petal.vx + Math.sin(petal.oscillation) * 0.5;
        petal.y += petal.vy;
        petal.rotation += petal.vRot;

        if (petal.y > height + 20) {
          petal.y = -20;
          petal.x = Math.random() * width;
        }
        if (petal.x > width + 20) {
          petal.x = -20;
        }

        drawPetal(
          ctx,
          petal.x + currentPx * 1.2,
          petal.y + currentPy * 1.2,
          petal.size,
          petal.rotation,
          petal.colorPrefix,
          petal.alpha
        );
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [themeMode]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-700 will-change-transform"
    />
  );
};

