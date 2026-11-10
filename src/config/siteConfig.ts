import type { SiteConfig } from '../types';
import { initialGalleryAssets } from '../data/galleryAssets';

/**
 * Site Configuration for Lordson's 19th Birthday Experience
 * 
 * Update parameters here to customize dates, passwords, and media targets.
 */
export const siteConfig: SiteConfig = {
  recipientName: "Lordson",
  birthdayDate: "2026-11-15",
  birthdayAge: 19,
  passwordMode: "birthdate",
  // Password format shown to the user in the vault gate
  passwordFormat: "DDMMYYYY",
  // Expected birthdate: 15 November 2007 -> 15112007
  expectedPassword: "15112007",
  openingVideo: "/media/videos/jailer 2 ref lordson 2.mp4",
  openingVideoPoster: "/media/backgrounds/doomsday-backdrop.png",
  backdropImage: "/media/backgrounds/doomsday-backdrop.png",
  galleryAssets: initialGalleryAssets,
  // Avengers: Doomsday release date in Asia/Kolkata timezone
  doomsdayReleaseDate: "2026-12-18T00:00:00+05:30",
  timezone: "Asia/Kolkata",
  // Crucial: preserve exact wording
  finalMessage: "Lordson will not return in Avengers: Doomsday",
  credit: "Done by ur FAV 💖✨ JASPER"
};
