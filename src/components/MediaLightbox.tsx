import React, { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from 'lucide-react';
import type { GalleryAsset } from '../types';
import { audioManager } from '../utils/audio';

interface MediaLightboxProps {
  asset: GalleryAsset | null;
  allAssets: GalleryAsset[];
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newAsset: GalleryAsset) => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export const MediaLightbox: React.FC<MediaLightboxProps> = ({
  asset,
  allAssets,
  isOpen,
  onClose,
  onNavigate,
  isSoundMuted,
  onToggleSound
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  const currentIndex = asset ? allAssets.findIndex((a) => a.id === asset.id) : -1;

  // Handle keyboard navigation: Escape, ArrowLeft, ArrowRight
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        audioManager.playSFX('click');
        onClose();
      } else if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, allAssets]);

  // Handle video element cleanup on close & coordinate with background audio
  useEffect(() => {
    const video = videoRef.current;
    if (!isOpen || !asset || asset.type !== 'video' || !video) {
      audioManager.setVideoPlaying(false);
      return;
    }

    const handlePlay = () => audioManager.setVideoPlaying(true);
    const handlePause = () => audioManager.setVideoPlaying(false);
    const handleEnded = () => audioManager.setVideoPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    // If it started playing immediately
    if (!video.paused) {
      audioManager.setVideoPlaying(true);
    }

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      audioManager.setVideoPlaying(false);
    };
  }, [isOpen, asset]);

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
      audioManager.setVideoPlaying(false);
    }
  }, [isOpen]);

  const goToPrevious = () => {
    if (currentIndex > 0) {
      audioManager.playSFX('swoosh');
      onNavigate(allAssets[currentIndex - 1]);
    } else {
      // Loop to end
      audioManager.playSFX('swoosh');
      onNavigate(allAssets[allAssets.length - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < allAssets.length - 1) {
      audioManager.playSFX('swoosh');
      onNavigate(allAssets[currentIndex + 1]);
    } else {
      // Loop to start
      audioManager.playSFX('swoosh');
      onNavigate(allAssets[0]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      goToNext();
    } else if (diff < -50) {
      goToPrevious();
    }
  };


  if (!isOpen || !asset) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(4, 4, 7, 0.94)',
        backdropFilter: 'blur(16px)',
        padding: '1.5rem'
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Media Preview"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          audioManager.playSFX('click');
          onClose();
        }
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Header Bar */}
      <div
        style={{
          position: 'absolute',
          top: '1.25rem',
          left: '1.5rem',
          right: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 10
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: 'var(--text-secondary)',
            fontSize: '0.85rem',
            fontFamily: 'var(--font-mono)'
          }}
        >
          <span style={{ color: 'var(--text-ember)', fontWeight: 600 }}>
            {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span>/</span>
          <span>{String(allAssets.length).padStart(2, '0')}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {asset.type === 'video' && (
            <button
              onClick={onToggleSound}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
              aria-label={isSoundMuted ? 'Unmute' : 'Mute'}
            >
              {isSoundMuted ? <VolumeX size={20} color="#ff4d5a" /> : <Volume2 size={20} />}
            </button>
          )}

          <button
            onClick={() => {
              audioManager.playSFX('click');
              onClose();
            }}
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              backgroundColor: 'rgba(230, 34, 56, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 20px rgba(230, 34, 56, 0.5)'
            }}
            aria-label="Close Lightbox"
          >
            <X size={22} />
          </button>
        </div>
      </div>

      {/* Prev Button */}
      <button
        onClick={goToPrevious}
        style={{
          position: 'absolute',
          left: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'rgba(20, 20, 28, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          zIndex: 10,
          cursor: 'pointer'
        }}
        aria-label="Previous Memory"
      >
        <ChevronLeft size={28} />
      </button>

      {/* Next Button */}
      <button
        onClick={goToNext}
        style={{
          position: 'absolute',
          right: '1.5rem',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          backgroundColor: 'rgba(20, 20, 28, 0.8)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          zIndex: 10,
          cursor: 'pointer'
        }}
        aria-label="Next Memory"
      >
        <ChevronRight size={28} />
      </button>

      {/* Media Display Area */}
      <div
        style={{
          maxWidth: '90vw',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}
      >
        {asset.type === 'image' ? (
          <img
            src={asset.src}
            alt={asset.alt}
            style={{
              maxWidth: '100%',
              maxHeight: '75vh',
              objectFit: 'contain',
              borderRadius: '12px',
              boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95), 0 0 40px rgba(230, 34, 56, 0.2)'
            }}
            onError={(e) => {
              // Fallback to high tech obsidian card
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
        ) : (
          <div style={{ position: 'relative', width: '100%', maxWidth: '850px' }}>
            <video
              ref={videoRef}
              src={asset.src}
              poster={asset.poster}
              controls
              playsInline
              style={{
                width: '100%',
                maxHeight: '75vh',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.95)'
              }}
            />
          </div>
        )}

        {/* Caption */}
        <div
          style={{
            marginTop: '1.2rem',
            textAlign: 'center',
            maxWidth: '650px'
          }}
        >
          {asset.caption && (
            <h3
              style={{
                fontFamily: 'var(--font-cinematic)',
                fontSize: '1.25rem',
                color: '#ffffff',
                marginBottom: '0.35rem',
                letterSpacing: '0.04em'
              }}
            >
              {asset.caption}
            </h3>
          )}
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            {asset.alt} {asset.date ? `• ${asset.date}` : ''}
          </p>
        </div>
      </div>
    </div>
  );
};
