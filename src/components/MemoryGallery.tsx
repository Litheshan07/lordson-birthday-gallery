import React, { useState, useRef } from 'react';
import type { GalleryAsset, GalleryViewMode } from '../types';
import { GalleryCard } from './GalleryCard';
import { GalleryViewSwitcher } from './GalleryViewSwitcher';
import { SpiralGallery } from './SpiralGallery';
import { ChevronLeft, ChevronRight, Layers, Sparkles } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface MemoryGalleryProps {
  assets: GalleryAsset[];
  onSelectAsset: (asset: GalleryAsset) => void;
  reducedMotion: boolean;
}

export const MemoryGallery: React.FC<MemoryGalleryProps> = ({
  assets,
  onSelectAsset,
  reducedMotion
}) => {
  const [viewMode, setViewMode] = useState<GalleryViewMode>('spiral');
  const [activeOrbitIndex, setActiveOrbitIndex] = useState(0);
  const filmstripRef = useRef<HTMLDivElement | null>(null);

  // For 3D Orbit interactive tilt
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
  };

  const handleNextOrbit = () => {
    audioManager.playSFX('swoosh');
    setActiveOrbitIndex((prev) => (prev + 1) % assets.length);
  };

  const handlePrevOrbit = () => {
    audioManager.playSFX('swoosh');
    setActiveOrbitIndex((prev) => (prev - 1 + assets.length) % assets.length);
  };

  const scrollFilmstrip = (direction: 'left' | 'right') => {
    if (!filmstripRef.current) return;
    audioManager.playSFX('swoosh');
    const scrollAmount = direction === 'left' ? -380 : 380;
    filmstripRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section
      id="memory-gallery-section"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding: '5rem 1.5rem',
        backgroundColor: '#070709',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
      aria-label="3D Memory Gallery"
    >
      {/* Background ambient lighting */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '750px',
          height: '400px',
          background: 'radial-gradient(ellipse at center, rgba(230, 34, 56, 0.08) 0%, rgba(0, 0, 0, 0) 70%)',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }}
      />

      {/* Section Header */}
      <div style={{ textAlign: 'center', maxWidth: '700px', marginBottom: '2.5rem', zIndex: 5 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.35rem 0.9rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(230, 34, 56, 0.12)',
            border: '1px solid rgba(230, 34, 56, 0.25)',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--text-ember)',
            marginBottom: '0.75rem'
          }}
        >
          <Sparkles size={13} />
          <span>Chapter 19 • The Memory Vault</span>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-cinematic)',
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: '#ffffff',
            marginBottom: '0.8rem',
            textShadow: '0 4px 15px rgba(0, 0, 0, 0.7)'
          }}
        >
          Interactive Chronicles
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
          Explore Lordson’s legendary moments in depth. Toggle between perspectives and select any archive to inspect full-screen.
        </p>

        {/* View Mode Selector */}
        <div style={{ marginTop: '1.75rem' }}>
          <GalleryViewSwitcher currentView={viewMode} onViewChange={setViewMode} />
        </div>
      </div>

      {/* Empty State Fallback */}
      {assets.length === 0 && (
        <div
          className="glass-panel"
          style={{
            padding: '3rem',
            borderRadius: '16px',
            textAlign: 'center',
            maxWidth: '500px',
            color: 'var(--text-secondary)'
          }}
        >
          <Layers size={40} style={{ margin: '0 auto 1rem', color: 'var(--crimson-bright)' }} />
          <h3>No Media Loaded Yet</h3>
          <p style={{ fontSize: '0.9rem', marginTop: '0.5rem' }}>
            Add images or videos to <code style={{ color: '#fff' }}>public/media/images/</code> and update <code style={{ color: '#fff' }}>src/data/galleryAssets.ts</code>.
          </p>
        </div>
      )}

      {/* VIEW 0: 3D SPIRAL HELIX MODE (PRIMARY) */}
      {viewMode === 'spiral' && assets.length > 0 && (
        <SpiralGallery
          assets={assets}
          onSelectAsset={onSelectAsset}
          reducedMotion={reducedMotion}
        />
      )}

      {/* VIEW 1: 3D ORBIT MODE */}
      {viewMode === '3d-orbit' && assets.length > 0 && (
        <div
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: '1200px',
            minHeight: '520px',
            perspective: '1400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem 0'
          }}
        >
          {/* 3D Stage Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '850px',
              height: '420px',
              transformStyle: 'preserve-3d',
              transform: reducedMotion 
                ? 'none' 
                : `rotateX(${-mousePos.y * 12}deg) rotateY(${mousePos.x * 16}deg)`,
              transition: 'transform 0.25s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {assets.map((asset, idx) => {
              // Calculate offset relative to active card
              const total = assets.length;
              let offset = (idx - activeOrbitIndex) % total;
              if (offset < -Math.floor(total / 2)) offset += total;
              if (offset > Math.floor(total / 2)) offset -= total;

              // Only render visible orbit range
              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 2;
              if (!isVisible) return null;

              // 3D positioning
              const translateX = offset * 260;
              const translateZ = -Math.abs(offset) * 160;
              const rotateY = offset * -18;
              const opacity = Math.max(0.2, 1 - Math.abs(offset) * 0.35);
              const zIndex = 10 - Math.abs(offset);

              return (
                <div
                  key={asset.id}
                  style={{
                    position: 'absolute',
                    width: '320px',
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg)`,
                    transformStyle: 'preserve-3d',
                    opacity,
                    zIndex,
                    transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: isCenter ? 'auto' : 'auto'
                  }}
                  onClick={() => {
                    if (!isCenter) {
                      audioManager.playSFX('swoosh');
                      setActiveOrbitIndex(idx);
                    }
                  }}
                >
                  <GalleryCard
                    asset={asset}
                    index={idx}
                    onSelect={() => onSelectAsset(asset)}
                    style={{
                      transform: isCenter ? 'scale(1.08)' : 'scale(0.92)',
                      border: isCenter ? '1px solid var(--crimson-bright)' : '1px solid rgba(255, 255, 255, 0.08)'
                    }}
                  />
                </div>
              );
            })}
          </div>

          {/* Orbit Navigation Controls */}
          <div
            style={{
              position: 'absolute',
              bottom: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
              zIndex: 20
            }}
          >
            <button
              onClick={handlePrevOrbit}
              className="glass-panel"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
              aria-label="Previous orbit item"
            >
              <ChevronLeft size={22} />
            </button>

            <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: 'var(--text-ember)', fontWeight: 600 }}>{activeOrbitIndex + 1}</span> / {assets.length}
            </div>

            <button
              onClick={handleNextOrbit}
              className="glass-panel"
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}
              aria-label="Next orbit item"
            >
              <ChevronRight size={22} />
            </button>
          </div>
        </div>
      )}

      {/* VIEW 2: GRID MODE */}
      {viewMode === 'grid' && assets.length > 0 && (
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.75rem',
            padding: '1rem 0'
          }}
        >
          {assets.map((asset, idx) => (
            <GalleryCard
              key={asset.id}
              asset={asset}
              index={idx}
              onSelect={() => onSelectAsset(asset)}
            />
          ))}
        </div>
      )}

      {/* VIEW 3: FILMSTRIP MODE */}
      {viewMode === 'filmstrip' && assets.length > 0 && (
        <div style={{ position: 'relative', width: '100%', maxWidth: '1300px', padding: '1rem 0' }}>
          {/* Left Arrow */}
          <button
            onClick={() => scrollFilmstrip('left')}
            style={{
              position: 'absolute',
              left: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 15, 22, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)'
            }}
            aria-label="Scroll filmstrip left"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={() => scrollFilmstrip('right')}
            style={{
              position: 'absolute',
              right: '0.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(15, 15, 22, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7)'
            }}
            aria-label="Scroll filmstrip right"
          >
            <ChevronRight size={24} />
          </button>

          {/* Horizontal Scroll Strip */}
          <div
            ref={filmstripRef}
            style={{
              display: 'flex',
              gap: '1.5rem',
              overflowX: 'auto',
              scrollSnapType: 'x mandatory',
              padding: '1.5rem 3rem',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {assets.map((asset, idx) => (
              <div
                key={asset.id}
                style={{
                  flex: '0 0 320px',
                  scrollSnapAlign: 'center'
                }}
              >
                <GalleryCard
                  asset={asset}
                  index={idx}
                  onSelect={() => onSelectAsset(asset)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
