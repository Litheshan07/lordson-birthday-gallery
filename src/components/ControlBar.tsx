import React from 'react';
import { Volume2, VolumeX, Eye, EyeOff, Film, Sparkles, Flame } from 'lucide-react';
import { audioManager } from '../utils/audio';

interface ControlBarProps {
  isSoundMuted: boolean;
  onToggleSound: () => void;
  reducedMotion: boolean;
  onToggleMotion: () => void;
  onNavigateSection: (sectionId: string) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isSoundMuted,
  onToggleSound,
  reducedMotion,
  onToggleMotion,
  onNavigateSection
}) => {
  return (
    <aside
      className="glass-panel"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.4rem 0.6rem',
        borderRadius: '9999px',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        backgroundColor: 'rgba(12, 12, 18, 0.88)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.8)'
      }}
      aria-label="Experience Controls"
    >
      {/* Quick Jump Buttons */}
      <button
        onClick={() => {
          audioManager.playSFX('click');
          onNavigateSection('opening-video-section');
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.45rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 500,
          color: 'var(--text-secondary)'
        }}
        title="Jump to Opening Video"
      >
        <Film size={15} />
        <span className="hidden-mobile">Video</span>
      </button>

      <button
        onClick={() => {
          audioManager.playSFX('click');
          onNavigateSection('memory-gallery-section');
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.45rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 500,
          color: 'var(--text-secondary)'
        }}
        title="Jump to Memories"
      >
        <Sparkles size={15} />
        <span className="hidden-mobile">Memories</span>
      </button>

      <button
        onClick={() => {
          audioManager.playSFX('click');
          onNavigateSection('doomsday-end-card');
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          padding: '0.45rem 0.85rem',
          borderRadius: '9999px',
          fontSize: '0.8rem',
          fontWeight: 500,
          color: 'var(--crimson-bright)'
        }}
        title="Jump to Doomsday Climax"
      >
        <Flame size={15} />
        <span className="hidden-mobile">Doomsday</span>
      </button>

      {/* Divider */}
      <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.15)', margin: '0 0.2rem' }} />

      {/* Sound Toggle */}
      <button
        onClick={onToggleSound}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: isSoundMuted ? 'rgba(255, 255, 255, 0.05)' : 'rgba(230, 34, 56, 0.25)',
          border: isSoundMuted ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid var(--crimson-bright)',
          color: isSoundMuted ? 'var(--text-muted)' : '#ffffff'
        }}
        title={isSoundMuted ? 'Unmute experience audio' : 'Mute experience audio'}
        aria-label={isSoundMuted ? 'Unmute audio' : 'Mute audio'}
      >
        {isSoundMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
      </button>

      {/* Motion Toggle */}
      <button
        onClick={onToggleMotion}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          backgroundColor: reducedMotion ? 'rgba(255, 94, 26, 0.2)' : 'rgba(255, 255, 255, 0.05)',
          border: reducedMotion ? '1px solid var(--ember-hot)' : '1px solid rgba(255, 255, 255, 0.1)',
          color: reducedMotion ? 'var(--ember-hot)' : 'var(--text-secondary)'
        }}
        title={reducedMotion ? 'Enable smooth 3D motion' : 'Reduce motion effects'}
        aria-label={reducedMotion ? 'Enable motion' : 'Reduce motion'}
      >
        {reducedMotion ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </aside>
  );
};
