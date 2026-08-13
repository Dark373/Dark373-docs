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

  // Simple oval/stadium loop — used in the 2025 section's sidebar.
  function ovalTrackMarkup() {
    return (
      '<svg viewBox="0 0 200 104" role="img" aria-label="A little race track, just for fun">' +
      "<defs>" + checkerPatternMarkup("f1-checker-oval") + "</defs>" +
      '<rect x="4" y="10" width="192" height="84" rx="42" fill="none" stroke="currentColor" stroke-width="3"/>' +
      '<rect x="28" y="30" width="144" height="44" rx="22" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<rect x="92" y="10" width="16" height="20" fill="url(#f1-checker-oval)" stroke="currentColor" stroke-width="1"/>' +
      '<circle cx="100" cy="10" r="3" fill="#d21f1f" stroke="currentColor" stroke-width="0.8"/>' +
      "</svg>"
    );
  }

  // A trickier circuit with a small chicane — used on the homepage.
  function circuitTrackMarkup() {
    return (
      '<svg viewBox="0 0 200 104" role="img" aria-label="A second, trickier circuit, just for fun">' +
      "<defs>" + checkerPatternMarkup("f1-checker-circuit") + "</defs>" +
      '<path d="M20,88 L20,32 L38,16 L92,16 L102,28 L112,16 L162,16 L182,32 L182,72 L162,88 L58,88 Z" ' +
      'fill="none" stroke="currentColor" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<rect x="12" y="54" width="16" height="14" fill="url(#f1-checker-circuit)" stroke="currentColor" stroke-width="1"/>' +
      '<circle cx="20" cy="61" r="3" fill="#d21f1f" stroke="currentColor" stroke-width="0.8"/>' +
      "</svg>"
    );
  }

  function trackWidgetMarkup(label, svgMarkup) {
    return (
      '<p class="f1-track-label">' + label + "</p>" +
      svgMarkup +
      '<p class="f1-track-laps">Hover for a lap</p>'
    );
  }

  // Wires up lap-counting + confetti on a freshly-built track widget.
  // Independent per widget: each track keeps its own lap count.
  function wireTrackWidget(container) {
    var svg = container.querySelector("svg");
    var lapEl = container.querySelector(".f1-track-laps");
    if (!svg || !lapEl) return;

    var laps = 0;
    svg.addEventListener("mouseenter", function () {
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
    wrap.innerHTML = trackWidgetMarkup("Track Map", ovalTrackMarkup());
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
    slot.innerHTML = trackWidgetMarkup("Sprint Circuit", circuitTrackMarkup());
    wireTrackWidget(slot);
  }

  /* ------------------------------------------------------------------
   * Rotating, trailing cursor. Progressive enhancement only: skipped on
   * touch devices and when the user prefers reduced motion, in which
   * case the static cursor from extra.css is simply left in place.
   * Only ever initialised once, even across instant-navigations.
   * ------------------------------------------------------------------ */
  function initRacingCursor() {
    if (window.__f1CursorInit) return;

    var coarsePointer = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (coarsePointer || prefersReducedMotion()) return;

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

    document.documentElement.classList.add("f1-cursor-active");

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
