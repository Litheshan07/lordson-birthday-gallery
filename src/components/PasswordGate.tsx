import React, { useState } from 'react';
import { Lock, Unlock, Eye, EyeOff, ShieldAlert, Sparkles, ArrowRight } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { audioManager } from '../utils/audio';

interface PasswordGateProps {
  onUnlock: () => void;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isUnlocking) return;

    const trimmedInput = password.trim();

    // Verify against expected password or birthdate format
    if (trimmedInput === siteConfig.expectedPassword) {
      setError(false);
      setIsUnlocking(true);
      audioManager.playSFX('unlock');
      setTimeout(() => {
        onUnlock();
      }, 700);
    } else {
      setError(true);
      setErrorMessage(`Incorrect access key. Format required: ${siteConfig.passwordFormat}`);
      setIsShaking(true);
      audioManager.playSFX('error');
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        background: 'radial-gradient(ellipse at center, #151119 0%, #070709 100%)',
        overflow: 'hidden'
      }}
      role="region"
      aria-label="Password Access Gate"
    >
      {/* Cinematic Hero Silhouette Backdrop */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${siteConfig.backdropImage || '/media/backgrounds/doomsday-backdrop.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          opacity: 0.28,
          filter: 'contrast(1.2) brightness(0.7)',
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      />

      {/* Background glow and subtle vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(15, 12, 20, 0.7) 0%, #070709 90%)',
          pointerEvents: 'none'
        }}
      />

      <div
        className={`glass-panel-elevated ${isShaking ? 'animate-shake' : ''}`}
        style={{
          position: 'relative',
          maxWidth: '460px',
          width: '100%',
          borderRadius: '16px',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 30px rgba(230, 34, 56, 0.15)',
          transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease',
          opacity: isUnlocking ? 0 : 1,
          transform: isUnlocking ? 'scale(1.05)' : 'scale(1)'
        }}
      >
        {/* Emblem Badge */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'linear-gradient(145deg, #1f1f2e, #0f0f17)',
            border: '1px solid rgba(230, 34, 56, 0.4)',
            boxShadow: '0 0 25px rgba(230, 34, 56, 0.25)',
            marginBottom: '1.5rem',
            color: '#ff4d5a'
          }}
        >
          {isUnlocking ? <Unlock size={30} /> : <Lock size={28} />}
        </div>

        {/* Header */}
        <div style={{ marginBottom: '1.75rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.75rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: 'var(--text-ember)',
              marginBottom: '0.5rem',
              fontWeight: 600
            }}
          >
            <Sparkles size={13} />
            <span>Classified Access // 19th Milestone</span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-cinematic)',
              fontSize: '1.65rem',
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: '#ffffff',
              marginBottom: '0.5rem',
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)'
            }}
          >
            A memory vault for {siteConfig.recipientName}
          </h1>

          <p
            style={{
              color: 'var(--text-secondary)',
              fontSize: '0.9rem',
              lineHeight: 1.5
            }}
          >
            Enter {siteConfig.recipientName}’s birthdate to authenticate and decrypt the interactive archives.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ position: 'relative', textAlign: 'left' }}>
            <label
              htmlFor="vault-password"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--text-secondary)',
                marginBottom: '0.4rem',
                fontWeight: 500
              }}
            >
              Access Key (Format: <span style={{ color: 'var(--text-ember)' }}>{siteConfig.passwordFormat}</span>)
            </label>

            <div style={{ position: 'relative' }}>
              <input
                id="vault-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError(false);
                }}
                placeholder={siteConfig.passwordFormat === 'DDMMYYYY' ? 'e.g. 15112007' : 'Enter passkey'}
                autoComplete="off"
                disabled={isUnlocking}
                style={{
                  width: '100%',
                  padding: '0.85rem 3rem 0.85rem 1rem',
                  backgroundColor: 'rgba(10, 10, 15, 0.7)',
                  border: error ? '1px solid var(--crimson-bright)' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '10px',
                  color: '#ffffff',
                  fontSize: '1.05rem',
                  fontFamily: 'var(--font-mono), monospace',
                  letterSpacing: '0.12em',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  boxShadow: error ? '0 0 15px rgba(230, 34, 56, 0.3)' : 'none'
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? 'Hide passkey' : 'Show passkey'}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-secondary)',
                  padding: '0.3rem',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  marginTop: '0.5rem',
                  color: '#ff4d5a',
                  fontSize: '0.8rem',
                  fontWeight: 500
                }}
                role="alert"
              >
                <ShieldAlert size={14} />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isUnlocking || !password}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              width: '100%',
              padding: '0.9rem',
              marginTop: '0.5rem',
              borderRadius: '10px',
              fontWeight: 600,
              fontSize: '0.95rem',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              background: password
                ? 'linear-gradient(135deg, var(--crimson-bright) 0%, var(--crimson-dark) 100%)'
                : 'rgba(255, 255, 255, 0.08)',
              color: password ? '#ffffff' : 'var(--text-muted)',
              cursor: password ? 'pointer' : 'not-allowed',
              boxShadow: password ? '0 8px 25px rgba(230, 34, 56, 0.4)' : 'none',
              transform: password ? 'translateY(0)' : 'none'
            }}
          >
            <span>{isUnlocking ? 'Authenticating...' : 'Unlock Memory Vault'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)'
          }}
        >
          Encrypted Birthday Edition • 15 November 2026
        </div>
      </div>
    </div>
  );
};
