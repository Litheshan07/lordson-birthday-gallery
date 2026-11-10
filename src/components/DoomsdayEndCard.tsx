import React from 'react';
import { siteConfig } from '../config/siteConfig';
import { Countdown } from './Countdown';
import { Sparkles } from 'lucide-react';

export const DoomsdayEndCard: React.FC = () => {
  return (
    <section
      id="doomsday-end-card"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#050508',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5rem 1.5rem 3rem',
        overflow: 'hidden'
      }}
      aria-label="Avengers Doomsday Climax"
    >
      {/* Cinematic Hero Silhouette Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${siteConfig.backdropImage || siteConfig.openingVideoPoster || '/media/backgrounds/doomsday-backdrop.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 30%',
          opacity: 0.52,
          filter: 'contrast(1.15) brightness(0.9)'
        }}
        aria-hidden="true"
      />

      {/* Atmospheric Smoke & Vignette Overlays */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(7, 7, 10, 0.4) 0%, #050508 85%)',
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, #050508 10%, transparent 40%, transparent 60%, #070709 95%)',
          pointerEvents: 'none'
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: '1050px',
          width: '100%',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2.5rem'
        }}
      >
        {/* Top Tagline */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.1rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(230, 34, 56, 0.15)',
            border: '1px solid rgba(230, 34, 56, 0.4)',
            color: 'var(--text-ember)',
            fontSize: '0.8rem',
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            boxShadow: '0 0 20px rgba(230, 34, 56, 0.3)'
          }}
        >
          <Sparkles size={14} />
          <span>The End Of An Era • Phase Nineteen</span>
        </div>

        {/* Monumental Metallic Main Text - PRESERVED EXACTLY */}
        <div style={{ maxWidth: '980px', width: '100%' }}>
          <h1
            className="text-metallic"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6.8vw, 6.2rem)',
              lineHeight: 1.05,
              fontWeight: 900,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              textAlign: 'center',
              margin: '0 auto',
              textShadow: '0 4px 30px rgba(0, 0, 0, 0.9), 0 0 40px rgba(230, 34, 56, 0.35)'
            }}
          >
            {siteConfig.finalMessage}
          </h1>
        </div>

        {/* Movie Rating Box: THE FILM IS NOT RATED */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            border: '2px solid rgba(255, 255, 255, 0.45)',
            padding: '0.45rem 1.25rem',
            borderRadius: '4px',
            backgroundColor: 'rgba(10, 10, 15, 0.65)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.7)'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '0.82rem',
              fontWeight: 800,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: '#ffffff'
            }}
          >
            THE FILM IS NOT RATED
          </span>
        </div>

        {/* Countdown Timer */}
        <div style={{ marginTop: '0.5rem', width: '100%' }}>
          <Countdown targetDateStr={siteConfig.doomsdayReleaseDate} timezone={siteConfig.timezone} />
        </div>

        {/* Personal Signature / Final Credit - PRESERVED EXACTLY */}
        <div
          id="final-credit-signature"
          style={{
            marginTop: '2rem',
            paddingTop: '2rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            width: '100%',
            maxWidth: '550px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span
            style={{
              fontSize: '0.78rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--text-muted)'
            }}
          >
            Special Dedication
          </span>
          <p
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: '1.2rem',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '0.04em',
              textShadow: '0 0 15px rgba(255, 105, 180, 0.5), 0 2px 10px rgba(0, 0, 0, 0.8)'
            }}
          >
            {siteConfig.credit}
          </p>
        </div>
      </div>
    </section>
  );
};
