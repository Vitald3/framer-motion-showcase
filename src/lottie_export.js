// Lottie Vector JSON Generator for 37 Monogram Logo
// Generates standard Bodymovin/Lottie specification JSON (exports/logo_animation.json)
// Validated with lottie-web

const fs = require('fs');
const path = require('path');
const { ORIGINAL_SVG_DATA } = require('./animation_svg.js');

function svgPathToLottieBezier(d) {
  // Parses SVG path commands (M, L, H, V, C, Z) into Lottie bezier format:
  // { c: boolean, v: [[x,y],...], i: [[dx,dy],...], o: [[dx,dy],...] }
  const tokens = d.match(/([A-Za-z]|[-+]?(?:\d*\.\d+|\d+))/g);
  if (!tokens) return { c: true, v: [], i: [], o: [] };

  const v = [];
  const inTangents = [];
  const outTangents = [];
  let closed = false;

  let i = 0;
  let curX = 0, curY = 0;

  while (i < tokens.length) {
    const t = tokens[i];
    if (t === 'M') {
      curX = parseFloat(tokens[i + 1]);
      curY = parseFloat(tokens[i + 2]);
      v.push([curX, curY]);
      inTangents.push([0, 0]);
      outTangents.push([0, 0]);
      i += 3;
    } else if (t === 'L') {
      curX = parseFloat(tokens[i + 1]);
      curY = parseFloat(tokens[i + 2]);
      v.push([curX, curY]);
      inTangents.push([0, 0]);
      outTangents.push([0, 0]);
      i += 3;
    } else if (t === 'H') {
      curX = parseFloat(tokens[i + 1]);
      v.push([curX, curY]);
      inTangents.push([0, 0]);
      outTangents.push([0, 0]);
      i += 2;
    } else if (t === 'V') {
      curY = parseFloat(tokens[i + 1]);
      v.push([curX, curY]);
      inTangents.push([0, 0]);
      outTangents.push([0, 0]);
      i += 2;
    } else if (t === 'C') {
      const cp1x = parseFloat(tokens[i + 1]);
      const cp1y = parseFloat(tokens[i + 2]);
      const cp2x = parseFloat(tokens[i + 3]);
      const cp2y = parseFloat(tokens[i + 4]);
      const endX = parseFloat(tokens[i + 5]);
      const endY = parseFloat(tokens[i + 6]);

      // Set outgoing tangent relative to preceding coordinate
      const prevV = v[v.length - 1];
      outTangents[outTangents.length - 1] = [cp1x - prevV[0], cp1y - prevV[1]];

      // Add new vertex with in-tangent relative to this new vertex
      v.push([endX, endY]);
      inTangents.push([cp2x - endX, cp2y - endY]);
      outTangents.push([0, 0]);

      curX = endX;
      curY = endY;
      i += 7;
    } else if (t === 'Z' || t === 'z') {
      closed = true;
      i += 1;
    } else {
      i += 1;
    }
  }

  return {
    c: closed,
    v: v,
    i: inTangents,
    o: outTangents
  };
}

