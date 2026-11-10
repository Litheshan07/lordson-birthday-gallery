/**
 * Audio System
 * 
 * Rules:
 * - Uses uploaded audio files from /media/audio/:
 *     1. Memory album soundtrack: /media/audio/Dominic_Fike_-_How_Much_Is_Weed_(mp3.pm).mp3 (80% volume)
 *     2. Final reveal / Jasper signature: /media/audio/killen em.mp3 (when reaching the end with "Done by ur FAV 💖✨ JASPER")
 * - Memory audio is applicable ONLY to the memory album section
 * - When at the top main video, zero external sound plays
 * - When any video plays, background sound automatically pauses so audio comes ONLY from the video
 * - All synthetic oscillators and vibration drone sounds remain completely removed
 */

export type SoundType = 'click' | 'unlock' | 'error' | 'swoosh' | 'modal' | 'viewChange';
export type MusicSection = 'none' | 'memory-gallery' | 'ambient' | 'doomsday' | 'ending';

class AudioManagerService {
  private isMuted: boolean = false;
  private currentSection: MusicSection = 'none';
  private isVideoPlaying: boolean = false;
  private memoryAudio: HTMLAudioElement | null = null;
  private endingAudio: HTMLAudioElement | null = null;
  private listeners: Set<(muted: boolean) => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const storedMute = sessionStorage.getItem('lordson_audio_muted');
      if (storedMute !== null) {
        this.isMuted = storedMute === 'true';
      }
    }
  }

  private getMemoryAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.memoryAudio) {
      this.memoryAudio = new Audio('/media/audio/Dominic_Fike_-_How_Much_Is_Weed_(mp3.pm).mp3');
      this.memoryAudio.loop = true;
      this.memoryAudio.volume = 0.8; // Exactly 80% volume
      this.memoryAudio.preload = 'auto';
    }
    return this.memoryAudio;
  }

  private getEndingAudio(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.endingAudio) {
      this.endingAudio = new Audio('/media/audio/killen em.mp3');
      this.endingAudio.loop = true;
      this.endingAudio.volume = 0.85;
      this.endingAudio.preload = 'auto';
    }
    return this.endingAudio;
  }

  public subscribe(cb: (muted: boolean) => void): () => void {
    this.listeners.add(cb);
    cb(this.isMuted);
    return () => {
      this.listeners.delete(cb);
    };
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lordson_audio_muted', String(muted));
    }
    this.syncPlayback();
    this.listeners.forEach((cb) => cb(this.isMuted));
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public setVideoPlaying(playing: boolean) {
    this.isVideoPlaying = playing;
    this.syncPlayback();
  }

  public setSection(section: MusicSection) {
    if (this.currentSection === section) return;
    this.currentSection = section;
    this.syncPlayback();
  }

  private syncPlayback() {
    const memory = this.getMemoryAudio();
    const ending = this.getEndingAudio();

    // Section definitions
    const inMemorySection = this.currentSection === 'memory-gallery' || this.currentSection === 'ambient';
    const inEndingSection = this.currentSection === 'ending' || this.currentSection === 'doomsday';

    const shouldPlayMemory = inMemorySection && !this.isMuted && !this.isVideoPlaying;
    const shouldPlayEnding = inEndingSection && !this.isMuted && !this.isVideoPlaying;

    // Handle Memory Album Soundtrack
    if (memory) {
      if (shouldPlayMemory) {
        memory.volume = 0.8;
        memory.play().catch(() => {});
      } else {
        memory.pause();
      }
    }

    // Handle Ending "Killen Em" Soundtrack
    if (ending) {
      if (shouldPlayEnding) {
        ending.volume = 0.85;
        ending.play().catch(() => {});
      } else {
        ending.pause();
      }
    }
  }

  public stopAllMusic() {
    if (this.memoryAudio) {
      try {
        this.memoryAudio.pause();
      } catch {
        // ignore
      }
    }
    if (this.endingAudio) {
      try {
        this.endingAudio.pause();
      } catch {
        // ignore
      }
    }
  }

  // All synthetic oscillators, buzzing, drones, and vibration sounds remain removed
  public playSFX(_type: SoundType) {
    // Intentionally silenced
  }
}

export const audioManager = new AudioManagerService();
