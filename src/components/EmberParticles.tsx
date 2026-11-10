import React, { useEffect, useRef } from 'react';

interface EmberParticlesProps {
  intensity?: 'low' | 'medium' | 'high';
  reducedMotion?: boolean;
}

export const EmberParticles: React.FC<EmberParticlesProps> = ({ 
  intensity = 'medium',
  reducedMotion = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particleCount = intensity === 'low' ? 35 : intensity === 'high' ? 85 : 55;

    interface Particle {
      x: number;
      y: number;
      radius: number;
      speedY: number;
      speedX: number;
      opacity: number;
      baseOpacity: number;
      flickerSpeed: number;
      color: string;
      sizeVariation: number;
    }

    const colors = [
      'rgba(255, 94, 26, ',   // warm ember orange
      'rgba(230, 34, 56, ',   // deep crimson
      'rgba(255, 170, 50, ',  // gold spark
      'rgba(180, 20, 30, '    // dark ash red
    ];

    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2.2 + 0.8,
      speedY: -(Math.random() * 0.9 + 0.3),
      speedX: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      baseOpacity: Math.random() * 0.6 + 0.3,
      flickerSpeed: Math.random() * 0.04 + 0.01,
      color: colors[Math.floor(Math.random() * colors.length)],
      sizeVariation: Math.random() * Math.PI * 2
    }));

    let tick = 0;
    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX + Math.sin(tick * 0.02 + p.y * 0.01) * 0.3;
        p.sizeVariation += p.flickerSpeed;
        const currentOpacity = Math.max(0.05, p.baseOpacity + Math.sin(p.sizeVariation) * 0.25);

        // Reset if went above screen
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        const rad = p.radius + Math.sin(p.sizeVariation) * 0.4;
        ctx.arc(p.x, p.y, Math.max(0.5, rad), 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${currentOpacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'rgba(255, 94, 26, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [intensity, reducedMotion]);

  if (reducedMotion) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.85
      }}
      aria-hidden="true"
    />
  );
};
