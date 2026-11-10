# Lordson's 19th Birthday --- Interactive 3D Memory Gallery

**Implementation brief for Antigravity + Claude**\
**Birthday:** 15 November 2026\
**Recipient:** Lordson\
**Sign-off:** "Done by ur FAV 💖✨ JASPER"

------------------------------------------------------------------------

## 1. Project goal

Build a polished, cinematic, responsive birthday web experience for
Lordson's 19th birthday. It should feel like a premium interactive
fan-made movie experience---not a generic birthday template. The page
combines a password-gated opening video, a scroll-driven 3D photo/video
gallery, cinematic sound design, view-mode controls, and a final
*Avengers: Doomsday*-inspired end card.

**Core principle:** Use the assets I upload. Do not invent personal
photos or videos, and do not replace supplied assets with stock media.

## 2. Important content and configuration

Keep all changeable values in one clearly named configuration file (for
example, `src/config/siteConfig.ts` or `src/data/config.js`):

``` js
export const siteConfig = {
  recipientName: "Lordson",
  birthdayDate: "2026-11-15",
  birthdayAge: 19,
  passwordMode: "birthdate",
  // Configure the exact password format in the UI and here.
  // Suggested default: DDMMYYYY (for 15 November 2007, use 15112007).
  passwordFormat: "DDMMYYYY",
  openingVideo: "/media/opening-video.mp4",
  galleryAssets: [
    // Add uploaded photos and videos here, in the desired order.
    // Example: { type: "image", src: "/media/photo-01.jpg", alt: "Memory 1", caption: "" }
    // Example: { type: "video", src: "/media/clip-01.mp4", poster: "/media/clip-01-poster.jpg", caption: "" }
  ],
  doomsdayReleaseDate: "2026-12-18T00:00:00+05:30",
  timezone: "Asia/Kolkata",
  finalMessage: "Lordson will not return in Avengers: Doomsday",
  credit: "Done by ur FAV 💖✨ JASPER"
};
```

**Verify before launch:** The sample password assumes Lordson was born
on 15 November 2007. Confirm his actual birthdate and choose a format
before publishing. The Doomsday release date above is a configurable
default; verify the current official release date and update it if
necessary. Do not hard-code either value in multiple components.

## 3. User journey and page structure

### A. Cinematic entry / password gate

-   On first load, show a full-screen cinematic intro with a dark,
    smoky, Doomsday-inspired background, subtle particles, red ember
    accents, and dramatic lighting.
-   Display a restrained prompt such as **"A memory vault for Lordson"**
    and a password input.
-   The password is his birthdate, entered in the configured format.
    Show a format hint (e.g. `DDMMYYYY`) so the user knows how to enter
    it.
-   Include a show/hide password control, submit button, enter-key
    support, clear error state, and a short shake/glitch feedback
    animation for incorrect input.
-   On correct entry, transition smoothly into the supplied opening
    video.
-   Do not expose the password in visible client-side source code for a
    real deployment. A frontend-only password is only a playful gate and
    can be inspected or bypassed. If actual privacy matters, implement
    server-side verification or hosting-platform access control. Do not
    upload sensitive personal data to a public repository.
-   Never autoplay audio before user interaction. The user's password
    submission counts as an interaction, but still provide a clear sound
    toggle.

### B. Opening video

-   Play the video I upload, full-screen or within a cinematic
    letterboxed frame.
-   Include custom controls: play/pause, mute/unmute, volume, replay,
    and **Skip to memories**.
-   Use `object-fit: contain` so the video is not accidentally cropped.
    Use a poster image if available.
-   When playback ends, display a tasteful cue such as **"Scroll to
    unlock the memories ↓"** and smoothly reveal the gallery section.
-   If the browser blocks playback, show a clear Play button rather than
    leaving a blank screen.
-   Respect reduced-motion settings and mobile bandwidth; avoid loading
    every gallery video immediately.

### C. Scroll-driven 3D memory gallery

-   Make this the visual centerpiece: layered cards floating in depth,
    subtle perspective, smooth parallax, and a cinematic dark
    environment.
-   Each uploaded image or video should become an individual interactive
    card with rounded corners, restrained glow, edge lighting, and
    hover/touch feedback.
-   Use scroll-driven depth and staggered reveals. Keep motion smooth
    and purposeful; avoid excessive spinning or effects that make the
    media hard to view.
-   Every image/video card must open into a **full-screen
    lightbox/modal** when selected.
    -   Images: show the entire image with contain-fit, previous/next
        navigation, close button, index counter, and Escape-key support.
    -   Videos: show playback controls, pause other media when opened,
        and cleanly stop/reset playback when closed.
    -   Clicking the backdrop or pressing Escape should close the
        lightbox.
    -   On mobile, support swipe navigation where practical.
-   Include optional captions below cards. If no caption is supplied, do
    not invent one.
