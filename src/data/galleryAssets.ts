import type { GalleryAsset } from '../types';

/**
 * Gallery Assets Manifest — auto-populated from public/media/images/
 *
 * Images: .jpg, .jpeg, .png, .webp
 * Videos: .mp4, .webm
 * Note: .heic files are skipped (not supported natively by browsers)
 */
export const initialGalleryAssets: GalleryAsset[] = [
  // ── Main Feature Video ──────────────────────────────────────────────────
  {
    id: 'mem-main-video',
    type: 'video',
    src: '/media/videos/jailer 2 ref lordson 2.mp4',
    poster: '/media/backgrounds/doomsday-backdrop.png',
    alt: 'Lordson - Jailer 2 Premiere Cut',
    caption: 'The Sovereign Return // Jailer Premiere Cut',
    aspectRatio: 'wide',
    date: 'Main Feature'
  },

  // ── Video clips from the images folder ──────────────────────────────────
  {
    id: 'vid-VN20261106',
    type: 'video',
    src: '/media/images/VN20261106_212204_1.mp4',
    poster: '/media/images/20261101_183543.jpg',
    alt: 'Lordson - Video Reel Nov 2026',
    caption: 'The Night Reel // Nov 2026',
    aspectRatio: 'wide',
    date: 'Nov 2026'
  },

  // ── Photos — 2024 ───────────────────────────────────────────────────────
  {
    id: 'img-wa0002',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0002.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'portrait',
    date: 'Dec 2024'
  },
  {
    id: 'img-wa0019',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0019.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'landscape',
    date: 'Dec 2024'
  },
  {
    id: 'img-wa0026',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0026.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'portrait',
    date: 'Dec 2024'
  },
  {
    id: 'img-wa0031',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0031.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'landscape',
    date: 'Dec 2024'
  },
  {
    id: 'img-wa0079',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0079.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'square',
    date: 'Dec 2024'
  },
  {
    id: 'img-wa0170',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0170.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'portrait',
    date: 'Dec 2024'
  },
  {
    id: 'img-wa0194',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0194.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'portrait',
    date: 'Dec 2024'
  },
  {
    id: 'img-wa0204',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0204.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'landscape',
    date: 'Dec 2024'
  },
  {
    id: 'img-wa0284',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0284.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'portrait',
    date: 'Dec 2024'
  },
  {
    id: 'img-wa0314',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0314.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'landscape',
    date: 'Dec 2024'
  },
  {
    id: 'img-wa0354',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0354.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'portrait',
    date: 'Dec 2024'
  },
  {
    id: 'img-wa0363',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0363.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'landscape',
    date: 'Dec 2024'
  },
  {
    id: 'img-wa0391',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0391.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'portrait',
    date: 'Dec 2024'
  },
  {
    id: 'img-wa0415',
    type: 'image',
    src: '/media/images/IMG-20241201-WA0415.jpg',
    alt: 'Memory – Dec 2024',
    caption: 'Dec 2024',
    aspectRatio: 'landscape',
    date: 'Dec 2024'
  },

  // ── Photos — 2025 ───────────────────────────────────────────────────────
  {
    id: 'img-20250113',
    type: 'image',
    src: '/media/images/IMG-20250113-WA0032.jpg',
    alt: 'Memory – Jan 2025',
    caption: 'Jan 2025',
    aspectRatio: 'portrait',
    date: 'Jan 2025'
  },
  {
    id: 'img-20250124-110',
    type: 'image',
    src: '/media/images/IMG-20250124-WA0110.jpg',
    alt: 'Memory – Jan 2025',
    caption: 'Jan 2025',
    aspectRatio: 'landscape',
    date: 'Jan 2025'
  },
  {
    id: 'img-20250124-143',
    type: 'image',
    src: '/media/images/IMG-20250124-WA0143.jpg',
    alt: 'Memory – Jan 2025',
    caption: 'Jan 2025',
    aspectRatio: 'landscape',
    date: 'Jan 2025'
  },
  {
    id: 'img-20250126-042',
    type: 'image',
    src: '/media/images/IMG-20250126-WA0042.jpg',
    alt: 'Memory – Jan 2025',
    caption: 'Jan 2025',
    aspectRatio: 'portrait',
    date: 'Jan 2025'
  },
  {
    id: 'img-20250126-133',
    type: 'image',
    src: '/media/images/IMG-20250126-WA0133.jpg',
    alt: 'Memory – Jan 2025',
    caption: 'Jan 2025',
    aspectRatio: 'landscape',
    date: 'Jan 2025'
  },
  {
    id: 'img-20250223',
    type: 'image',
    src: '/media/images/IMG-20250223-WA0079.jpg',
    alt: 'Memory – Feb 2025',
    caption: 'Feb 2025',
    aspectRatio: 'landscape',
    date: 'Feb 2025'
  },
  {
    id: 'img-20250321-043',
    type: 'image',
    src: '/media/images/IMG-20250321-WA0043.jpg',
    alt: 'Memory – Mar 2025',
    caption: 'Mar 2025',
    aspectRatio: 'portrait',
    date: 'Mar 2025'
  },
  {
    id: 'img-20250321-055',
    type: 'image',
    src: '/media/images/IMG-20250321-WA0055.jpg',
    alt: 'Memory – Mar 2025',
    caption: 'Mar 2025',
    aspectRatio: 'portrait',
    date: 'Mar 2025'
  },
  {
    id: 'img-20250516-041',
    type: 'image',
    src: '/media/images/IMG-20250516-WA0041 (2).jpg',
    alt: 'Memory – May 2025',
    caption: 'May 2025',
    aspectRatio: 'portrait',
    date: 'May 2025'
  },
  {
    id: 'img-20250516-055',
    type: 'image',
    src: '/media/images/IMG-20250516-WA0055.jpg',
    alt: 'Memory – May 2025',
    caption: 'May 2025',
    aspectRatio: 'portrait',
    date: 'May 2025'
  },

  // ── Photos — Nov 2025 ───────────────────────────────────────────────────
  {
    id: 'img-20251027',
    type: 'image',
    src: '/media/images/20251027_173013.jpg',
    alt: 'Memory – Oct 2025',
    caption: 'Oct 2025',
    aspectRatio: 'landscape',
    date: 'Oct 2025'
  },
  {
    id: 'img-20251121-336',
    type: 'image',
    src: '/media/images/20251121_165336.jpg',
    alt: 'Memory – Nov 2025',
    caption: 'Nov 2025',
    aspectRatio: 'landscape',
    date: 'Nov 2025'
  },
  {
    id: 'img-20251121-430',
    type: 'image',
    src: '/media/images/20251121_165430.jpg',
    alt: 'Memory – Nov 2025',
    caption: 'Nov 2025',
    aspectRatio: 'landscape',
    date: 'Nov 2025'
  },
  {
    id: 'img-20251121-733',
    type: 'image',
    src: '/media/images/20251121_165733.jpg',
    alt: 'Memory – Nov 2025',
    caption: 'Nov 2025',
    aspectRatio: 'landscape',
    date: 'Nov 2025'
  },
  {
    id: 'img-20251121-824',
    type: 'image',
    src: '/media/images/20251121_165824.jpg',
    alt: 'Memory – Nov 2025',
    caption: 'Nov 2025',
    aspectRatio: 'portrait',
    date: 'Nov 2025'
  },
  {
    id: 'img-20251121-923a',
    type: 'image',
    src: '/media/images/20251121_165923(1).jpg',
    alt: 'Memory – Nov 2025',
    caption: 'Nov 2025',
    aspectRatio: 'landscape',
    date: 'Nov 2025'
  },
  {
    id: 'img-20251121-923b',
    type: 'image',
    src: '/media/images/20251121_165923.jpg',
    alt: 'Memory – Nov 2025',
    caption: 'Nov 2025',
    aspectRatio: 'portrait',
    date: 'Nov 2025'
  },

  // ── Photos — 2026 ───────────────────────────────────────────────────────
  {
    id: 'img-collage',
    type: 'image',
    src: '/media/images/20260219_134550-COLLAGE.jpg',
    alt: 'Collage – Feb 2026',
    caption: 'The Collage // Feb 2026',
    aspectRatio: 'wide',
    date: 'Feb 2026'
  },
  {
    id: 'img-20261101',
    type: 'image',
    src: '/media/images/20261101_183543.jpg',
    alt: 'Memory – Nov 2026',
    caption: 'Nov 2026',
    aspectRatio: 'portrait',
    date: 'Nov 2026'
  },

  // ── Converted from HEIC ─────────────────────────────────────────────────
  {
    id: 'img-heic-0904',
    type: 'image',
    src: '/media/images/IMG_0904.jpg',
    alt: 'Memory – IMG_0904',
    caption: 'The Moment',
    aspectRatio: 'portrait',
    date: 'Archive'
  },
  {
    id: 'img-heic-5710',
    type: 'image',
    src: '/media/images/IMG_5710.jpg',
    alt: 'Memory – IMG_5710',
    caption: 'The Frame',
    aspectRatio: 'portrait',
    date: 'Archive'
  },

  // ── Other Photos ────────────────────────────────────────────────────────
  {
    id: 'img-screenshot-2023',
    type: 'image',
    src: '/media/images/original_b4eb8ad0-bfe9-4e3f-9ee4-6ad075fce4a0_Screenshot_2023-09-15-21-15-52-0106324159.png',
    alt: 'Screenshot – Sep 2023',
    caption: 'Sep 2023',
    aspectRatio: 'portrait',
    date: 'Sep 2023'
  },
  {
    id: 'img-saki9522',
    type: 'image',
    src: '/media/images/SAKI9522.JPG',
    alt: 'SAKI – Memory',
    caption: 'The Frame',
    aspectRatio: 'landscape',
    date: 'Archive'
  },
  {
    id: 'img-threads-screenshot',
    type: 'image',
    src: '/media/images/Screenshot_20260415_074313_Threads.jpg',
    alt: 'Threads Screenshot – Apr 2026',
    caption: 'Apr 2026',
    aspectRatio: 'portrait',
    date: 'Apr 2026'
  }
];
