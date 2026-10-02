// High-Precision Vector SVG Generator for 37 Monogram Logo Animation
// Preserves exact 1:1 geometry of sources/Logo.svg

const ORIGINAL_SVG_DATA = {
  viewBox: "0 0 497 539",
  width: 497,
  height: 539,
  elements: [
    // [00] Digit 3: top outer horizontal
    { id: "p00_three_top_outer", type: "rect", x: 106.559, y: 0, width: 210.079, height: 25, group: "three", motion: "horiz_r", length: 240, startX: 106.559, startY: 0 },
    // [01] Digit 3: upper outer diagonal
    { id: "p01_three_diag_outer", type: "path", d: "M106.126 240.019H70.7705L310.788 0.000488281H346.144L106.126 240.019Z", group: "three", motion: "diag_down_left", length: 390, originX: 346.144, originY: 0, angle: 135 },
    // [02] Digit 3: top inner horizontal
    { id: "p02_three_top_inner", type: "rect", x: 66.041, y: 50, width: 127.954, height: 25, group: "three", motion: "horiz_r", length: 160, startX: 66.041, startY: 50 },
    // [03] Digit 3: upper inner diagonal
    { id: "p03_three_diag_inner", type: "path", d: "M35.4111 240.019H0.0556641L190.074 50H225.43L35.4111 240.019Z", group: "three", motion: "diag_down_left", length: 320, originX: 225.43, originY: 50, angle: 135 },
    // [04] Digit 7: top inner horizontal
    { id: "p04_seven_top_inner", type: "rect", x: 270.154, y: 154.756, width: 150.859, height: 25, group: "seven", motion: "horiz_r", length: 180, startX: 270.154, startY: 154.756 },
    // [05] Digit 7: bottom cap
    { id: "p05_seven_bottom_cap", type: "rect", x: 105.222, y: 513.249, width: 70.374, height: 25, group: "seven", motion: "horiz_r", length: 100, startX: 105.222, startY: 513.249 },
    // [06] Digit 3: outer arc loop
    { id: "p06_three_arc_outer", type: "path", d: "M276.196 154.757C303.44 183.486 320.154 222.3 320.154 265.019L320.142 267.09C319.032 354.65 247.707 425.289 159.884 425.289L157.812 425.276C74.0027 424.215 5.69938 358.824 0 276.211H25.0713C30.7618 345.682 88.9448 400.289 159.884 400.289C234.591 400.289 295.154 339.726 295.154 265.019C295.154 219.526 272.697 179.278 238.264 154.757H276.196Z", group: "three", motion: "arc" },
    // [07] Digit 3: inner arc loop
    { id: "p07_three_arc_inner", type: "path", d: "M161.317 154.765C221.556 155.528 270.154 204.598 270.154 265.018L270.146 266.442C269.383 326.681 220.313 375.279 159.893 375.279L158.468 375.271C102.17 374.557 56.0408 331.651 50.2461 276.72H75.4287C81.1321 318.271 116.774 350.279 159.893 350.279C206.981 350.279 245.154 312.106 245.154 265.018C245.154 218.137 207.318 180.095 160.516 179.76V154.759L161.317 154.765Z", group: "three", motion: "arc" },
    // [08] Digit 3: top left chamfer
    { id: "p08_three_chamfer", type: "path", d: "M66.3477 75H31.0742L31.0332 74.959L105.992 0H141.348L66.3477 75Z", group: "three", motion: "diag_down_left", length: 180, originX: 141.348, originY: 0, angle: 145.7 },
    // [09] Digit 7: top outer horizontal
    { id: "p09_seven_top_outer", type: "path", d: "M476.826 129.755H251.776L276.776 104.755H476.826V129.755Z", group: "seven", motion: "horiz_r", length: 260, startX: 251.776, startY: 104.755 },
    // [10] Digit 7: long outer diagonal
    { id: "p10_seven_diag_outer", type: "path", d: "M496.014 208.072V226.251L184.016 538.249H148.66L487.426 199.484L496.014 208.072Z", group: "seven", motion: "diag_down_left", length: 560, originX: 496.014, originY: 208.072, angle: 135 },
    // [11] Digit 3: middle horizontal connector
    { id: "p11_three_mid_conn", type: "rect", x: 26.7178, y: 215.019, width: 78.6479, height: 25, group: "three", motion: "horiz_l", length: 110, startX: 105.3657, startY: 215.019 },
    // [12] Digit 7: right outer vertical
    { id: "p12_seven_vert_outer", type: "rect", x: 471.014, y: 225.628, width: 120.873, height: 25, transform: "rotate(-90 471.014 225.628)", group: "seven", motion: "vert_down", length: 150, startX: 471.014, startY: 104.755 },
    // [13] Digit 7: right inner vertical
    { id: "p13_seven_vert_inner", type: "rect", x: 421.014, y: 204.837, width: 50.0806, height: 25, transform: "rotate(-90 421.014 204.837)", group: "seven", motion: "vert_down", length: 80, startX: 421.014, startY: 154.756 },
    // [14] Digit 3: bottom left horizontal cap
    { id: "p14_three_bottom_cap", type: "rect", x: 5.31738, y: 276.211, width: 70.1117, height: 25, group: "three", motion: "horiz_r", length: 100, startX: 5.31738, startY: 276.211 },
    // [15] Digit 7: long inner diagonal
    { id: "p15_seven_diag_inner", type: "path", d: "M446.014 184.439V205.554L113.317 538.25H77.9629L438.894 177.319L446.014 184.439Z", group: "seven", motion: "diag_down_left", length: 580, originX: 446.014, originY: 184.439, angle: 135 }
  ]
};