-   Include a visible **view selector** with at least:
    1.  **3D Orbit** --- depth-based card layout with gentle parallax.
    2.  **Grid** --- neat responsive image/video grid.
    3.  **Filmstrip** --- horizontal cinematic sequence.
-   The selected view should change without resetting the visitor's
    position or losing the current gallery item.
-   Add a sound toggle and a motion toggle in a persistent but
    unobtrusive control area.
-   Provide a loading state, empty-gallery state, and graceful fallback
    if WebGL/3D effects are unsupported. The gallery must still work as
    a normal grid without WebGL.

### D. Cinematic final section

Create a dramatic end-card inspired by the mood of *Avengers: Doomsday*:
charcoal-black atmosphere, smoke, ash/embers, deep crimson light,
metallic highlights, monumental scale, and a strong central silhouette
composition.

**Backdrop direction:** Compose an original cinematic scene with Lordson
and a Doctor Doom-like armored figure standing side by side, both
raising their arms above shoulder level in a powerful, triumphant pose.
Keep the figures as background/hero silhouettes so the message stays
legible. If using a supplied image, use that asset; otherwise create an
original fan-art-inspired visual. Avoid using official movie logos,
actor likenesses, or copied poster artwork unless I provide assets I
have rights to use.

**Main text --- preserve exactly:** \> Lordson will not return in
Avengers: Doomsday

-   Make the text huge, centered, and readable on desktop and mobile.
-   Use a bold, condensed, cinematic metallic display font with a
    weathered steel texture and subtle bevel/glow. Use a licensed or
    freely available font; if an exact "Doomsday" typeface is
    unavailable, use the closest legally usable visual equivalent rather
    than copying a proprietary logo.
-   Keep contrast high. Add a subtle entrance animation (slow reveal,
    ember sweep, or metallic light pass) without making the words
    difficult to read.
-   Include the line **"THE FILM IS NOT RATED"** as a small
    movie-rating-style disclaimer.
-   Add a countdown timer to the configured *Avengers: Doomsday* release
    date. Show days, hours, minutes, and seconds, updating once per
    second. Label it clearly, e.g. **"COUNTDOWN TO DOOMSDAY"**.
-   Handle the countdown states correctly: if the target is in the
    future, count down; at zero, show **"DOOMSDAY IS HERE"**; if the
    configured date has passed, do not show negative values.
-   Use the `Asia/Kolkata` timezone consistently and make the target
    date easy to update.
-   At the very bottom, display this exact credit: \> Done by ur FAV
    💖✨ JASPER

The credit should feel like a signature: elegant, bright enough to read,
and visually distinct from the dramatic main title.

## 4. Sound and music direction

Create a cinematic but user-friendly sound experience: - A **master
sound toggle** must be visible and remember the user's preference during
the session. - Add optional, subtle UI sounds: button hover/click,
password accepted/denied, gallery card selection, view transition,
lightbox open/close, and final reveal. - Use royalty-free/licensed audio
files I provide or explicitly select. Do not scrape copyrighted film
scores or rip audio from movie trailers. - Use a low-volume atmospheric
ambient bed during the gallery and a separate dramatic track for the
final section if licensed audio is available. - Keep all audio muted
until the visitor opts in or interacts with a clear sound control. Never
surprise-blast audio. - Avoid playing multiple music tracks
simultaneously. Fade between sections with short volume ramps. - Ensure
the experience still works completely with sound off. - Include fallback
behavior if audio files are missing or fail to load.

Suggested asset layout:

``` text
public/
  media/
    opening-video.mp4
    images/
    videos/
    audio/
      ambient-gallery.mp3
      final-reveal.mp3
      ui-click.mp3
      unlock.mp3
    backgrounds/
      doomsday-inspired-background.webp
```

## 5. Visual design system

-   **Mood:** cinematic, ominous, premium, emotional, dark sci-fi.
-   **Palette:** near-black, graphite, gunmetal, muted silver, deep
    crimson, restrained warm ember orange. Do not make electric blue the
    dominant accent.
-   **Materials:** smoky glass panels, brushed metal, soft bloom, ash
    particles, film grain used sparingly.
-   **Typography:** clean modern sans-serif for UI; bold condensed
    metallic display type for the final title.
-   **Motion:** smooth, deliberate, cinematic; use easing and staggered
    timing rather than constant movement.
-   **Background:** use a subtle gradient and original/supplied visual
    assets. Add a dark overlay behind text to preserve legibility.
-   **Responsive design:** design for desktop first but fully support
    mobile portrait, tablet, touch controls, and different aspect
    ratios.
-   **Accessibility:** semantic HTML, keyboard navigation, visible focus
    indicators, descriptive alt text, adequate contrast, reduced-motion
    support, and captions where supplied.
-   Avoid clutter, generic birthday balloons, confetti overload, and
    childish template styling.

## 6. Technical implementation requirements

Use the project's existing stack if one already exists. If starting
fresh, choose a modern React + TypeScript setup (Vite is a good default)
with CSS modules or a well-organized styling system.

