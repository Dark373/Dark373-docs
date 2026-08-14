/* Racing-themed touches:
 *  1. A rotating, trailing custom cursor on desktop pointers, layered on
 *     top of the static SVG cursor in extra.css (which stays as the
 *     fallback for touch devices, reduced-motion, and pre-JS paint).
 *  2. A mini black-and-white track graphic on the homepage that counts
 *     laps and pops a confetti burst every time you hover it.
 *  3. Every word on every page is wrapped so hovering one briefly makes
 *     it bigger and bolder.
 *  4. Three tiny cars race across every checkered divider, trailing dust.
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
    applySectionAccent();
    initHomepageTrack();
    initWordHover();
    initCheckerRace();
    initRacingCursor();
  });

  /* ------------------------------------------------------------------
   * Drops three cars, each trailing dust/smoke, into every
   * .checker-divider on the current page (there's usually one, ahead of
   * Support) — a proper little race, not one car alone. Pure CSS
   * animation from here (see extra.css, .f1-racer--1/2/3 for the
   * per-lane speed/offset that makes them actually race instead of
   * moving in lockstep); this just builds the markup once per divider.
   * prefers-reduced-motion is handled entirely in CSS (display: none on
   * .f1-mini-race), so nothing extra to check here.
   * ------------------------------------------------------------------ */
  function initCheckerRace() {
    function racerMarkup(laneClass) {
      return (
        '<div class="f1-racer ' + laneClass + '">' +
        '<span class="f1-mini-car">🏎️</span>' +
        '<span class="f1-mini-dust"></span>' +
        '<span class="f1-mini-dust"></span>' +
        "</div>"
      );
    }

    var dividers = document.querySelectorAll(".checker-divider:not([data-f1-race])");
    dividers.forEach(function (divider) {
      divider.setAttribute("data-f1-race", "1");
      var race = document.createElement("div");
      race.className = "f1-mini-race";
      race.innerHTML = racerMarkup("f1-racer--1") + racerMarkup("f1-racer--2") + racerMarkup("f1-racer--3");
      divider.appendChild(race);
    });
  }

  /* ------------------------------------------------------------------
   * Per-section accent colour: purple on the homepage, blue on the 2026
   * project, red everywhere else. Tried switching Material's own
   * `data-md-color-accent` attribute first, since it ships full CSS for
   * every named accent colour — but Material's compiled stylesheet
   * re-declares --md-accent-fg-color again at a deeper scope than
   * <html> (confirmed empirically, not assumed), so that override kept
   * getting silently reset before it reached anything in the page
   * content. Toggling a class that drives our own --f1-accent custom
   * property (see extra.css) sidesteps that fight entirely — it only
   * has to win in our own stylesheet, not Material's.
   * ------------------------------------------------------------------ */
  function applySectionAccent() {
    var html = document.documentElement;
    var purple = !!document.getElementById("f1-home-track");
    var blue = !purple && /\/project-1\//.test(location.pathname);
    html.classList.toggle("f1-section-purple", purple);
    html.classList.toggle("f1-section-blue", blue);
  }

  /* ------------------------------------------------------------------
   * Homepage accessibility touch: hovering an individual word makes it
   * briefly bigger and bolder — a lightweight reading aid. Site-wide,
   * every page. Each word is wrapped in its own <span> so CSS :hover can
   * target it; the whitespace between words is left as plain text so
   * wrapping/line breaks look exactly like normal prose.
   * ------------------------------------------------------------------ */
  function initWordHover() {
    var root = document.querySelector(".md-content__inner") || document.querySelector("article");
    if (!root || root.dataset.f1WordsWrapped) return;
    root.dataset.f1WordsWrapped = "1";

    var SKIP_PARENT = { SCRIPT: 1, STYLE: 1, CODE: 1, PRE: 1, SVG: 1 };

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentNode;
        if (!parent || SKIP_PARENT[parent.nodeName] || !node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    var textNodes = [];
    var n;
    while ((n = walker.nextNode())) textNodes.push(n);

    textNodes.forEach(function (node) {
      var frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach(function (part) {
        if (part === "") return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
        } else {
          var span = document.createElement("span");
          span.className = "f1-word";
          span.textContent = part;
          frag.appendChild(span);
        }
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  /* ------------------------------------------------------------------
   * Track graphic: markup builder + lap/confetti wiring.
   *
   * Earlier versions traced real circuits (Suzuka, Spa) as hand-guessed
   * polygon lines, which looked jagged rather than like an actual track.
   * This one is built entirely from circular arcs (SVG's `A` command) —
   * mathematically smooth by construction, no hand-fitted curve points
   * to get subtly wrong. Four corners with different radii (two tight,
   * two sweeping) give it some character without risking the jaggedness
   * that comes from approximating a curve with straight segments.
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

  function trackMarkup() {
    var checkerId = "f1-checker-track";
    return (
      '<svg viewBox="0 0 240 140" role="img" aria-label="Grand Prix Circuit — hover the checkered patch for a lap">' +
      "<defs>" + checkerPatternMarkup(checkerId) + "</defs>" +
      '<path d="M65,15 L200,15 A20,20 0 0,1 220,35 L220,90 A35,35 0 0,1 185,125 L35,125 A15,15 0 0,1 20,110 ' +
        'L20,60 A45,45 0 0,1 65,15 Z" ' +
        'fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M66,33 L196,33 A6,6 0 0,1 202,39 L202,89 A18,18 0 0,1 184,107 L42,107 A4,4 0 0,1 38,103 ' +
        'L38,61 A28,28 0 0,1 66,33 Z" ' +
        'fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>' +
      '<rect class="f1-finish-line" x="20" y="78" width="18" height="14" fill="url(#' + checkerId + ')" stroke="currentColor" stroke-width="1"/>' +
      // Purely decorative — sits on top of (overlaps) the finish-line
      // rect by design, so it must not intercept hover, or it silently
      // steals the hit-test from the rect underneath and the mouseenter
      // listener never fires no matter how precisely you hover the line.
      '<circle cx="29" cy="85" r="3" fill="#d21f1f" stroke="currentColor" stroke-width="0.8" pointer-events="none"/>' +
      "</svg>"
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

  /* Homepage track: fills an explicit slot placed in docs/index.md,
   * rather than guessing the homepage's URL (which shifts between local
   * dev and the GitHub Pages sub-path). */
  function initHomepageTrack() {
    var slot = document.getElementById("f1-home-track");
    if (!slot || slot.dataset.f1Ready) return;

    slot.dataset.f1Ready = "1";
    slot.classList.add("f1-track");
    slot.innerHTML = trackWidgetMarkup("Grand Prix Circuit", trackMarkup());
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
