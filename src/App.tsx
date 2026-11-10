import { useState, useEffect } from 'react';
import { siteConfig } from './config/siteConfig';
import type { GalleryAsset } from './types';
import { audioManager } from './utils/audio';
import { PasswordGate } from './components/PasswordGate';
import { OpeningVideo } from './components/OpeningVideo';
import { MemoryGallery } from './components/MemoryGallery';
import { DoomsdayEndCard } from './components/DoomsdayEndCard';
import { MediaLightbox } from './components/MediaLightbox';
import { EmberParticles } from './components/EmberParticles';
import { ControlBar } from './components/ControlBar';
import './styles/global.css';

export function App() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<GalleryAsset | null>(null);
  const [isSoundMuted, setIsSoundMuted] = useState(audioManager.getMuted());
  const [reducedMotion, setReducedMotion] = useState(false);

  // Initialize reduced motion preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
    }
  }, []);

  // Sync mute state with AudioManager
  useEffect(() => {
    const unsubscribe = audioManager.subscribe((muted) => {
      setIsSoundMuted(muted);
    });
    return unsubscribe;
  }, []);

  // Section observer to crossfade audio tracks
  useEffect(() => {
    if (!isUnlocked) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id === 'opening-video-section') {
              audioManager.setSection('none');
            } else if (entry.target.id === 'memory-gallery-section') {
              audioManager.setSection('memory-gallery');
            } else if (
              entry.target.id === 'final-credit-signature' ||
              entry.target.id === 'doomsday-end-card'
            ) {
              audioManager.setSection('ending');
            }
          }
        });
      },
      { threshold: 0.2 }
    );

    const videoSec = document.getElementById('opening-video-section');
    const gallerySec = document.getElementById('memory-gallery-section');
    const doomsdaySec = document.getElementById('doomsday-end-card');
    const creditSec = document.getElementById('final-credit-signature');

    if (videoSec) observer.observe(videoSec);
    if (gallerySec) observer.observe(gallerySec);
    if (doomsdaySec) observer.observe(doomsdaySec);
    if (creditSec) observer.observe(creditSec);

    return () => observer.disconnect();
  }, [isUnlocked]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    // User interacted: unmute so audio is primed, but keep section at 'none' until gallery is in view
    audioManager.setMuted(false);
    audioManager.setSection('none');
  };

  const handleToggleSound = () => {
    audioManager.toggleMute();
  };

  const handleToggleMotion = () => {
    audioManager.playSFX('click');
    setReducedMotion(!reducedMotion);
  };

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#070709' }}>
      {/* Global App Backdrop with latest uploaded hero backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${siteConfig.backdropImage || '/media/backgrounds/doomsday-backdrop.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 20%',
          opacity: 0.16,
          filter: 'blur(2px) contrast(1.15)',
          pointerEvents: 'none',
          zIndex: 0
        }}
        aria-hidden="true"
      />

      {/* Film grain texture */}
      <div className="film-grain" aria-hidden="true" />

      {/* Floating Ember Particles Canvas */}
      <EmberParticles intensity="medium" reducedMotion={reducedMotion} />

      {/* Gatekeeper if locked */}
      {!isUnlocked ? (
        <PasswordGate onUnlock={handleUnlock} />
      ) : (
        <main>
          {/* Section 1: Opening Video Presentation */}
          <OpeningVideo
            onComplete={() => scrollToSection('memory-gallery-section')}
            onSkip={() => scrollToSection('memory-gallery-section')}
            isSoundMuted={isSoundMuted}
            onToggleSound={handleToggleSound}
          />

          {/* Section 2: 3D Memory Gallery */}
          <MemoryGallery
            assets={siteConfig.galleryAssets}
            onSelectAsset={(asset) => setSelectedAsset(asset)}
            reducedMotion={reducedMotion}
          />

          {/* Section 3: Avengers Doomsday End Card */}
          <DoomsdayEndCard />

          {/* Full-screen Lightbox Modal */}
          <MediaLightbox
            asset={selectedAsset}
            allAssets={siteConfig.galleryAssets}
            isOpen={Boolean(selectedAsset)}
            onClose={() => setSelectedAsset(null)}
            onNavigate={(newAsset) => setSelectedAsset(newAsset)}
            isSoundMuted={isSoundMuted}
            onToggleSound={handleToggleSound}
          />

          {/* Persistent Control Bar */}
          <ControlBar
            isSoundMuted={isSoundMuted}
            onToggleSound={handleToggleSound}
            reducedMotion={reducedMotion}
            onToggleMotion={handleToggleMotion}
            onNavigateSection={scrollToSection}
          />
        </main>
      )}
    </div>
  );
}

export default App;
