export type MediaType = 'image' | 'video';

export interface GalleryAsset {
  id: string;
  type: MediaType;
  src: string;
  alt: string;
  caption?: string;
  poster?: string;
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'wide';
  date?: string;
  location?: string;
}

export type GalleryViewMode = 'spiral' | '3d-orbit' | 'grid' | 'filmstrip';

export interface SiteConfig {
  recipientName: string;
  birthdayDate: string; // YYYY-MM-DD
  birthdayAge: number;
  passwordMode: 'birthdate' | 'custom';
  passwordFormat: 'DDMMYYYY' | 'YYYYMMDD' | 'MMDDYYYY';
  expectedPassword: string;
  openingVideo: string;
  openingVideoPoster?: string;
  backdropImage?: string;
  galleryAssets: GalleryAsset[];
  doomsdayReleaseDate: string; // ISO string with offset
  timezone: string;
  finalMessage: string;
  credit: string;
}
