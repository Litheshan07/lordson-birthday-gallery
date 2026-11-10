import React, { useState } from 'react';
import { Play, Image as ImageIcon, Video as VideoIcon, Maximize2 } from 'lucide-react';
import type { GalleryAsset } from '../types';
import { audioManager } from '../utils/audio';

interface GalleryCardProps {
  asset: GalleryAsset;
  index: number;
  onSelect: (asset: GalleryAsset) => void;
  style?: React.CSSProperties;
  className?: string;
}

export const GalleryCard: React.FC<GalleryCardProps> = ({
  asset,
  index,
  onSelect,
  style,
  className = ''
}) => {
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = () => {
    audioManager.playSFX('modal');
    onSelect(asset);
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`gallery-card ${className}`}
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        backgroundColor: '#12121a',
        border: isHovered ? '1px solid var(--crimson-bright)' : '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: isHovered
          ? '0 20px 45px rgba(0, 0, 0, 0.8), 0 0 25px rgba(230, 34, 56, 0.35)'
          : '0 12px 30px rgba(0, 0, 0, 0.5)',
        transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease',
        ...style
      }}
      aria-label={`View memory: ${asset.alt}`}
    >
      {/* Media Wrapper */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '280px',
          backgroundColor: '#0c0c14',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
      >
        {/* If image and no error */}
        {asset.type === 'image' && !hasError && (
          <img
            src={asset.src}
            alt={asset.alt}
            loading="lazy"
            onError={() => setHasError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: isHovered ? 'scale(1.06)' : 'scale(1)',
              transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        )}

        {/* If video and poster / error check */}
        {asset.type === 'video' && !hasError && (
          <>
            {asset.poster ? (
              <img
                src={asset.poster}
                alt={asset.alt}
                loading="lazy"
                onError={() => setHasError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transform: isHovered ? 'scale(1.06)' : 'scale(1)',
                  transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              />
            ) : (
              <video
                src={asset.src}
                muted
                preload="metadata"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
                onError={() => setHasError(true)}
              />
            )}
            {/* Play Badge */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: 'rgba(230, 34, 56, 0.85)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 20px rgba(230, 34, 56, 0.5)',
                zIndex: 2
              }}
            >
              <Play size={24} style={{ marginLeft: '3px' }} />
            </div>
          </>
        )}

        {/* High-tech Placeholder if file is missing */}
        {hasError && (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              textAlign: 'center',
              background: 'radial-gradient(circle at center, #1b1b29 0%, #0d0d14 100%)'
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '12px',
                backgroundColor: 'rgba(230, 34, 56, 0.15)',
                border: '1px solid rgba(230, 34, 56, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-ember)',
                marginBottom: '0.75rem'
              }}
            >
              {asset.type === 'video' ? <VideoIcon size={26} /> : <ImageIcon size={26} />}
            </div>
            <span
              style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: '#ffffff',
                letterSpacing: '0.04em',
                marginBottom: '0.25rem'
              }}
            >
              {asset.alt || `Memory Asset #${index + 1}`}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Awaiting upload to <code style={{ color: 'var(--text-accent)' }}>{asset.src}</code>
            </span>
          </div>
        )}

        {/* Corner Indicator / Expand Button */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            right: '0.75rem',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(10, 10, 15, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            opacity: isHovered ? 1 : 0.6,
            transition: 'opacity 0.2s',
            zIndex: 3
          }}
        >
          <Maximize2 size={14} />
        </div>

        {/* Index Pill */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            padding: '0.2rem 0.6rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(10, 10, 15, 0.8)',
            backdropFilter: 'blur(4px)',
            fontSize: '0.7rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            color: 'var(--text-ember)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 3
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>

      {/* Caption & Metadata Footer */}
      <div
        style={{
          padding: '1rem',
          background: 'linear-gradient(to bottom, #13131c, #0d0d14)',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)'
        }}
      >
        {asset.caption && (
          <p
            style={{
              fontSize: '0.9rem',
              fontWeight: 500,
              color: '#ffffff',
              lineHeight: 1.4,
              marginBottom: asset.date ? '0.35rem' : '0'
            }}
          >
            {asset.caption}
          </p>
        )}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}
        >
          <span>{asset.date || 'Vault Archive'}</span>
          <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--crimson-bright)' }}>
            {asset.type}
          </span>
        </div>
      </div>
    </div>
  );
};
