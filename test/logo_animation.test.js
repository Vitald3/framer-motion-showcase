const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const { ORIGINAL_SVG_DATA, generateMasterSVG } = require('../src/animation_svg.js');
const { createLogoAnimationTimeline } = require('../src/motion_timeline.js');

describe('37 Monogram Logo Animation Test Suite', () => {
  const rootDir = path.resolve(__dirname, '..');

  test('Source SVG geometry matches vector specification', () => {
    const sourceSvgPath = path.join(rootDir, 'sources', 'Logo.svg');
    assert.ok(fs.existsSync(sourceSvgPath), 'sources/Logo.svg must exist');

    const sourceSvgContent = fs.readFileSync(sourceSvgPath, 'utf8');
    assert.ok(sourceSvgContent.includes('viewBox="0 0 497 539"'), 'viewBox must match 0 0 497 539');

    assert.equal(ORIGINAL_SVG_DATA.elements.length, 16, 'Monogram must contain exactly 16 geometric elements');
    assert.equal(ORIGINAL_SVG_DATA.width, 497, 'Monogram width must equal 497');
    assert.equal(ORIGINAL_SVG_DATA.height, 539, 'Monogram height must equal 539');

    const threeElements = ORIGINAL_SVG_DATA.elements.filter(el => el.group === 'three');
    const sevenElements = ORIGINAL_SVG_DATA.elements.filter(el => el.group === 'seven');
    assert.equal(threeElements.length, 9, 'Digit 3 must consist of 9 geometric elements');
    assert.equal(sevenElements.length, 7, 'Digit 7 must consist of 7 geometric elements');

    // Verify key geometric coordinates match source
    ORIGINAL_SVG_DATA.elements.forEach(el => {
      assert.ok(el.id, 'Element must have an ID');
      if (el.type === 'rect') {
        assert.ok(sourceSvgContent.includes(String(el.width)), `Source SVG must contain rect width ${el.width}`);
      } else if (el.type === 'path') {
        const prefix = el.d.slice(0, 15);
        assert.ok(sourceSvgContent.includes(prefix), `Source SVG must contain path prefix ${prefix}`);
      }
    });
  });

  test('Master SVG markup generation', () => {
    const svg = generateMasterSVG({
      artboardWidth: 800,
      artboardHeight: 800,
      centerInArtboard: true,
      includeBlueprint: true,
      embedSheen: true
    });

    assert.ok(svg.startsWith('<svg'), 'Generated markup must be an SVG element');
    assert.ok(svg.includes('id="logo_svg"'), 'SVG must have logo_svg id');
    assert.ok(svg.includes('id="master_container"'), 'SVG must include master_container group');
    assert.ok(svg.includes('id="sheen_layer"'), 'SVG must include sheen_layer');
    assert.ok(svg.includes('id="blueprint_guides"'), 'SVG must include blueprint_guides');

    ORIGINAL_SVG_DATA.elements.forEach(el => {
      assert.ok(svg.includes(`id="group_${el.id}"`), `SVG must include group for ${el.id}`);
      assert.ok(svg.includes(`id="raw_${el.id}"`), `SVG must include raw shape for ${el.id}`);
    });
  });

  test('Motion timeline engine interface', () => {
    assert.equal(typeof createLogoAnimationTimeline, 'function', 'createLogoAnimationTimeline must be exported as a function');
  });

  test('Production deliverables exist and are valid', () => {
    const exportsDir = path.join(rootDir, 'exports');
    assert.ok(fs.existsSync(exportsDir), 'exports directory must exist');

    const expectedFiles = [
      'logo_animated.svg',
      'logo_animation.json',
      'logo_animation_1080p.mp4',
      'logo_animation_4k.mp4',
      'logo_animation_transparent.webm',
      'logo_animation_transparent.mov'
    ];

    expectedFiles.forEach(file => {
      const filePath = path.join(exportsDir, file);
      assert.ok(fs.existsSync(filePath), `Export file ${file} must exist`);
      const stats = fs.statSync(filePath);
      assert.ok(stats.size > 0, `Export file ${file} must not be empty`);
    });

    // Validate Lottie JSON structure
    const lottiePath = path.join(exportsDir, 'logo_animation.json');
    const lottieContent = JSON.parse(fs.readFileSync(lottiePath, 'utf8'));
    assert.equal(lottieContent.v, '5.7.4', 'Lottie spec version must match 5.7.4');
    assert.equal(lottieContent.fr, 60, 'Frame rate must be 60 FPS');
    assert.equal(lottieContent.w, 800, 'Canvas width must be 800');
    assert.equal(lottieContent.h, 800, 'Canvas height must be 800');
    assert.ok(Array.isArray(lottieContent.layers), 'Lottie layers must be an array');
    assert.ok(lottieContent.layers.length > 0, 'Lottie layers must not be empty');

    // Validate Standalone SVG structure
    const animatedSvgPath = path.join(exportsDir, 'logo_animated.svg');
    const animatedSvgContent = fs.readFileSync(animatedSvgPath, 'utf8');
    assert.ok(animatedSvgContent.includes('<animate'), 'Animated SVG must contain SMIL animate tags');
    assert.ok(animatedSvgContent.includes('keySplines'), 'Animated SVG must contain cubic-bezier keySplines timing');
  });
});
