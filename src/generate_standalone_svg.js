// Generator for standalone animated SVG (SMIL + Vector Masks)
// Runs natively in all browsers, zero JS runtime required, works in <img> and <object> tags.

const fs = require('fs');
const path = require('path');
const { ORIGINAL_SVG_DATA } = require('./animation_svg.js');

function generateStandaloneAnimatedSVG() {
  const artboardWidth = 800;
  const artboardHeight = 800;
  const dx = (artboardWidth - 497) / 2;
  const dy = (artboardHeight - 539) / 2;

  let defs = `
  <defs>
    <!-- Organic Luminous Linear Gradient for Directional Reveals -->
    <linearGradient id="linear_reveal_grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="68%" stop-color="#ffffff" stop-opacity="1"/>
      <stop offset="88%" stop-color="#ffffff" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>

    <!-- Specular Highlight Sheen Gradient (45 degree pass) -->
    <linearGradient id="sheen_linear" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.12"/>
      <stop offset="50%" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="65%" stop-color="#ffffff" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </linearGradient>

    <!-- DIRECTIONAL VECTOR REVEAL MASKS WITH EMBEDDED SMIL KEYSPLINE TIMING -->
`;

  // Timing constants matching motion_timeline.js
  const timingMap = {
    p10_seven_diag_outer: { dur: "0.68s", begin: "0.12s", targetW: 560 },
    p15_seven_diag_inner: { dur: "0.68s", begin: "0.15s", targetW: 580 },
    p01_three_diag_outer: { dur: "0.64s", begin: "0.16s", targetW: 390 },
    p03_three_diag_inner: { dur: "0.64s", begin: "0.19s", targetW: 320 },
    p09_seven_top_outer:  { dur: "0.52s", begin: "0.28s", targetW: 260 },
    p04_seven_top_inner:  { dur: "0.50s", begin: "0.31s", targetW: 180 },
    p12_seven_vert_outer: { dur: "0.48s", begin: "0.36s", targetW: 150 },
    p13_seven_vert_inner: { dur: "0.44s", begin: "0.39s", targetW: 80 },
    p00_three_top_outer:  { dur: "0.52s", begin: "0.30s", targetW: 240 },
    p02_three_top_inner:  { dur: "0.48s", begin: "0.34s", targetW: 160 },
    p08_three_chamfer:    { dur: "0.46s", begin: "0.36s", targetW: 180 },
    p11_three_mid_conn:   { dur: "0.42s", begin: "0.40s", targetW: 110 },
    p14_three_bottom_cap: { dur: "0.44s", begin: "0.46s", targetW: 100 },
    p05_seven_bottom_cap: { dur: "0.42s", begin: "0.50s", targetW: 100 }
  };

  ORIGINAL_SVG_DATA.elements.forEach(el => {
    if (el.motion === "arc") return;
    const t = timingMap[el.id];
    const maskId = `mask_${el.id}`;

    let transformStr = "";
    let rectParams = { x: "0", y: "-30", w: "0", h: "85" };

    if (el.motion === "diag_down_left") {
      transformStr = `translate(${el.originX}, ${el.originY}) rotate(${el.angle})`;
      rectParams = { x: "0", y: "-100", w: "0", h: "200" };
    } else if (el.motion === "horiz_r") {
      transformStr = `translate(${el.startX}, ${el.startY})`;
      rectParams = { x: "0", y: "-30", w: "0", h: "85" };
    } else if (el.motion === "horiz_l") {
      transformStr = `translate(${el.startX}, ${el.startY}) rotate(180)`;
      rectParams = { x: "0", y: "-45", w: "0", h: "85" };
    } else if (el.motion === "vert_down") {
      transformStr = `translate(${el.startX}, ${el.startY}) rotate(90)`;
      rectParams = { x: "0", y: "-30", w: "0", h: "90" };
    }

    defs += `    <mask id="${maskId}">
      <g transform="${transformStr}">
        <rect id="rect_${el.id}" x="${rectParams.x}" y="${rectParams.y}" width="0" height="${rectParams.h}" fill="url(#linear_reveal_grad)">
          <animate attributeName="width" from="0" to="${t.targetW}" dur="${t.dur}" begin="${t.begin}" fill="freeze" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1"/>
          <animate attributeName="fill" to="#ffffff" dur="0.16s" begin="0.94s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" keyTimes="0;1"/>
        </rect>
      </g>
    </mask>\n`;
  });

  // Circular arc sweep mask
  defs += `    <!-- Concentric circular sweep mask for Digit 3 Belly -->
    <mask id="mask_three_arcs">
      <circle cx="159.884" cy="265.019" r="125" fill="none"
              stroke="white" stroke-width="125" stroke-linecap="butt"
              stroke-dasharray="720 720" stroke-dashoffset="720"
              transform="rotate(-95 159.884 265.019)">
        <animate attributeName="stroke-dashoffset" from="720" to="0" dur="0.74s" begin="0.22s" fill="freeze" calcMode="spline" keySplines="0.25 1 0.45 1" keyTimes="0;1"/>
      </circle>
    </mask>

    <!-- Combined mask of all 16 elements for specular sheen pass -->
    <mask id="full_monogram_mask">
      <g>
`;
  ORIGINAL_SVG_DATA.elements.forEach(el => {
    if (el.type === "rect") {
      const tr = el.transform ? ` transform="${el.transform}"` : "";
      defs += `        <rect x="${el.x}" y="${el.y || 0}" width="${el.width}" height="${el.height}"${tr} fill="white"/>\n`;
    } else {
      defs += `        <path d="${el.d}" fill="white"/>\n`;
    }
  });
  defs += `      </g>
    </mask>
  </defs>\n`;

  // Body elements with spatial convergence
  let body = `  <g id="master_container" transform="translate(${dx}, ${dy})">\n`;

  ORIGINAL_SVG_DATA.elements.forEach(el => {
    const maskAttr = (el.motion === "arc") ? `mask="url(#mask_three_arcs)"` : `mask="url(#mask_${el.id})"`;

    let initX = 0, initY = 0;
    if (el.group === "seven") {
      if (el.motion === "diag_down_left") { initX = 14; initY = -14; }
      else if (el.motion === "vert_down") { initX = 0; initY = -12; }
      else if (el.motion === "horiz_r") { initX = -12; initY = 0; }
    } else {
      if (el.motion === "diag_down_left") { initX = 9; initY = -9; }
      else if (el.motion === "horiz_r" || el.motion === "horiz_l") { initX = -10; initY = 0; }
    }

    body += `    <g class="logo-element" ${maskAttr} transform="translate(${initX}, ${initY})">\n`;
    if (initX !== 0 || initY !== 0) {
      body += `      <animateTransform attributeName="transform" type="translate" from="${initX} ${initY}" to="0 0" dur="0.86s" begin="0.22s" fill="freeze" calcMode="spline" keySplines="0.16 1 0.3 1" keyTimes="0;1"/>\n`;
    }

    if (el.type === "rect") {
      const tr = el.transform ? ` transform="${el.transform}"` : "";
      body += `      <rect x="${el.x}" y="${el.y || 0}" width="${el.width}" height="${el.height}"${tr} fill="#d4d8e6">
        <animate attributeName="fill" to="#ffffff" dur="0.25s" begin="1.15s" fill="freeze"/>
      </rect>\n`;
    } else {
      body += `      <path d="${el.d}" fill="#d4d8e6">
        <animate attributeName="fill" to="#ffffff" dur="0.25s" begin="1.15s" fill="freeze"/>
      </path>\n`;
    }
    body += `    </g>\n`;
  });

  // Specular sheen sweep overlay
  body += `    <!-- Specular Sheen Pass -->
    <g id="sheen_layer" mask="url(#full_monogram_mask)" opacity="0">
      <animate attributeName="opacity" values="0; 1; 1; 0" keyTimes="0; 0.25; 0.75; 1" dur="0.44s" begin="1.10s" fill="freeze"/>
      <g transform="rotate(45 250 270)">
        <rect x="-300" y="-500" width="380" height="1300" fill="url(#sheen_linear)">
          <animate attributeName="y" from="-500" to="400" dur="0.44s" begin="1.10s" fill="freeze" calcMode="spline" keySplines="0.38 0 0.22 1" keyTimes="0;1"/>
        </rect>
      </g>
    </g>\n`;

  body += `  </g>\n`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${artboardWidth} ${artboardHeight}" width="100%" height="100%">
${defs}${body}</svg>`;
}

function run() {
  const svgContent = generateStandaloneAnimatedSVG();
  fs.writeFileSync(path.join(__dirname, '..', 'exports', 'logo_animated.svg'), svgContent, 'utf-8');
  console.log('Compiled exports/logo_animated.svg (' + svgContent.length + ' bytes)');
}

if (require.main === module) {
  run();
}

module.exports = { generateStandaloneAnimatedSVG, run };

