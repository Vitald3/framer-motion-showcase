# 37 Monogram Motion Identity

High-precision vector motion identity system and multi-format animation assets for the 37 Monogram logo.

## Overview

The project provides an automated motion pipeline that transforms static SVG vector geometry into choreographed 60 FPS animation assets across web, mobile, and video formats. The engine preserves the exact 1:1 geometry of the source monogram (16 distinct geometric elements: 8 rectangles and 8 vector paths across digits 3 and 7).

Choreography variants implemented:
- **Signature**: Kinetic assembly along 45° vectors with directional luminance reveals, 45° specular sheen sweep, and coordinate lock.
- **Minimal**: Direct in-place mask reveal along native geometry vectors without spatial offset.
- **Blueprint**: Architectural construction guidelines displaying 45° vectors, center crosshairs, and radial alignment guides.

## Deliverables

All production assets are available in the `exports/` directory:

| Deliverable | Format | Resolution / Size | Runtime / Specs |
|-------------|--------|-------------------|-----------------|
| Master 4K Video | MP4 (H.264, YUV420p) | 2160×2160 | 60 fps, 2.0s |
| Master 1080p Video | MP4 (H.264, YUV420p) | 1080×1080 | 60 fps, 2.0s |
| Transparent Web Video | WebM (VP9 + Alpha) | 1080×1080 | 60 fps, 2.0s |
| ProRes Master Video | MOV (Apple ProRes 4444 + Alpha) | 1080×1080 | 60 fps, 2.0s |
| Vector Lottie | JSON (Bodymovin 5.7.4) | 800×800 (~110 KB) | 60 fps, 120 frames |
| Standalone Animated SVG | SVG (SMIL + Vector Masks) | 800×800 (~20 KB) | Native browser vector, zero dependencies |

## Tech Stack

- **GSAP & CustomEase**: Timing choreography engine with custom cubic-bezier curves.
- **SVG / SMIL**: Resolution-independent vector masks and path interpolation.
- **Lottie**: Cross-platform vector animation JSON for web, iOS, and Android.
- **Puppeteer & FFmpeg**: Headless browser frame capture and master video transcoding.
- **Node.js**: Pipeline CLI and export generators.

## Installation

Ensure [Node.js](https://nodejs.org/) (>= 18) is installed.

```bash
npm install
```

## Running the Showcase

Start the local preview server:

```bash
npm start
```

Or open `index.html` (or `preview/index.html`) directly in any modern browser.

### URL Query Parameters

- `/?logo`: Opens distraction-free, full-screen logo-only presentation mode (press `Esc` to return).
- `/?variant=signature|minimal|blueprint`: Selects active choreography.
- `/?bg=dark|black|grid|light`: Sets canvas background.
- `/?speed=0.25|0.5|1.0`: Sets playback speed multiplier.

## Build and Export Commands

Generate standalone animated SVG and Lottie JSON:

```bash
npm run build
```

Render master MP4, WebM, and ProRes video files (requires Chrome and FFmpeg):

```bash
npm run render:video
```

## Testing and Quality Verification

Run unit test suite:

```bash
npm test
```

Run TypeScript type check:

```bash
npm run typecheck
```

Run ESLint:

```bash
npm run lint
```

## Project Structure

```
├── exports/                         # Compiled production deliverables
│   ├── logo_animated.svg            # Standalone SMIL animated SVG
│   ├── logo_animation.json          # Lottie Bodymovin vector JSON
│   ├── logo_animation_1080p.mp4     # Master 1080p video
│   ├── logo_animation_4k.mp4        # Master 4K video
│   ├── logo_animation_transparent.mov   # ProRes 4444 with alpha
│   └── logo_animation_transparent.webm  # WebM VP9 with alpha
├── preview/                         # Interactive showcase web application
│   ├── index.html                   # Showcase interface and controls
│   ├── preview.gif                  # Motion preview loop
│   └── vendor/                      # Offline runtime dependencies (GSAP, Lottie)
├── sources/
│   └── Logo.svg                     # Source reference vector logo
├── src/
│   ├── animation_svg.js             # SVG geometry and mask definitions
│   ├── generate_standalone_svg.js   # Standalone SMIL SVG compiler
│   ├── lottie_export.js             # Lottie bezier compiler
│   ├── motion_timeline.js           # Choreography timeline engine
│   └── render_video.js              # Headless video rendering pipeline
├── test/
│   └── logo_animation.test.js       # Geometric integrity and deliverable tests
├── eslint.config.js                 # ESLint 9 configuration
├── index.html                       # Root application entry point
├── package.json                     # Project manifest and scripts
├── tsconfig.json                    # TypeScript configuration
└── .gitignore                       # Ignored build and runtime files
```
