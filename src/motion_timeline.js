// Motion Choreography Engine for 37 Monogram Logo
// Supports signature, minimal, and blueprint choreography variants

function createLogoAnimationTimeline(gsap, CustomEase, elementsData, options = {}) {
  const {
    variant = options.variant || "signature",
    durationMultiplier = 1.0,
    onUpdate = null,
    onComplete = null
  } = options;

  const mode = String(variant).toLowerCase();
  const isMinimal = mode === "minimal";
  const isBlueprint = mode === "blueprint";
  const isSignature = mode === "signature" || (!isMinimal && !isBlueprint);

  gsap.registerPlugin(CustomEase);

  // High-End Custom Easing Curves
  const revealEase = CustomEase.create("revealEase", "0.22, 1, 0.36, 1");
  const slideEase = CustomEase.create("slideEase", "0.16, 1, 0.3, 1");
  const arcEase = CustomEase.create("arcEase", "0.25, 1, 0.45, 1");
  const sheenEase = CustomEase.create("sheenEase", "0.38, 0.0, 0.22, 1");

  const tl = gsap.timeline({
    paused: true,
    onUpdate: onUpdate,
    onComplete: onComplete
  });

  // 1. Reset all reveal rects to width 0
  elementsData.forEach(el => {
    const rect = document.querySelector("#rect_" + el.id);
    if (rect) {
      rect.setAttribute("width", "0");
      rect.setAttribute("fill", "url(#linear_reveal_grad)");
    }
  });

  const circleArc = document.querySelector("#circle_three_arcs");
  if (circleArc) {
    circleArc.setAttribute("stroke-dashoffset", "720");
  }

  // 2. Initial spatial offsets (Kinetic Assembly)
  elementsData.forEach(el => {
    const grp = document.querySelector("#group_" + el.id);
    if (!grp) return;

    let initX = 0, initY = 0;
    if (!isMinimal) {
      if (el.group === "seven") {
        if (el.motion === "diag_down_left") {
          initX = 14; initY = -14;
        } else if (el.motion === "vert_down") {
          initX = 0; initY = -12;
        } else if (el.motion === "horiz_r") {
          initX = -12; initY = 0;
        }
      } else { // three
        if (el.motion === "diag_down_left") {
          initX = 9; initY = -9;
        } else if (el.motion === "horiz_r" || el.motion === "horiz_l") {
          initX = -10; initY = 0;
        } else if (el.motion === "arc") {
          initX = 0; initY = 0;
          gsap.set(grp, { scale: 0.985, transformOrigin: "159.884px 265.019px" });
        }
      }
    }
    gsap.set(grp, { x: initX, y: initY });

    // Metallic alloy tone during initial reveal in signature mode
    const rawShape = document.querySelector("#raw_" + el.id);
    if (rawShape && isSignature) {
      rawShape.setAttribute("fill", "#d4d8e6");
    } else if (rawShape) {
      rawShape.setAttribute("fill", "#ffffff");
    }
  });

  // Blueprint construction guidelines
  const blueprintGuides = document.querySelector("#blueprint_guides");
  if (blueprintGuides) {
    if (isBlueprint) {
      tl.fromTo(blueprintGuides, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.in" }, 0.05);
      tl.to(blueprintGuides, { opacity: 0, duration: 0.40, ease: "power2.out" }, 1.10);
    } else {
      gsap.set(blueprintGuides, { opacity: 0 });
    }
  }

  // 3. Staggered Directional Path Reveals

  // 7 Diagonals (Long strike)
  tl.to("#rect_p10_seven_diag_outer", {
    attr: { width: 560 },
    duration: 0.68 * durationMultiplier,
    ease: revealEase
  }, 0.12 * durationMultiplier);

  tl.to("#rect_p15_seven_diag_inner", {
    attr: { width: 580 },
    duration: 0.68 * durationMultiplier,
    ease: revealEase
  }, 0.15 * durationMultiplier);

  // 3 Diagonals (Parallel strike)
  tl.to("#rect_p01_three_diag_outer", {
    attr: { width: 390 },
    duration: 0.64 * durationMultiplier,
    ease: revealEase
  }, 0.16 * durationMultiplier);

  tl.to("#rect_p03_three_diag_inner", {
    attr: { width: 320 },
    duration: 0.64 * durationMultiplier,
    ease: revealEase
  }, 0.19 * durationMultiplier);

  // 3 Circular Arc Sweep
  tl.to("#circle_three_arcs", {
    attr: { "stroke-dashoffset": 0 },
    duration: 0.74 * durationMultiplier,
    ease: arcEase
  }, 0.22 * durationMultiplier);

  // 7 Horizontal Bridges
  tl.to("#rect_p09_seven_top_outer", {
    attr: { width: 260 },
    duration: 0.52 * durationMultiplier,
    ease: revealEase
  }, 0.28 * durationMultiplier);

  tl.to("#rect_p04_seven_top_inner", {
    attr: { width: 180 },
    duration: 0.50 * durationMultiplier,
    ease: revealEase
  }, 0.31 * durationMultiplier);

  // 7 Vertical Drops
  tl.to("#rect_p12_seven_vert_outer", {
    attr: { width: 150 },
    duration: 0.48 * durationMultiplier,
    ease: revealEase
  }, 0.36 * durationMultiplier);

  tl.to("#rect_p13_seven_vert_inner", {
    attr: { width: 80 },
    duration: 0.44 * durationMultiplier,
    ease: revealEase
  }, 0.39 * durationMultiplier);

  // 3 Top Horizontal Bars
  tl.to("#rect_p00_three_top_outer", {
    attr: { width: 240 },
    duration: 0.52 * durationMultiplier,
    ease: revealEase
  }, 0.30 * durationMultiplier);

  tl.to("#rect_p02_three_top_inner", {
    attr: { width: 160 },
    duration: 0.48 * durationMultiplier,
    ease: revealEase
  }, 0.34 * durationMultiplier);

  // 3 Chamfer, Connectors & Caps
  tl.to("#rect_p08_three_chamfer", {
    attr: { width: 180 },
    duration: 0.46 * durationMultiplier,
    ease: revealEase
  }, 0.36 * durationMultiplier);

  tl.to("#rect_p11_three_mid_conn", {
    attr: { width: 110 },
    duration: 0.42 * durationMultiplier,
    ease: revealEase
  }, 0.40 * durationMultiplier);

  tl.to("#rect_p14_three_bottom_cap", {
    attr: { width: 100 },
    duration: 0.44 * durationMultiplier,
    ease: revealEase
  }, 0.46 * durationMultiplier);

  // 7 Bottom Cap
  tl.to("#rect_p05_seven_bottom_cap", {
    attr: { width: 100 },
    duration: 0.42 * durationMultiplier,
    ease: revealEase
  }, 0.50 * durationMultiplier);

  // 4. Solidify Masks (Transition to 100% white)
  elementsData.forEach(el => {
    if (el.motion === "arc") return;
    const rect = "#rect_" + el.id;
    tl.to(rect, {
      attr: { fill: "#ffffff" },
      duration: 0.16 * durationMultiplier,
      ease: "power2.out"
    }, 0.94 * durationMultiplier);
  });

  // 5. Kinetic Assembly (Converge to origin)
  if (!isMinimal) {
    elementsData.forEach(el => {
      const grp = "#group_" + el.id;
      tl.to(grp, {
        x: 0,
        y: 0,
        scale: 1,
        duration: 0.86 * durationMultiplier,
        ease: slideEase
      }, 0.22 * durationMultiplier);
    });
  }

  // 6. Specular Sheen Pass & Solid White Transition
  const sheenLayer = document.querySelector("#sheen_layer");
  const sheenBand = document.querySelector("#sheen_band");

  if (!isMinimal && sheenLayer && sheenBand) {
    tl.fromTo(sheenLayer,
      { opacity: 0 },
      { opacity: 1, duration: 0.12 * durationMultiplier, ease: "power1.in" },
      1.10 * durationMultiplier
    );
    tl.fromTo(sheenBand,
      { attr: { y: -500 } },
      { attr: { y: 400 }, duration: 0.44 * durationMultiplier, ease: sheenEase },
      1.10 * durationMultiplier
    );
    tl.to(sheenLayer, {
      opacity: 0,
      duration: 0.14 * durationMultiplier,
      ease: "power1.out"
    }, 1.38 * durationMultiplier);

    // Turn elements into 100% pure brilliant white as the sheen sweeps
    elementsData.forEach(el => {
      const rawShape = "#raw_" + el.id;
      tl.to(rawShape, {
        attr: { fill: "#ffffff" },
        duration: 0.25 * durationMultiplier,
        ease: "power1.inOut"
      }, 1.15 * durationMultiplier);
    });
  }

  // 7. Micro-settle / Damped Monolithic Lock (1.46s to 1.60s)
  tl.fromTo("#master_container",
    { filter: "brightness(1.03)" },
    { filter: "brightness(1.0)", duration: 0.28 * durationMultiplier, ease: "power2.out" },
    1.46 * durationMultiplier
  );

  return tl;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { createLogoAnimationTimeline };
}