function generateMasterSVG(options = {}) {
  const {
    embedSheen = true,
    artboardWidth = 800,
    artboardHeight = 800,
    centerInArtboard = true,
    background = "transparent",
    includeBlueprint = true
  } = options;

  const dx = centerInArtboard ? (artboardWidth - 497) / 2 : 0;
  const dy = centerInArtboard ? (artboardHeight - 539) / 2 : 0;

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

    <!-- MASKS FOR EACH GEOMETRIC COMPONENT -->
`;

  // Generate masks for all elements
  ORIGINAL_SVG_DATA.elements.forEach((el) => {
    const maskId = `mask_${el.id}`;
    if (el.motion === "diag_down_left") {
      defs += `    <mask id="${maskId}">
      <g transform="translate(${el.originX}, ${el.originY}) rotate(${el.angle})">
        <rect id="rect_${el.id}" x="0" y="-100" width="0" height="200" fill="url(#linear_reveal_grad)"/>
      </g>
    </mask>\n`;
    } else if (el.motion === "horiz_r") {
      defs += `    <mask id="${maskId}">
      <g transform="translate(${el.startX}, ${el.startY})">
        <rect id="rect_${el.id}" x="0" y="-30" width="0" height="85" fill="url(#linear_reveal_grad)"/>
      </g>
    </mask>\n`;
    } else if (el.motion === "horiz_l") {
      defs += `    <mask id="${maskId}">
      <g transform="translate(${el.startX}, ${el.startY}) rotate(180)">
        <rect id="rect_${el.id}" x="0" y="-45" width="0" height="85" fill="url(#linear_reveal_grad)"/>
      </g>
    </mask>\n`;
    } else if (el.motion === "vert_down") {
      defs += `    <mask id="${maskId}">
      <g transform="translate(${el.startX}, ${el.startY}) rotate(90)">
        <rect id="rect_${el.id}" x="0" y="-30" width="0" height="90" fill="url(#linear_reveal_grad)"/>
      </g>
    </mask>\n`;
    }
  });

  // Concentric arc mask for [06] and [07]
  // Covers angles from -95 deg to +220 deg
  defs += `    <!-- Concentric circular sweep mask for Digit 3 Belly -->
    <mask id="mask_three_arcs">
      <circle id="circle_three_arcs" cx="159.884" cy="265.019" r="125" fill="none"
              stroke="white" stroke-width="125" stroke-linecap="butt"
              stroke-dasharray="720 720" stroke-dashoffset="720"
              transform="rotate(-95 159.884 265.019)"/>
    </mask>

    <!-- Combined mask of all 16 elements for the specular sheen pass -->
    <mask id="full_monogram_mask">
      <g id="mask_monogram_shapes">
`;

  // Insert original exact raw geometry into the full_monogram_mask
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

  // Body of SVG
  let body = "";
  if (background && background !== "transparent") {
    body += `  <rect id="svg_bg" width="100%" height="100%" fill="${background}"/>\n`;
  }

  // Geometric construction guidelines overlay
  if (includeBlueprint) {
    body += `  <g id="blueprint_guides" style="opacity: 0; pointer-events: none;" transform="translate(${dx}, ${dy})">
    <!-- Geometric 45-degree guide rays -->
    <line x1="-100" y1="-100" x2="600" y2="600" stroke="#38bdf8" stroke-width="0.75" stroke-dasharray="4 6" opacity="0.35"/>
    <line x1="346" y1="0" x2="-50" y2="396" stroke="#38bdf8" stroke-width="0.75" stroke-dasharray="4 6" opacity="0.35"/>
    <line x1="496" y1="208" x2="148" y2="556" stroke="#38bdf8" stroke-width="0.75" stroke-dasharray="4 6" opacity="0.35"/>
    <!-- Center coordinate crosshair -->
    <circle cx="159.884" cy="265.019" r="160.27" fill="none" stroke="#38bdf8" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.25"/>
    <circle cx="159.884" cy="265.019" r="110.26" fill="none" stroke="#38bdf8" stroke-width="0.5" stroke-dasharray="2 4" opacity="0.25"/>
    <circle cx="159.884" cy="265.019" r="2.5" fill="#38bdf8" opacity="0.5"/>
  </g>\n`;
  }

  body += `  <g id="master_container" transform="translate(${dx}, ${dy})">\n`;

  // Render elements wrapped in their motion groups
  ORIGINAL_SVG_DATA.elements.forEach(el => {
    const maskAttr = (el.motion === "arc") ? `mask="url(#mask_three_arcs)"` : `mask="url(#mask_${el.id})"`;
    body += `    <g id="group_${el.id}" class="logo-element ${el.group}-element" ${maskAttr}>\n`;
    if (el.type === "rect") {
      const tr = el.transform ? ` transform="${el.transform}"` : "";
      body += `      <rect id="raw_${el.id}" x="${el.x}" y="${el.y || 0}" width="${el.width}" height="${el.height}"${tr} fill="white"/>\n`;
    } else {
      body += `      <path id="raw_${el.id}" d="${el.d}" fill="white"/>\n`;
    }
    body += `    </g>\n`;
  });

  // Specular sheen overlay (masked by the exact monogram geometry)
  if (embedSheen) {
    body += `    <!-- Cohesive Specular Surface Reflection -->
    <g id="sheen_layer" mask="url(#full_monogram_mask)" style="opacity: 0; pointer-events: none;">
      <rect id="sheen_band" x="-300" y="-300" width="380" height="1300" fill="url(#sheen_linear)" transform="rotate(45 250 270)"/>
    </g>\n`;
  }

  body += `  </g>\n`;

  const svgOpening = `<svg id="logo_svg" width="${artboardWidth}" height="${artboardHeight}" viewBox="0 0 ${artboardWidth} ${artboardHeight}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
  return `${svgOpening}\n${defs}${body}</svg>`;
}

module.exports = {
  ORIGINAL_SVG_DATA,
  generateMasterSVG
};