function rectToLottieBezier(x, y, w, h, transform) {
  // Rectangle as closed 4-vertex bezier path
  let pts = [
    [x, y],
    [x + w, y],
    [x + w, y + h],
    [x, y + h]
  ];

  if (transform && transform.includes('rotate(-90')) {
    // rotate -90 around (471.014, 225.628) or similar
    const m = transform.match(/rotate\(([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+)\s+([-+]?\d*\.?\d+)\)/);
    if (m) {
      const angleRad = (parseFloat(m[1]) * Math.PI) / 180;
      const ox = parseFloat(m[2]);
      const oy = parseFloat(m[3]);
      pts = pts.map(([px, py]) => {
        const rx = px - ox;
        const ry = py - oy;
        const cos = Math.cos(angleRad);
        const sin = Math.sin(angleRad);
        return [
          ox + rx * cos - ry * sin,
          oy + rx * sin + ry * cos
        ];
      });
    }
  }

  return {
    c: true,
    v: pts,
    i: [[0, 0], [0, 0], [0, 0], [0, 0]],
    o: [[0, 0], [0, 0], [0, 0], [0, 0]]
  };
}

function buildLottieAnimation() {
  const FPS = 60;
  const TOTAL_FRAMES = 120; // 2.0s
  const ARTBOARD_W = 800;
  const ARTBOARD_H = 800;

  // Center offset for the 497x539 logo on 800x800 canvas
  const offsetX = (ARTBOARD_W - 497) / 2; // 151.5
  const offsetY = (ARTBOARD_H - 539) / 2; // 130.5

  const layers = [];

  ORIGINAL_SVG_DATA.elements.forEach((el, index) => {
    let bezier;
    if (el.type === 'rect') {
      bezier = rectToLottieBezier(el.x, el.y || 0, el.width, el.height, el.transform);
    } else {
      bezier = svgPathToLottieBezier(el.d);
    }

    // Offset all vertices by (offsetX, offsetY)
    const shiftedV = bezier.v.map(([vx, vy]) => [vx + offsetX, vy + offsetY]);

    // Initial drift offsets
    let initDx = 0, initDy = 0;
    if (el.group === 'seven') {
      if (el.motion === 'diag_down_left') {
        initDx = 14; initDy = -14;
      } else if (el.motion === 'vert_down') {
        initDx = 0; initDy = -12;
      } else if (el.motion === 'horiz_r') {
        initDx = -12; initDy = 0;
      }
    } else { // three
      if (el.motion === 'diag_down_left') {
        initDx = 9; initDy = -9;
      } else if (el.motion === 'horiz_r' || el.motion === 'horiz_l') {
        initDx = -10; initDy = 0;
      }
    }

    // Stagger start frame
    let startFrame = 10;
    if (el.id.includes('diag')) startFrame = 8;
    else if (el.id.includes('arc')) startFrame = 13;
    else if (el.id.includes('top')) startFrame = 17;
    else startFrame = 22;

    const revealEndFrame = startFrame + 38;
    const lockEndFrame = 68;

    // Cubic-bezier easing parameters
    const easeIn = { x: [0.16, 0.16], y: [1, 1] };
    const easeOut = { x: [0.3, 0.3], y: [1, 1] };

    // Position keyframes
    const posKeyframes = [
      {
        t: startFrame,
        s: [initDx, initDy, 0],
        e: [0, 0, 0],
        i: easeIn,
        o: easeOut
      },
      {
        t: lockEndFrame,
        s: [0, 0, 0]
      }
    ];

    // Opacity keyframes
    const opacityKeyframes = [
      {
        t: startFrame,
        s: [0],
        e: [100],
        i: { x: [0.22], y: [1] },
        o: { x: [0.36], y: [1] }
      },
      {
        t: revealEndFrame,
        s: [100]
      }
    ];

    // Shape layer definition
    const shapeLayer = {
      ddd: 0,
      ind: index + 1,
      ty: 4, // Shape layer
      nm: el.id,
      sr: 1,
      ks: {
        o: { a: 1, k: opacityKeyframes, ix: 11 },
        r: { a: 0, k: 0, ix: 10 },
        p: { a: 1, k: posKeyframes, ix: 2 },
        a: { a: 0, k: [0, 0, 0], ix: 1 },
        s: { a: 0, k: [100, 100, 100], ix: 6 }
      },
      ao: 0,
      shapes: [
        {
          ty: 'gr',
          nm: 'Vector_Shape',
          np: 3,
          cix: 2,
          ix: 1,
          mn: 'ADBE Vector Group',
          hd: false,
          it: [
            {
              ind: 0,
              ty: 'sh',
              ix: 1,
              ks: {
                a: 0,
                k: {
                  i: bezier.i,
                  o: bezier.o,
                  v: shiftedV,
                  c: bezier.c
                },
                ix: 2
              },
              nm: 'Path',
              mn: 'ADBE Vector Shape - Group',
              hd: false
            },
            {
              ty: 'fl',
              c: {
                a: 1,
                k: [
                  {
                    t: 0,
                    s: [0.83, 0.85, 0.90, 1], // metallic tint during reveal
                    e: [1, 1, 1, 1], // turns pure white
                    i: { x: [0.2], y: [1] },
                    o: { x: [0.3], y: [1] }
                  },
                  {
                    t: 75,
                    s: [1, 1, 1, 1]
                  }
                ],
                ix: 4
              },
              o: { a: 0, k: 100, ix: 5 },
              r: 1,
              bm: 0,
              nm: 'Fill',
              mn: 'ADBE Vector Graphic - Fill',
              hd: false
            },
            {
              ty: 'tr',
              p: { a: 0, k: [0, 0], ix: 2 },
              a: { a: 0, k: [0, 0], ix: 1 },
              s: { a: 0, k: [100, 100], ix: 3 },
              r: { a: 0, k: 0, ix: 6 },
              o: { a: 0, k: 100, ix: 7 },
              sk: { a: 0, k: 0, ix: 4 },
              sa: { a: 0, k: 0, ix: 5 },
              nm: 'Transform'
            }
          ]
        }
      ],
      ip: 0,
      op: TOTAL_FRAMES,
      st: 0,
      bm: 0
    };

    layers.push(shapeLayer);
  });

  const lottieData = {
    v: '5.7.4',
    fr: FPS,
    ip: 0,
    op: TOTAL_FRAMES,
    w: ARTBOARD_W,
    h: ARTBOARD_H,
    nm: '37 Monogram Signature Animation',
    ddd: 0,
    assets: [],
    layers: layers.reverse(), // Top-down layer stack
    markers: []
  };

  const outputPath = path.resolve(__dirname, '../exports/logo_animation.json');
  fs.writeFileSync(outputPath, JSON.stringify(lottieData, null, 2));
  console.log(`[LOTTIE EXPORT] Successfully created ${outputPath} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);

  return outputPath;
}

if (require.main === module) {
  buildLottieAnimation();
}

module.exports = {
  buildLottieAnimation,
  svgPathToLottieBezier,
  rectToLottieBezier
};
