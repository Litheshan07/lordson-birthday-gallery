import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, ChevronDown, SkipForward } from 'lucide-react';
import { siteConfig } from '../config/siteConfig';
import { audioManager } from '../utils/audio';

interface OpeningVideoProps {
  onComplete: () => void;
  onSkip: () => void;
  isSoundMuted: boolean;
  onToggleSound: () => void;
}

export const OpeningVideo: React.FC<OpeningVideoProps> = ({
  onComplete,
  onSkip,
  isSoundMuted,
  onToggleSound
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isEnded, setIsEnded] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = isSoundMuted;

    const handleTimeUpdate = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setCurrentTime(video.currentTime);
        setDuration(video.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setIsEnded(true);
      audioManager.setVideoPlaying(false);
      onComplete();
    };

    const handlePlay = () => {
      setIsPlaying(true);
      audioManager.setVideoPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);
      audioManager.setVideoPlaying(false);
    };

    const handleError = () => {
      setVideoError(true);
      audioManager.setVideoPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      audioManager.setVideoPlaying(false);
    };
  }, [isSoundMuted, onComplete]);

  // Sync mute state to video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isSoundMuted;
    }
  }, [isSoundMuted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        setHasStarted(true);
        audioManager.playSFX('click');
      }).catch(() => {
        // Autoplay policy prevented playback
        setIsPlaying(false);
      });
    } else {
      video.pause();
      setIsPlaying(false);
      audioManager.playSFX('click');
    }
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    video.play().then(() => {
      setIsPlaying(true);
      setIsEnded(false);
      audioManager.playSFX('click');
    });
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    video.currentTime = pos * video.duration;
  };

  return (
    <section
      id="opening-video-section"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: '#040406',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '2rem 1rem'
      }}
      aria-label="Opening Video Presentation"
    >
      {/* Top Bar with Skip Button */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}
      >
        <button
          onClick={() => {
            audioManager.playSFX('click');
            onSkip();
          }}
          className="glass-panel"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            color: 'var(--text-primary)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            transition: 'all 0.2s'
          }}
          title="Jump directly to the 3D gallery"
        >
          <span>Skip to memories</span>
          <SkipForward size={15} />
        </button>
      </div>

      {/* Cinematic Letterboxed Container */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1100px',
          aspectRatio: '16/9',
          borderRadius: '14px',
          overflow: 'hidden',
          backgroundColor: '#000000',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 40px rgba(230, 34, 56, 0.12)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
      >
        <video
          ref={videoRef}
          src={siteConfig.openingVideo}
          poster={siteConfig.openingVideoPoster}
          playsInline
          preload="metadata"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            display: videoError ? 'none' : 'block'
          }}
          onClick={togglePlay}
        />

        {/* Fallback Display if video file is not yet added to /media/opening-video.mp4 */}
        {videoError && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              backgroundImage: siteConfig.openingVideoPoster ? `url(${siteConfig.openingVideoPoster})` : 'none',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(5, 5, 8, 0.82)',
                backdropFilter: 'blur(4px)'
              }}
            />
            <div style={{ position: 'relative', zIndex: 2, maxWidth: '520px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  fontSize: '0.75rem',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'var(--text-ember)',
                  marginBottom: '0.75rem',
                  fontWeight: 600
                }}
              >
                Cinematic Intro Reel
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-cinematic)',
                  fontSize: '1.8rem',
                  color: '#ffffff',
                  marginBottom: '0.75rem'
                }}
              >
                Opening Video Ready For Upload
              </h2>
              <p
                style={{
                  color: 'var(--text-secondary)',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem'
                }}
              >
                Place your video at <code style={{ color: 'var(--text-accent)', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>public/media/opening-video.mp4</code>.
                You can proceed right now to explore Lordson’s 3D memory vault!
              </p>
              <button
                onClick={() => {
                  audioManager.playSFX('unlock');
                  onComplete();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.8rem 1.8rem',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, var(--crimson-bright), var(--crimson-dark))',
                  color: '#ffffff',
                  fontWeight: 600,
                  fontSize: '0.95rem',
                  boxShadow: '0 8px 25px rgba(230, 34, 56, 0.4)'
                }}
              >
                <span>Continue To 3D Memories</span>
                <ChevronDown size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Center Big Play Button before starting */}
        {!hasStarted && !videoError && (
          <button
            onClick={togglePlay}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0, 0, 0, 0.45)',
              zIndex: 10
            }}
            aria-label="Play opening video"
          >
            <div
              style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--crimson-bright), var(--crimson-dark))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 0 35px rgba(230, 34, 56, 0.6)',
                transition: 'transform 0.2s',
                transform: 'scale(1)'
              }}
            >
              <Play size={34} style={{ marginLeft: '4px' }} />
            </div>
            <span
              style={{
                marginTop: '1rem',
                fontFamily: 'var(--font-cinematic)',
                letterSpacing: '0.1em',
                fontSize: '0.95rem',
                color: '#ffffff',
                textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)'
              }}
            >
              Press to Begin Experience
            </span>
          </button>
        )}

        {/* Video Overlay Custom Controls */}
        {!videoError && (
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1rem 1.25rem',
              background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0) 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              zIndex: 15,
              opacity: hasStarted ? 1 : 0,
              transition: 'opacity 0.3s'
            }}
          >
            {/* Timeline Bar */}
            <div
              onClick={handleSeek}
              style={{
                width: '100%',
                height: '5px',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '3px',
                cursor: 'pointer',
                position: 'relative'
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  backgroundColor: 'var(--crimson-bright)',
                  borderRadius: '3px',
                  boxShadow: '0 0 10px rgba(230, 34, 56, 0.8)'
                }}
              />
            </div>

            {/* Bottom Row Controls */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <button onClick={togglePlay} aria-label={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>

                <button onClick={handleReplay} aria-label="Replay video" title="Replay">
                  <RotateCcw size={18} />
                </button>

                <button onClick={onToggleSound} aria-label={isSoundMuted ? 'Unmute' : 'Mute'} title={isSoundMuted ? 'Unmute' : 'Mute'}>
                  {isSoundMuted ? <VolumeX size={20} color="#ff4d5a" /> : <Volume2 size={20} />}
                </button>

                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              {isEnded && (
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-ember)',
                    fontWeight: 600,
                    letterSpacing: '0.04em'
                  }}
                >
                  Completed
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tasteful End / Scroll Cue */}
      <div
        style={{
          marginTop: '2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.6rem'
        }}
      >
        <button
          onClick={() => {
            audioManager.playSFX('swoosh');
            onComplete();
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.7rem 1.4rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(230, 34, 56, 0.15)',
            border: '1px solid rgba(230, 34, 56, 0.4)',
            color: '#ffffff',
            fontSize: '0.9rem',
            fontWeight: 500,
            letterSpacing: '0.04em',
            boxShadow: '0 4px 20px rgba(230, 34, 56, 0.2)'
          }}
        >
          <span>Scroll to unlock the memories</span>
          <ChevronDown size={18} style={{ animation: 'bounce 1.5s infinite' }} />
        </button>
      </div>
    </section>
  );
};
