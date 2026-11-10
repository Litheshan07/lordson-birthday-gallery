# Lordson's 19th Birthday — Interactive 3D Memory Gallery

A cinematic, responsive web experience created for **Lordson's 19th Birthday** (15 November 2026), combining:
- **Cinematic Password Gate** (birthdate verification with glitch/shake feedback)
- **Opening Video Reel** (`jailer 2 ref lordson 2.mp4` with custom playback & skip controls)
- **3D Memory Gallery** with **3D Orbit**, **Grid**, and **Filmstrip** view modes
- **Full-Screen Lightbox** with swipe gestures, keyboard controls, and video playback
- **Dual-Engine Audio System** (MP3 files + Web Audio API procedural synthesis fallback)
- **Avengers: Doomsday Climax Card** featuring the custom silhouette backdrop of Lordson & Doctor Doom, countdown timer, "THE FILM IS NOT RATED" rating box, and Jasper's signature

---

## 🛠️ Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Start development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production
```bash
npm run build
```

---

## 🔑 Configuration & Customization

All primary variables, dates, passwords, and media settings are centralized in:
📂 `src/config/siteConfig.ts`

```typescript
export const siteConfig = {
  recipientName: "Lordson",
  birthdayDate: "2026-11-15",
  birthdayAge: 19,
  passwordMode: "birthdate",
  passwordFormat: "DDMMYYYY",
  expectedPassword: "15112007", // Lordson's birthdate (15 Nov 2007)
  openingVideo: "/media/videos/jailer 2 ref lordson 2.mp4",
  openingVideoPoster: "/media/backgrounds/doomsday-backdrop.png",
  backdropImage: "/media/backgrounds/doomsday-backdrop.png",
  galleryAssets: initialGalleryAssets,
  doomsdayReleaseDate: "2026-12-18T00:00:00+05:30", // Avengers: Doomsday release
  timezone: "Asia/Kolkata",
  finalMessage: "Lordson will not return in Avengers: Doomsday",
  credit: "Done by ur FAV 💖✨ JASPER"
};
```

---

## 📁 Managing Gallery Media

Gallery items are managed in:
📂 `src/data/galleryAssets.ts`

### Adding Photos & Videos
1. Place image files in: `public/media/images/` (`.jpg`, `.png`, `.webp`)
2. Place video files in: `public/media/videos/` (`.mp4`, `.webm`)
3. Add or update items in `src/data/galleryAssets.ts`:

```typescript
{
  id: 'mem-07',
  type: 'image', // or 'video'
  src: '/media/images/my-new-photo.jpg',
  alt: 'Description for accessibility',
  caption: 'Optional caption displayed on card and lightbox',
  aspectRatio: 'landscape', // 'square' | 'portrait' | 'landscape' | 'wide'
  date: 'Chapter 07'
}
```

> **Note on Placeholders**: If an image or video file has not yet been copied to `public/media/`, the gallery automatically renders an obsidian card placeholder, preventing broken images.

---

## 🎵 Audio System

The project features a **Dual-Engine Audio System** (`src/utils/audio.ts`):
- If audio files exist in `public/media/audio/` (`ambient-gallery.mp3`, `final-reveal.mp3`, `ui-click.mp3`, `unlock.mp3`), it plays and loops them seamlessly with crossfading between sections.
- If no audio files are provided, the browser uses the **Web Audio API** to procedurally synthesize atmospheric cinematic drones and clean UI micro-sounds.
- The master sound toggle in the bottom control bar persists the user's choice across the session.

---

## 🎨 Project Structure

```text
src/
├── config/
│   └── siteConfig.ts          # Central site configuration
├── data/
│   └── galleryAssets.ts       # Manifest of photos and videos
├── types/
│   └── index.ts               # TypeScript interfaces
├── utils/
│   └── audio.ts               # Dual-engine audio manager
├── styles/
│   ├── theme.css              # Design tokens, color palette, gradients
│   └── global.css             # Cinematic styling & animations
├── components/
│   ├── PasswordGate.tsx       # Entry vault & birthdate passkey gate
│   ├── OpeningVideo.tsx       # Letterboxed player for jailer 2 ref lordson 2.mp4
│   ├── MemoryGallery.tsx      # Centerpiece 3D Orbit, Grid & Filmstrip gallery
│   ├── GalleryCard.tsx        # Responsive media card with hover lighting
│   ├── GalleryViewSwitcher.tsx# 3D Orbit / Grid / Filmstrip selector
│   ├── MediaLightbox.tsx      # Full-screen modal with swipe & keyboard navigation
│   ├── DoomsdayEndCard.tsx    # Climax card with Lordson & Doctor Doom backdrop
│   ├── Countdown.tsx          # Doomsday release countdown timer
│   ├── EmberParticles.tsx     # Canvas particle physics engine
│   └── ControlBar.tsx         # Persistent sound, motion & section jump bar
├── App.tsx                    # Master layout orchestrator
└── main.tsx                   # React root mount
```

---

**Dedication:**
*Done by ur FAV 💖✨ JASPER*