Suggested implementation: - React + TypeScript - CSS
transforms/perspective for lightweight 3D; use Three.js or React Three
Fiber only if it adds clear value. - Framer Motion or CSS animations for
transitions, with reduced-motion alternatives. - A reusable gallery data
model that supports images and videos. - A reusable full-screen lightbox
component. - A reusable countdown component driven by the configured
target date. - A single audio manager to prevent overlapping tracks and
centralize mute/volume state. - Lazy-load gallery media and use
thumbnails/posters for videos. - Avoid giant uncompressed images and
videos; document recommended media sizes and formats. - Keep components
modular, typed, and easy to modify. - Do not use fake controls: every
visible button must work. - Include a README with setup, run, build,
deployment, and instructions for replacing media assets and changing the
password/date. - Ensure no console errors, broken paths, layout
overflow, or inaccessible controls.

Possible component structure:

``` text
src/
  components/
    PasswordGate.tsx
    OpeningVideo.tsx
    MemoryGallery.tsx
    GalleryCard.tsx
    GalleryViewSwitcher.tsx
    MediaLightbox.tsx
    AudioManager.tsx
    DoomsdayEndCard.tsx
    Countdown.tsx
  data/
    galleryAssets.ts
  config/
    siteConfig.ts
  styles/
    global.css
    theme.css
  App.tsx
```

## 7. Asset placeholders and upload workflow

Use obvious placeholders until I upload files. Do not fabricate memories
or captions.

-   `public/media/opening-video.mp4` --- the opening video.
-   `public/media/images/` --- uploaded photos.
-   `public/media/videos/` --- uploaded clips.
-   `public/media/audio/` --- licensed or supplied music and sound
    effects.
-   `public/media/backgrounds/` --- supplied background art, if any.

Create a simple asset manifest so I can add, remove, reorder, and
caption gallery items by editing one file. If a file is missing, show a
helpful placeholder in development and avoid a broken-image icon in
production.

## 8. Acceptance checklist

The build is complete only when all of the following work:

-   [ ] Password gate accepts the configured birthdate format and
    rejects incorrect entries.
-   [ ] Correct password opens the supplied video.
-   [ ] Video has working controls, skip option, and end-of-video
    transition.
-   [ ] Scrolling reveals the interactive 3D gallery.
-   [ ] Photos and videos both render correctly.
-   [ ] Every gallery item opens full-screen and can be closed reliably.
-   [ ] Previous/next controls and keyboard navigation work in the
    lightbox.
-   [ ] 3D Orbit, Grid, and Filmstrip view modes work.
-   [ ] Sound toggle works, sound never unexpectedly starts at high
    volume, and mute is respected.
-   [ ] Gallery and final-section music do not overlap.
-   [ ] Final statement is exactly "Lordson will not return in Avengers:
    Doomsday".
-   [ ] "THE FILM IS NOT RATED" is visible.
-   [ ] Countdown uses the configurable release date and never displays
    negative time.
-   [ ] Final credit is exactly "Done by ur FAV 💖✨ JASPER".
-   [ ] Layout works on desktop and mobile.
-   [ ] Reduced-motion and sound-off experiences remain usable.
-   [ ] No missing media paths, dead buttons, console errors, or
    horizontal overflow.
-   [ ] README explains how to replace assets and configure
    dates/password.

## 9. Instructions for Antigravity and Claude

**Do not try to generate the entire application in one unverified
pass.** Build and test it in milestones. Inspect the existing repository
first, preserve working code, and explain any major dependency choices.

### Milestone 1 --- Project inspection and plan

1.  Inspect the repository and identify its framework, existing assets,
    and run commands.
2.  Summarize the implementation plan and flag any missing information.
3.  Do not overwrite existing work without checking it first.

### Milestone 2 --- Core experience

1.  Implement the configuration file, password gate, opening video, and
    section transitions.
2.  Add sample manifest entries only as clearly labeled placeholders.
3.  Run the app and fix any errors.

### Milestone 3 --- Gallery

1.  Implement 3D Orbit, Grid, and Filmstrip views.
2.  Add image/video support, lazy loading, full-screen lightbox,
    keyboard navigation, and mobile controls.
3.  Test with a mix of landscape, portrait, and video assets.

### Milestone 4 --- Audio and final card

1.  Add the centralized audio manager and sound toggle.
2.  Build the Doomsday-inspired final card, exact text, rating
    disclaimer, configurable countdown, and final credit.
3.  Verify no audio overlap and ensure the text remains readable over
    the background.

### Milestone 5 --- QA and handoff

1.  Run lint/type checks and production build if available.
2.  Test keyboard, mobile layout, reduced motion, missing media,
    incorrect password, and countdown edge cases.
3.  Fix issues rather than merely listing them.
4.  Provide a concise summary of files changed, commands to run, how to
    add my media, and any remaining blockers.

**Final instruction:** Prioritize a beautiful, coherent, usable
experience over unnecessary effects. Every animation, sound, and
interaction should support the birthday reveal and the memories.
