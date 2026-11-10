import React from 'react';
import { Orbit, Grid, Film, Sparkles } from 'lucide-react';
import type { GalleryViewMode } from '../types';
import { audioManager } from '../utils/audio';

interface GalleryViewSwitcherProps {
  currentView: GalleryViewMode;
  onViewChange: (view: GalleryViewMode) => void;
}

export const GalleryViewSwitcher: React.FC<GalleryViewSwitcherProps> = ({
  currentView,
  onViewChange
}) => {
  const views: { id: GalleryViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'spiral', label: '3D Spiral', icon: <Sparkles size={16} /> },
    { id: '3d-orbit', label: 'Orbit', icon: <Orbit size={16} /> },
    { id: 'grid', label: 'Grid', icon: <Grid size={16} /> },
    { id: 'filmstrip', label: 'Filmstrip', icon: <Film size={16} /> }
  ];

  const handleSelect = (viewId: GalleryViewMode) => {
    if (viewId === currentView) return;
    audioManager.playSFX('viewChange');
    onViewChange(viewId);
  };

  return (
    <div
      className="glass-panel"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '0.3rem',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        backgroundColor: 'rgba(15, 15, 22, 0.85)',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.6)'
      }}
      role="radiogroup"
      aria-label="Gallery View Selector"
    >
      {views.map((v) => {
        const isActive = currentView === v.id;
        return (
          <button
            key={v.id}
            role="radio"
            aria-checked={isActive}
            onClick={() => handleSelect(v.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: isActive ? 600 : 500,
              letterSpacing: '0.04em',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              background: isActive
                ? 'linear-gradient(135deg, var(--crimson-bright) 0%, var(--crimson-dark) 100%)'
                : 'transparent',
              boxShadow: isActive ? '0 4px 16px rgba(230, 34, 56, 0.45)' : 'none',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            {v.icon}
            <span>{v.label}</span>
          </button>
        );
      })}
    </div>
  );
};
