/* Racing-themed touches for the 2025 (F1 2025 Theme) section:
 *  1. A rotating, trailing custom cursor on desktop pointers, layered on
 *     top of the static SVG cursor in extra.css (which stays as the
 *     fallback for touch devices, reduced-motion, and pre-JS paint).
 *  2. A tiny black-and-white race track injected under the sidebar nav
 *     whenever you're browsing the 2025 section.
 *
 * Runs via document$, Material's observable that fires after every page
 * load *and* every instant-navigation swap, so both features keep working
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

  onDocumentReady(function () {
    initRacingTrack();
    initRacingCursor();
  });

  /* ------------------------------------------------------------------
   * Mini race track under the 2025 section's sidebar nav.
   * ------------------------------------------------------------------ */
  function initRacingTrack() {
    var inSection = /\/f1-2025-theme\//.test(location.pathname);
    var existing = document.getElementById("f1-track");

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
    wrap.id = "f1-track";
    wrap.innerHTML =
      '<p class="f1-track-label">Track Map</p>' +
      '<svg viewBox="0 0 200 104" role="img" aria-label="A little race track, just for fun">' +
      '<defs><pattern id="f1-checker" width="8" height="8" patternUnits="userSpaceOnUse">' +
      '<rect width="8" height="8" fill="#ffffff"/>' +
      '<rect width="4" height="4" fill="#141414"/>' +
      '<rect x="4" y="4" width="4" height="4" fill="#141414"/>' +
      "</pattern></defs>" +
      '<rect x="4" y="10" width="192" height="84" rx="42" fill="none" stroke="currentColor" stroke-width="3"/>' +
      '<rect x="28" y="30" width="144" height="44" rx="22" fill="none" stroke="currentColor" stroke-width="2"/>' +
      '<rect x="92" y="10" width="16" height="20" fill="url(#f1-checker)" stroke="currentColor" stroke-width="1"/>' +
      '<circle cx="100" cy="10" r="3" fill="#d21f1f" stroke="currentColor" stroke-width="0.8"/>' +
      "</svg>";
    host.appendChild(wrap);
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
    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (coarsePointer || reducedMotion) return;

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
