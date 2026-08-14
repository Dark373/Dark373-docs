/* Racing-themed touches:
 *  1. A rotating, trailing custom cursor on desktop pointers, layered on
 *     top of the static SVG cursor in extra.css (which stays as the
 *     fallback for touch devices, reduced-motion, and pre-JS paint).
 *  2. Two mini black-and-white track graphics — one under the sidebar nav
 *     in the 2025 section, one on the homepage — that count laps and pop
 *     a confetti burst every time you hover them.
 *
 * Runs via document$, Material's observable that fires after every page
 * load *and* every instant-navigation swap, so everything keeps working
 * as you click around instead of only on the first full page load.
 */
(function () {
  "use strict";

  function onDocumentReady(fn) {
    if (window.document$ && typeof window.document$.subscribe === "function") {
      window.document$.subscribe(fn);
    } else if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  onDocumentReady(function () {
    initSidebarTrack();
    initHomepageTrack();
    initRacingCursor();
  });

  /* ------------------------------------------------------------------
   * Track graphics: markup builders + shared lap/confetti wiring.
   * ------------------------------------------------------------------ */

  function checkerPatternMarkup(id) {
    return (
      '<pattern id="' + id + '" width="8" height="8" patternUnits="userSpaceOnUse">' +
      '<rect width="8" height="8" fill="#ffffff"/>' +
      '<rect width="4" height="4" fill="#141414"/>' +
      '<rect x="4" y="4" width="4" height="4" fill="#141414"/>' +
      "</pattern>"
    );
  }

  // Both tracks share one rendering style — two concentric outlines (a
  // "ring" lane) at the same stroke weights, a checkered finish-line
  // patch, and a red start dot — so they read as the same theme. Only
  // the outline shapes (real circuit layouts, traced by hand) differ.
  // outerShape/innerShape are complete <path> elements; each track keeps
  // its own viewBox since Suzuka's figure-eight and Spa's long diagonal
  // have very different natural proportions.
  function trackSVG(label, viewBox, outerShape, innerShape, finishRectAttrs, dotCx, dotCy, checkerId) {
    return (
      '<svg viewBox="' + viewBox + '" role="img" aria-label="' + label + '">' +
      "<defs>" + checkerPatternMarkup(checkerId) + "</defs>" +
      outerShape +
      innerShape +
      '<rect class="f1-finish-line" ' + finishRectAttrs + ' fill="url(#' + checkerId + ')" stroke="currentColor" stroke-width="1"/>' +
      // Purely decorative — sits on top of (overlaps) the finish-line
      // rect by design, so it must not intercept hover, or it silently
      // steals the hit-test from the rect underneath and the mouseenter
      // listener never fires no matter how precisely you hover the line.
      '<circle cx="' + dotCx + '" cy="' + dotCy + '" r="3" fill="#d21f1f" stroke="currentColor" stroke-width="0.8" pointer-events="none"/>' +
      "</svg>"
    );
  }

  var RING_OUTER = 'fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
  var RING_INNER = 'fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"';

  // Suzuka — the figure-eight crossover is the one unmistakable feature,
  // so the outline is traced as a single self-crossing loop (exactly how
  // the real track works: the back straight literally passes under the
  // esses). Used in the 2025 section's sidebar.
  function suzukaTrackMarkup() {
    return trackSVG(
      "Suzuka Circuit — hover the checkered patch for a lap",
      "0 0 140 180",
      '<path d="M70,170 L100,148 L106,112 L88,92 L70,80 L90,64 L112,38 L106,10 L72,4 L44,16 L40,42 L58,64 ' +
        'L70,80 L52,96 L22,112 L18,142 L38,164 Z" ' + RING_OUTER + "/>",
      '<path d="M66,156 L90,138 L95,113 L80,96 L66,86 L83,72 L101,50 L96,20 L70,16 L50,26 L47,45 L61,63 ' +
        'L66,86 L54,98 L32,111 L29,136 L44,152 Z" ' + RING_INNER + "/>",
      'x="62" y="158" width="14" height="10"',
      69,
      163,
      "f1-checker-suzuka"
    );
  }

  // Spa-Francorchamps — the hairpin at La Source, the long Kemmel
  // straight, the Les Combes chicane at the top, and the sweep back
  // through Pouhon/Stavelot/Blanchimont to the Bus Stop chicane. Used
  // on the homepage.
  function spaTrackMarkup() {
    return trackSVG(
      "Circuit de Spa-Francorchamps — hover the checkered patch for a lap",
      "0 0 224 140",
      '<path d="M28,120 L64,64 L80,62 L168,8 L184,4 L174,20 ' +
        "Q206,30 210,52 Q192,72 174,64 Q158,58 148,72 Q166,84 186,92 " +
        'Q208,102 200,122 Q158,132 128,102 L88,88 L68,92 L68,98 Z" ' + RING_OUTER + "/>",
      '<path d="M38,106 L68,58 L78,56 L86,68 L162,20 L172,20 L166,28 ' +
        "Q186,34 190,50 Q178,62 168,56 Q160,52 156,64 Q168,72 182,78 " +
        'Q194,86 188,100 Q160,106 140,86 L98,76 L84,80 L84,84 Z" ' + RING_INNER + "/>",
      'x="44" y="102" width="14" height="12" transform="rotate(35 51 108)"',
      51,
      108,
      "f1-checker-spa"
    );
  }

  function trackWidgetMarkup(label, svgMarkup) {
    return (
      '<p class="f1-track-label">' + label + "</p>" +
      svgMarkup +
      '<p class="f1-track-laps">Cross the finish line</p>'
    );
  }

  // Wires up lap-counting + confetti on a freshly-built track widget.
  // Independent per widget: each track keeps its own lap count. The
  // listener sits on the checkered finish-line patch specifically (not
  // the whole SVG's bounding box), so a lap only counts — and confetti
  // only fires — exactly when the cursor crosses the finish line.
  function wireTrackWidget(container) {
    var finish = container.querySelector(".f1-finish-line");
    var lapEl = container.querySelector(".f1-track-laps");
    if (!finish || !lapEl) return;

    var laps = 0;
    finish.addEventListener("mouseenter", function () {
      laps += 1;
      lapEl.textContent = "Lap " + (laps < 10 ? "0" + laps : laps);
      burstConfetti();
    });
  }

  var confettiLayer = null;
  var CONFETTI_COLORS = ["#d21f1f", "#ff5c5c", "#141414", "#ffffff"];

  function burstConfetti() {
    if (prefersReducedMotion()) return;

    if (!confettiLayer) {
      confettiLayer = document.createElement("div");
      confettiLayer.id = "f1-confetti-layer";
      document.body.appendChild(confettiLayer);
    }

    var count = 28;
    for (var i = 0; i < count; i++) {
      var piece = document.createElement("span");
      piece.className = "f1-confetti";
      var leftVw = 12 + Math.random() * 76;
      var rise = 90 + Math.random() * 170;
      var drift = (Math.random() - 0.5) * 150;
      var rot = (Math.random() - 0.5) * 720;
      var dur = 700 + Math.random() * 500;
      var delay = Math.random() * 140;

      piece.style.left = leftVw + "vw";
      piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      piece.style.setProperty("--rise", rise + "px");
      piece.style.setProperty("--drift", drift + "px");
      piece.style.setProperty("--rot", rot + "deg");
      piece.style.animationDuration = dur + "ms";
      piece.style.animationDelay = delay + "ms";
      piece.addEventListener("animationend", function () {
        this.remove();
      });
      confettiLayer.appendChild(piece);
    }
  }

  /* Sidebar track: shown under the 2025 section's nav, on every page in
   * that section (detected via URL path, since it needs to follow you
   * across five different pages rather than one fixed slot). */
  function initSidebarTrack() {
    var inSection = /\/f1-2025-theme\//.test(location.pathname);
    var existing = document.getElementById("f1-track-sidebar");

    if (!inSection) {
      if (existing) existing.remove();
      return;
    }
    if (existing) return;

    var host =
      document.querySelector(".md-sidebar--primary .md-sidebar__inner") ||
      document.querySelector(".md-sidebar--primary .md-sidebar__scrollwrap") ||
      document.querySelector(".md-sidebar--primary");
    if (!host) return;

    var wrap = document.createElement("div");
    wrap.id = "f1-track-sidebar";
    wrap.className = "f1-track";
    wrap.innerHTML = trackWidgetMarkup("Suzuka", suzukaTrackMarkup());
    host.appendChild(wrap);
    wireTrackWidget(wrap);
  }

  /* Homepage track: fills an explicit slot placed in docs/index.md,
   * rather than guessing the homepage's URL (which shifts between local
   * dev and the GitHub Pages sub-path). */
  function initHomepageTrack() {
    var slot = document.getElementById("f1-home-track");
    if (!slot || slot.dataset.f1Ready) return;

    slot.dataset.f1Ready = "1";
    slot.classList.add("f1-track");
    slot.innerHTML = trackWidgetMarkup("Spa-Francorchamps", spaTrackMarkup());
    wireTrackWidget(slot);
  }

  /* ------------------------------------------------------------------
   * Rotating, trailing cursor. Progressive enhancement only: skipped on
   * touch devices and when the user prefers reduced motion, in which
   * case the static cursor from extra.css is simply left in place.
   *
   * The DOM element + listeners are only ever built once, but the
   * `f1-cursor-active` class (which is what actually hides the native
   * cursor) is re-applied on *every* call. Instant-navigation re-syncs
   * <html>'s attributes from each freshly-fetched page, which silently
   * strips any class only JS ever added — without re-adding it here,
   * the native cursor would come back to stay after the first click
   * while our floating car (whose listeners are still alive) keeps
   * drawing underneath it.
   * ------------------------------------------------------------------ */
  function initRacingCursor() {
    var coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (coarsePointer || prefersReducedMotion()) {
      document.documentElement.classList.remove("f1-cursor-active");
      return;
    }

    document.documentElement.classList.add("f1-cursor-active");

    if (window.__f1CursorInit) return;
    window.__f1CursorInit = true;

    var CAR_SVG =
      '<svg viewBox="0 0 32 32" width="32" height="32">' +
      '<g transform="translate(16,16) scale(0.55)">' +
      '<g fill="none" stroke="#ffffff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round">' +
      '<rect x="-17" y="-7" width="3" height="14" rx="1"/>' +
      '<rect x="10" y="-7.5" width="3" height="15" rx="1"/>' +
      '<circle cx="-9" cy="-6.5" r="2.6"/>' +
      '<circle cx="-9" cy="6.5" r="2.6"/>' +
      '<circle cx="9" cy="-6.2" r="2.2"/>' +
      '<circle cx="9" cy="6.2" r="2.2"/>' +
      '<path d="M -13 -4 L 5 -4.5 L 14 -3 L 20 0 L 14 3 L 5 4.5 L -13 4 Z"/>' +
      '<ellipse cx="1" cy="0" rx="4" ry="2.2"/>' +
      "</g>" +
      '<rect x="-17" y="-7" width="3" height="14" rx="1" fill="#141414"/>' +
      '<rect x="10" y="-7.5" width="3" height="15" rx="1" fill="#141414"/>' +
      '<circle cx="-9" cy="-6.5" r="2.6" fill="#141414"/>' +
      '<circle cx="-9" cy="6.5" r="2.6" fill="#141414"/>' +
      '<circle cx="9" cy="-6.2" r="2.2" fill="#141414"/>' +
      '<circle cx="9" cy="6.2" r="2.2" fill="#141414"/>' +
      '<path d="M -13 -4 L 5 -4.5 L 14 -3 L 20 0 L 14 3 L 5 4.5 L -13 4 Z" fill="#d21f1f" stroke="#141414" stroke-width="0.6"/>' +
      '<ellipse cx="1" cy="0" rx="4" ry="2.2" fill="#f5f5f5"/>' +
      "</g>" +
      "</svg>";

    var cursorEl = document.createElement("div");
    cursorEl.id = "f1-cursor";
    var rotor = document.createElement("div");
    rotor.id = "f1-cursor-rotor";
    rotor.innerHTML = CAR_SVG;
    cursorEl.appendChild(rotor);
    document.body.appendChild(cursorEl);

    var trailLayer = document.createElement("div");
    trailLayer.id = "f1-trail-layer";
    document.body.appendChild(trailLayer);

    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var lastAngleX = mouseX;
    var lastAngleY = mouseY;
    var angle = -35; // matches the static fallback cursor's resting orientation
    var lastTrailX = mouseX;
    var lastTrailY = mouseY;
    var rafId = null;

    rotor.style.transform = "rotate(" + angle + "deg)";

    function normalizeDelta(a) {
      while (a > 180) a -= 360;
      while (a < -180) a += 360;
      return a;
    }

    function tick() {
      rafId = null;
      cursorEl.style.transform = "translate3d(" + mouseX + "px," + mouseY + "px,0)";

      var dx = mouseX - lastAngleX;
      var dy = mouseY - lastAngleY;
      if (Math.hypot(dx, dy) > 4) {
        var raw = (Math.atan2(dy, dx) * 180) / Math.PI;
        angle += normalizeDelta(raw - angle);
        lastAngleX = mouseX;
        lastAngleY = mouseY;
        rotor.style.transform = "rotate(" + angle + "deg)";
      }

      var tdx = mouseX - lastTrailX;
      var tdy = mouseY - lastTrailY;
      if (Math.hypot(tdx, tdy) > 16) {
        spawnTrail(mouseX, mouseY);
        lastTrailX = mouseX;
        lastTrailY = mouseY;
      }
    }

    function requestTick() {
      if (rafId === null) rafId = requestAnimationFrame(tick);
    }

    function spawnTrail(x, y) {
      var dot = document.createElement("span");
      dot.className = "f1-trail-dot";
      dot.style.left = x + "px";
      dot.style.top = y + "px";
      dot.addEventListener("animationend", function () {
        dot.remove();
      });
      trailLayer.appendChild(dot);
    }

    document.addEventListener(
      "mousemove",
      function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorEl.style.opacity = "1";
        requestTick();
      },
      { passive: true }
    );

    document.addEventListener("mouseleave", function () {
      cursorEl.style.opacity = "0";
    });

    // Keep the zoom-in hint over gallery thumbnails: hide the follower
    // and let the (still !important) native zoom-in cursor show through.
    document.addEventListener(
      "mouseover",
      function (e) {
        var img = e.target.closest && e.target.closest(".gallery-grid img");
        if (img) cursorEl.style.opacity = "0";
      },
      { passive: true }
    );
    document.addEventListener(
      "mouseout",
      function (e) {
        var img = e.target.closest && e.target.closest(".gallery-grid img");
        if (img) cursorEl.style.opacity = "1";
      },
      { passive: true }
    );
  }
})();
