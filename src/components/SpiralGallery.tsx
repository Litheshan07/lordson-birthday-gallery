import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { GalleryAsset } from '../types';
import { Play, RotateCw, Pause, ArrowUp, ArrowDown, Hand } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface SpiralGalleryProps {
  assets: GalleryAsset[];
  onSelectAsset: (asset: GalleryAsset) => void;
  reducedMotion: boolean;
}

export const SpiralGallery: React.FC<SpiralGalleryProps> = ({
  assets,
  onSelectAsset,
  reducedMotion
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Spiral geometry parameters
  const [dimensions, setDimensions] = useState({
    radius: 340,
    yStep: 78,
    cardWidth: 155,
    cardHeight: 235,
    angleStep: 36, // degrees per item (~10 items per 360° turn)
    perspective: 1200
  });

  // Track responsive sizing
  useEffect(() => {
    const updateDimensions = () => {
      const w = window.innerWidth;
      if (w < 480) {
        setDimensions({
          radius: 200,
          yStep: 60,
          cardWidth: 120,
          cardHeight: 180,
          angleStep: 40,
          perspective: 800
        });
      } else if (w < 768) {
        setDimensions({
          radius: 260,
          yStep: 68,
          cardWidth: 135,
          cardHeight: 205,
          angleStep: 38,
          perspective: 1000
        });
      } else if (w < 1200) {
        setDimensions({
          radius: 320,
          yStep: 76,
          cardWidth: 150,
          cardHeight: 225,
          angleStep: 36,
          perspective: 1200
        });
      } else {
        setDimensions({
          radius: 380,
          yStep: 82,
          cardWidth: 165,
          cardHeight: 250,
          angleStep: 34,
          perspective: 1400
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Motion states
  const [rotationY, setRotationY] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isAutoSpinning, setIsAutoSpinning] = useState(!reducedMotion);
  const [isInteracting, setIsInteracting] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Dragging / inertia physics refs
  const isDraggingRef = useRef(false);
  const lastPointerRef = useRef({ x: 0, y: 0, time: 0 });
  const velocityRef = useRef({ rotY: 0, transY: 0 });
  const animFrameRef = useRef<number | null>(null);
  const stateRef = useRef({ rotationY: 0, translateY: 0, isAutoSpinning: !reducedMotion, isInteracting: false });

  // Sync ref with state
  useEffect(() => {
    stateRef.current = {
      rotationY,
      translateY,
      isAutoSpinning,
      isInteracting
    };
  }, [rotationY, translateY, isAutoSpinning, isInteracting]);

  // Center vertical range
  const totalHeight = (assets.length - 1) * dimensions.yStep;
  const minTranslateY = -totalHeight * 0.85;
  const maxTranslateY = totalHeight * 0.15;

  // Animation Loop (Auto-spin & Inertia)
  useEffect(() => {
    let lastTimestamp = performance.now();

    const loop = (timestamp: number) => {
      const dt = Math.min((timestamp - lastTimestamp) / 1000, 0.1);
      lastTimestamp = timestamp;

      let nextRot = stateRef.current.rotationY;
      let nextTrans = stateRef.current.translateY;

      if (!isDraggingRef.current) {
        // Apply inertia if there's velocity
        if (Math.abs(velocityRef.current.rotY) > 0.05 || Math.abs(velocityRef.current.transY) > 0.5) {
          nextRot += velocityRef.current.rotY;
          nextTrans += velocityRef.current.transY;

          // Friction decay
          velocityRef.current.rotY *= 0.92;
          velocityRef.current.transY *= 0.92;
        } else if (stateRef.current.isAutoSpinning && !stateRef.current.isInteracting && !reducedMotion) {
          // Gentle idle drift
          nextRot -= 12 * dt; // ~12 degrees per second
        }

        // Soft clamp vertical bounds
        if (nextTrans < minTranslateY) {
          nextTrans += (minTranslateY - nextTrans) * 0.1;
          velocityRef.current.transY = 0;
        } else if (nextTrans > maxTranslateY) {
          nextTrans += (maxTranslateY - nextTrans) * 0.1;
          velocityRef.current.transY = 0;
        }

        if (nextRot !== stateRef.current.rotationY || nextTrans !== stateRef.current.translateY) {
          setRotationY(nextRot);
          setTranslateY(nextTrans);
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [dimensions.yStep, assets.length, minTranslateY, maxTranslateY, reducedMotion]);

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent) => {
    isDraggingRef.current = true;
    setIsInteracting(true);
    velocityRef.current = { rotY: 0, transY: 0 };
    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: performance.now() };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;

    const now = performance.now();
    const dt = Math.max((now - lastPointerRef.current.time) / 1000, 0.001);
    const dx = e.clientX - lastPointerRef.current.x;
    const dy = e.clientY - lastPointerRef.current.y;

    // Convert pixel movements into spiral rotation & translation
    const rotDelta = dx * 0.35;
    const transDelta = dy * 1.1;

    // Link vertical drag slightly to spiral threading for tactile screw effect
    const coupledRotDelta = rotDelta + (dy / dimensions.yStep) * (dimensions.angleStep * 0.3);

    const newRot = stateRef.current.rotationY + coupledRotDelta;
    const newTrans = stateRef.current.translateY + transDelta;

    setRotationY(newRot);
    setTranslateY(newTrans);

    // Track velocity for inertia
    velocityRef.current = {
      rotY: coupledRotDelta / (dt * 60),
      transY: transDelta / (dt * 60)
    };

    lastPointerRef.current = { x: e.clientX, y: e.clientY, time: now };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    setTimeout(() => setIsInteracting(false), 800);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Wheel scroll handler (screws up and down the helix)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setIsInteracting(true);

    const delta = e.deltaY;
    const transChange = -delta * 0.9;
    // Rotate along the spiral helix pitch
    const rotChange = (delta / dimensions.yStep) * dimensions.angleStep * 0.35;

    velocityRef.current.transY = transChange * 0.15;
    velocityRef.current.rotY = rotChange * 0.15;

    setTranslateY((prev) => Math.min(Math.max(prev + transChange, minTranslateY - 200), maxTranslateY + 200));
    setRotationY((prev) => prev + rotChange);

    const timer = setTimeout(() => setIsInteracting(false), 1200);
    return () => clearTimeout(timer);
  }, [dimensions, minTranslateY, maxTranslateY]);

  // Jump to top or bottom
  const scrollTo = (target: 'top' | 'middle' | 'bottom') => {
    audioManager.playSFX('swoosh');
    if (target === 'top') {
      setTranslateY(maxTranslateY);
      setRotationY(0);
    } else if (target === 'bottom') {
      setTranslateY(minTranslateY);
      setRotationY(-assets.length * dimensions.angleStep);
    } else {
      setTranslateY((minTranslateY + maxTranslateY) / 2);
      setRotationY(-((assets.length / 2) * dimensions.angleStep));
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '1200px',
        height: '680px',
        overflow: 'hidden',
        userSelect: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: `${dimensions.perspective}px`,
        cursor: isDraggingRef.current ? 'grabbing' : 'grab'
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
      aria-label="3D Floating Interactive Spiral Gallery"
    >
      {/* Subtle cylindrical center glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: `${dimensions.radius * 2}px`,
          height: '520px',
          background: 'radial-gradient(ellipse at center, rgba(230, 34, 56, 0.1) 0%, rgba(255, 94, 26, 0.04) 40%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* 3D Helix Stage */}
      <div
        ref={containerRef}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '0px',
          height: '0px',
          transformStyle: 'preserve-3d',
          transform: `translate3d(0, ${translateY}px, -${dimensions.radius * 0.3}px) rotateY(${rotationY}deg)`,
          transition: isDraggingRef.current ? 'none' : 'transform 0.08s ease-out'
        }}
      >
        {assets.map((asset, idx) => {
          // Angle in degrees for this card along the spiral
          const itemAngle = idx * dimensions.angleStep;
          // Vertical position along the spiral column
          const itemY = (idx - assets.length / 2) * dimensions.yStep;

          // Normalized relative angle to viewer (0° = facing front)
          const rawRelAngle = (itemAngle + rotationY) % 360;
          const relAngle = (rawRelAngle + 360) % 360; // 0 to 360
          const distFromFront = Math.min(relAngle, 360 - relAngle); // 0° (front) to 180° (back)
          const isFront = distFromFront < 90;

          // Depth styling
          const depthProgress = distFromFront / 180; // 0 (closest) to 1 (furthest)
          const opacity = Math.max(0.22, 1 - depthProgress * 0.72);
          const zDepth = Math.round((1 - depthProgress) * 500);

          const isHovered = hoveredId === asset.id;

          return (
            <div
              key={asset.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: `${dimensions.cardWidth}px`,
                height: `${dimensions.cardHeight}px`,
                marginLeft: `-${dimensions.cardWidth / 2}px`,
                marginTop: `-${dimensions.cardHeight / 2}px`,
                transformStyle: 'preserve-3d',
                transform: `rotateY(${itemAngle}deg) translateZ(${dimensions.radius}px) translateY(${itemY}px) ${
                  isHovered ? 'scale3d(1.18, 1.18, 1.18) translateZ(40px)' : 'scale3d(1, 1, 1)'
                }`,
                opacity: isHovered ? 1 : opacity,
                zIndex: isHovered ? 9999 : zDepth,
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
                pointerEvents: 'auto',
                cursor: 'pointer'
              }}
              onMouseEnter={() => {
                setHoveredId(asset.id);
                setIsInteracting(true);
              }}
              onMouseLeave={() => {
                setHoveredId(null);
                setIsInteracting(false);
              }}
              onClick={(e) => {
                e.stopPropagation();
                audioManager.playSFX('modal');
                onSelectAsset(asset);
              }}
            >
              {/* Card Container with Crisp White Border matching user reference */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundColor: '#0a0a10',
                  border: isHovered
                    ? '2.5px solid #ffffff'
                    : isFront
                    ? '2px solid rgba(255, 255, 255, 0.85)'
                    : '1.5px solid rgba(255, 255, 255, 0.45)',
                  boxShadow: isHovered
                    ? '0 16px 36px rgba(0, 0, 0, 0.9), 0 0 25px rgba(255, 255, 255, 0.35), 0 0 15px rgba(230, 34, 56, 0.5)'
                    : isFront
                    ? '0 12px 28px rgba(0, 0, 0, 0.75), 0 0 12px rgba(255, 255, 255, 0.12)'
                    : '0 6px 16px rgba(0, 0, 0, 0.6)',
                  transition: 'border 0.25s ease, box-shadow 0.25s ease'
                }}
              >
                {/* Media Image / Video Poster */}
                {asset.type === 'image' ? (
                  <img
                    src={asset.src}
                    alt={asset.alt}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                ) : (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img
                      src={asset.poster || asset.src}
                      alt={asset.alt}
                      loading="lazy"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                      onError={(e) => {
                        // If poster fails or is video src, use fallback background
                        (e.currentTarget as HTMLElement).style.display = 'none';
                      }}
                    />
                    {/* Play Badge */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '38px',
                        height: '38px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(230, 34, 56, 0.9)',
                        border: '1.5px solid #ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        boxShadow: '0 4px 14px rgba(0, 0, 0, 0.6)'
                      }}
                    >
                      <Play size={16} style={{ marginLeft: '2px' }} />
                    </div>
                  </div>
                )}

                {/* Subtle top sheen */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '35%',
                    background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.15), transparent)',
                    pointerEvents: 'none'
                  }}
                />

                {/* Bottom gradient caption overlay on hover or when in front */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '0.8rem 0.5rem 0.4rem',
                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.95) 0%, rgba(0, 0, 0, 0.6) 60%, transparent 100%)',
                    opacity: isHovered || (isFront && distFromFront < 35) ? 1 : 0,
                    transition: 'opacity 0.25s ease',
                    pointerEvents: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.15rem'
                  }}
                >
                  <span
                    style={{
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {asset.caption || asset.alt}
                  </span>
                  {asset.date && (
                    <span
                      style={{
                        color: 'var(--text-ember)',
                        fontSize: '0.62rem',
                        fontWeight: 500,
                        fontFamily: 'var(--font-mono)'
                      }}
                    >
                      {asset.date}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Pill & Controls (matching reference screenshot) */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          zIndex: 30,
          pointerEvents: 'auto'
        }}
      >
        {/* Navigation Quick Jump Top */}
        <button
          onClick={() => scrollTo('top')}
          title="Jump to start of spiral"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(18, 18, 26, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
          }}
        >
          <ArrowUp size={15} />
        </button>

        {/* Center Spiral Pill matching reference screenshot */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.45rem 1.1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(25, 25, 36, 0.9)',
            backdropFilter: 'blur(14px)',
            border: '1.5px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6), 0 0 16px rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '0.85rem',
            fontWeight: 600,
            letterSpacing: '0.04em'
          }}
        >
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.75rem'
            }}
          >
            🌀
          </div>
          <span>Spiral 3D</span>
          <span
            style={{
              padding: '0.15rem 0.45rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(230, 34, 56, 0.3)',
              color: 'var(--text-ember)',
              fontSize: '0.7rem',
              fontWeight: 700
            }}
          >
            {assets.length}
          </span>
        </div>

        {/* Toggle Auto Float / Pause */}
        <button
          onClick={() => {
            audioManager.playSFX('click');
            setIsAutoSpinning(!isAutoSpinning);
          }}
          title={isAutoSpinning ? 'Pause auto-rotation' : 'Start auto-rotation'}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(18, 18, 26, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: isAutoSpinning ? 'var(--text-ember)' : '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
          }}
        >
          {isAutoSpinning ? <Pause size={15} /> : <RotateCw size={15} />}
        </button>

        {/* Navigation Quick Jump Bottom */}
        <button
          onClick={() => scrollTo('bottom')}
          title="Jump to end of spiral"
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(18, 18, 26, 0.85)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.5)'
          }}
        >
          <ArrowDown size={15} />
        </button>
      </div>

      {/* Floating subtle gesture hint at top */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.75rem',
          color: 'rgba(255, 255, 255, 0.5)',
          backgroundColor: 'rgba(10, 10, 15, 0.6)',
          padding: '0.3rem 0.8rem',
          borderRadius: '9999px',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          pointerEvents: 'none',
          zIndex: 20
        }}
      >
        <Hand size={13} style={{ opacity: 0.8 }} />
        <span>Drag & scroll to rotate spiral • Click any photo to expand</span>
      </div>
    </div>
  );
};
