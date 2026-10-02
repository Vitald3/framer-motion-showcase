const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { generateMasterSVG, ORIGINAL_SVG_DATA } = require('./animation_svg.js');

const FPS = 60;
const DURATION_SEC = 2.0;
const TOTAL_FRAMES = Math.round(FPS * DURATION_SEC); // 120 frames

async function createHarnessHTML(options = {}) {
  const {
    artboardSize = 1080,
    background = "#090a0f",
    variant = "signature"
  } = options;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: ${artboardSize}px;
      height: ${artboardSize}px;
      overflow: hidden;
      background: ${background};
      display: flex;
      justify-content: center;
      align-items: center;
    }
    #logo_container {
      width: ${artboardSize}px;
      height: ${artboardSize}px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  </style>
  <script src="${path.resolve(__dirname, '../node_modules/gsap/dist/gsap.min.js')}"></script>
  <script src="${path.resolve(__dirname, '../node_modules/gsap/dist/CustomEase.min.js')}"></script>
  <script src="${path.resolve(__dirname, 'motion_timeline.js')}"></script>
</head>
<body>
  <div id="logo_container">
    ${generateMasterSVG({
      artboardWidth: artboardSize,
      artboardHeight: artboardSize,
      centerInArtboard: true,
      background: "transparent",
      includeBlueprint: (variant === "blueprint" || variant === "C")
    })}
  </div>

  <script>
    const elementsData = ${JSON.stringify(ORIGINAL_SVG_DATA.elements)};
    window.masterTL = createLogoAnimationTimeline(gsap, CustomEase, elementsData, {
      variant: "${variant}"
    });
  </script>
</body>
</html>`;

  const tmpPath = path.resolve(__dirname, `../temp_harness_${artboardSize}_${variant}.html`);
  fs.writeFileSync(tmpPath, html);
  return tmpPath;
}

async function renderVideo(config) {
  const {
    outputPath,
    width,
    height,
    background = "#090a0f",
    variant = "signature",
    ffmpegArgs
  } = config;

  console.log(`\n======================================================`);
  console.log(`[RENDER START] -> ${outputPath}`);
  console.log(`Dimensions: ${width}x${height} @ ${FPS}fps | Total frames: ${TOTAL_FRAMES}`);

  const harnessPath = await createHarnessHTML({
    artboardSize: width,
    background: background,
    variant: variant
  });

  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width, height, deviceScaleFactor: 1 });
  await page.goto('file://' + harnessPath, { waitUntil: 'load' });

  // Spawn FFmpeg process
  const ffmpeg = spawn('ffmpeg', ffmpegArgs);

  ffmpeg.stderr.on('data', (data) => {
    // Only print error messages if any
    const str = data.toString();
    if (str.includes('Error') || str.includes('Invalid')) {
      console.error('[FFmpeg Error]', str);
    }
  });

  const startTime = Date.now();

  for (let f = 0; f < TOTAL_FRAMES; f++) {
    const timeSec = f / FPS;
    await page.evaluate((t) => {
      /** @type {any} */ (window).masterTL.seek(t);
    }, timeSec);

    const screenshotBuffer = await page.screenshot({
      type: 'png',
      omitBackground: (background === "transparent")
    });

    // Write PNG frame to FFmpeg stdin pipe
    const ok = ffmpeg.stdin.write(screenshotBuffer);
    if (!ok) {
      await new Promise(resolve => ffmpeg.stdin.once('drain', resolve));
    }

    if (f % 20 === 0 || f === TOTAL_FRAMES - 1) {
      const pct = Math.round((f / (TOTAL_FRAMES - 1)) * 100);
      process.stdout.write(`Rendering frame ${f + 1}/${TOTAL_FRAMES} (${pct}%)...\r`);
    }
  }

  ffmpeg.stdin.end();

  await new Promise((resolve, reject) => {
    ffmpeg.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`FFmpeg exited with code ${code}`));
    });
  });

  await browser.close();
  try { fs.unlinkSync(harnessPath); } catch {}

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const stats = fs.statSync(outputPath);
  console.log(`\n[RENDER COMPLETE] -> ${outputPath} (${(stats.size / 1024 / 1024).toFixed(2)} MB in ${elapsed}s)\n`);
}

async function runAllRenders() {
  const exportsDir = path.resolve(__dirname, '../exports');
  if (!fs.existsSync(exportsDir)) {
    fs.mkdirSync(exportsDir, { recursive: true });
  }

  // 1. Master 1080p MP4 (High profile, H.264, 60fps)
  await renderVideo({
    outputPath: path.join(exportsDir, 'logo_animation_1080p.mp4'),
    width: 1080,
    height: 1080,
    background: "#08090d",
    variant: "signature",
    ffmpegArgs: [
      '-y',
      '-f', 'image2pipe',
      '-vcodec', 'png',
      '-r', String(FPS),
      '-i', '-',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-crf', '14',
      '-preset', 'slow',
      '-movflags', '+faststart',
      path.join(exportsDir, 'logo_animation_1080p.mp4')
    ]
  });

  // 2. Master Transparent WebM (VP9 with Alpha Channel, 60fps)
  await renderVideo({
    outputPath: path.join(exportsDir, 'logo_animation_transparent.webm'),
    width: 1080,
    height: 1080,
    background: "transparent",
    variant: "signature",
    ffmpegArgs: [
      '-y',
      '-f', 'image2pipe',
      '-vcodec', 'png',
      '-r', String(FPS),
      '-i', '-',
      '-c:v', 'libvpx-vp9',
      '-pix_fmt', 'yuva420p',
      '-b:v', '6M',
      '-auto-alt-ref', '0',
      path.join(exportsDir, 'logo_animation_transparent.webm')
    ]
  });

  // 3. Master Transparent ProRes 4444 MOV (Alpha Channel)
  await renderVideo({
    outputPath: path.join(exportsDir, 'logo_animation_transparent.mov'),
    width: 1080,
    height: 1080,
    background: "transparent",
    variant: "signature",
    ffmpegArgs: [
      '-y',
      '-f', 'image2pipe',
      '-vcodec', 'png',
      '-r', String(FPS),
      '-i', '-',
      '-c:v', 'prores_ks',
      '-profile:v', '4444',
      '-pix_fmt', 'yuva444p10le',
      path.join(exportsDir, 'logo_animation_transparent.mov')
    ]
  });

  // 4. Master 4K MP4 (2160x2160, 60fps)
  await renderVideo({
    outputPath: path.join(exportsDir, 'logo_animation_4k.mp4'),
    width: 2160,
    height: 2160,
    background: "#08090d",
    variant: "signature",
    ffmpegArgs: [
      '-y',
      '-f', 'image2pipe',
      '-vcodec', 'png',
      '-r', String(FPS),
      '-i', '-',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-crf', '14',
      '-preset', 'slow',
      '-movflags', '+faststart',
      path.join(exportsDir, 'logo_animation_4k.mp4')
    ]
  });

  console.log("ALL MASTER RENDERS COMPLETED SUCCESSFULLY!");
}

runAllRenders().catch(err => {
  console.error("Render failed:", err);
  process.exit(1);
});
