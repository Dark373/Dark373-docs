/* Racing-themed touches:
 *  1. A rotating, trailing custom cursor on desktop pointers, layered on
 *     top of the static SVG cursor in extra.css (which stays as the
 *     fallback for touch devices, reduced-motion, and pre-JS paint).
 *  2. A mini black-and-white track graphic on the homepage that counts
 *     laps and pops a confetti burst every time you hover it.
 *  3. Every word on every page is wrapped so hovering one briefly makes
 *     it bigger and bolder.
 *  4. Three tiny cars race across every checkered divider, trailing dust.
 *  5. A local leaderboard on the homepage sidebar: save your session's
 *     top speed and career laps under a username, stored on this device.
 *  6. Numeric stat values count up from 0 on page load instead of just
 *     appearing.
 *  7. A password gate on the hidden love page.
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

  // The fastest smoothed speed seen this page-view (see initRacingCursor).
  // Module-scoped so the leaderboard's "save score" button can read it
  // without needing to reach into the cursor's own closure.
  var sessionMaxSpeed = 0;

  onDocumentReady(function () {
    applySectionAccent();
    initHomepageTrack();
    initWordHover();
    initCheckerRace();
    initLeaderboard();
    initCountUp();
    initLovePasswordGate();
    initRacingCursor();
    initScrollReveal();
    initGalleryCaptions();
  });

  /* ------------------------------------------------------------------
   * Password gate on the hidden love page — genuinely encrypted, not
   * just hidden. The message was encrypted once, offline (AES-256-GCM,
   * key derived from the password via PBKDF2-SHA256 at 250,000
   * iterations), and only the salt, IV, and ciphertext are in the page
   * — none of which are secret; that's how password-based encryption is
   * supposed to work. Without the password, deriving the right key is
   * infeasible, and AES-GCM's built-in authentication tag means a wrong
   * key doesn't produce readable garbage, it just fails to decrypt at
   * all, so decryption success/failure *is* the password check, no
   * separate comparison needed. Still true, and worth saying plainly:
   * this is real cryptography, but it protects against someone reading
   * the page, not against someone willing to run an offline
   * password-cracker against that ciphertext, so it's only as strong as
   * the password itself. A successful unlock caches the decrypted text
   * in localStorage (this device only) so it doesn't ask again.
   * ------------------------------------------------------------------ */
  function initLovePasswordGate() {
    var gate = document.getElementById("f1-love-gate");
    var content = document.getElementById("f1-love-content");
    var payloadEl = document.getElementById("f1-love-payload");
    if (!gate || !content || !payloadEl) return; // not on this page

    var CACHE_KEY = "f1-love-decrypted";

    var payload;
    try {
      payload = JSON.parse(payloadEl.textContent);
    } catch (e) {
      return;
    }

    function reveal(html) {
      if (!content.dataset.f1Filled) {
        content.innerHTML = html;
        content.dataset.f1Filled = "1";
      }
      gate.hidden = true;
      content.hidden = false;
      if (!prefersReducedMotion()) content.classList.add("f1-love-reveal");
    }

    var cached = null;
    try {
      cached = localStorage.getItem(CACHE_KEY);
    } catch (e) {
      // ignore — worst case it just asks again
    }
    if (cached) {
      reveal(cached);
      return;
    }

    var input = document.getElementById("f1-gate-input");
    var submit = document.getElementById("f1-gate-submit");
    var error = document.getElementById("f1-gate-error");
    if (!input || !submit || !error || submit.dataset.f1GateBound) return;
    submit.dataset.f1GateBound = "1";

    input.focus();

    function b64ToBytes(b64) {
      var binary = window.atob(b64);
      var bytes = new Uint8Array(binary.length);
      for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    }

    function shake() {
      gate.classList.remove("f1-gate-shake");
      void gate.offsetWidth; // restart the animation even on repeated wrong guesses
      gate.classList.add("f1-gate-shake");
    }

    function tryUnlock() {
      var value = input.value;
      if (!value) return;

      if (!(window.crypto && window.crypto.subtle)) {
        error.textContent = "Decryption isn't available in this browser.";
        return;
      }

      submit.disabled = true;
      error.textContent = "";

      // Wrapped in Promise.resolve().then(...) rather than calling
      // importKey() directly: some engines throw synchronously here
      // instead of returning a rejected promise for certain inputs, and a
      // sync throw at the start of a chain like this would skip the
      // .catch() below entirely, leaving submit.disabled stuck true and
      // nothing ever shown to the user. Deferring the call into a .then()
      // guarantees any failure — sync or async — always reaches .catch().
      Promise.resolve()
        .then(function () {
          return window.crypto.subtle.importKey("raw", new TextEncoder().encode(value), { name: "PBKDF2" }, false, [
            "deriveKey",
          ]);
        })
        .then(function (baseKey) {
          return window.crypto.subtle.deriveKey(
            {
              name: "PBKDF2",
              salt: b64ToBytes(payload.salt),
              iterations: payload.iterations,
              hash: "SHA-256",
            },
            baseKey,
            { name: "AES-GCM", length: 256 },
            false,
            ["decrypt"]
          );
        })
        .then(function (key) {
          return window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: b64ToBytes(payload.iv) },
            key,
            b64ToBytes(payload.ct)
          );
        })
        .then(function (plainBuf) {
          var html = new TextDecoder().decode(plainBuf);
          try {
            localStorage.setItem(CACHE_KEY, html);
          } catch (e) {
            // ignore — it'll just ask again next visit
          }
          submit.disabled = false;
          reveal(html);
        })
        .catch(function () {
          // Wrong password -> wrong derived key -> AES-GCM's auth tag
          // fails to verify -> decrypt() rejects. That rejection is the
          // only signal a wrong password ever produces.
          submit.disabled = false;
          error.textContent = "Not quite. Try again.";
          if (!prefersReducedMotion()) shake();
          input.value = "";
          input.focus();
        });
    }

    submit.addEventListener("click", tryUnlock);
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") tryUnlock();
    });
  }

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
   * Per-section accent colour: red on the homepage, purple on the 2025
   * project, blue on the 2026 project, green on Commissions. Tried
   * switching Material's own `data-md-color-accent` attribute first,
   * since it ships full CSS for every named accent colour — but
   * Material's compiled stylesheet re-declares --md-accent-fg-color
   * again at a deeper scope than <html> (confirmed empirically, not
   * assumed), so that override kept getting silently reset before it
   * reached anything in the page content. Toggling a class that drives
   * our own --f1-accent custom property (see extra.css) sidesteps that
   * fight entirely — it only has to win in our own stylesheet, not
   * Material's.
   * ------------------------------------------------------------------ */
  function applySectionAccent() {
    var html = document.documentElement;
    var purple = /\/f1-2025-theme\//.test(location.pathname);
    var blue = !purple && /\/project-1\//.test(location.pathname);
    var green = !purple && !blue && /\/commissions\//.test(location.pathname);
    var yellow = !purple && !blue && !green && /\/2027\//.test(location.pathname);
    html.classList.toggle("f1-section-purple", purple);
    html.classList.toggle("f1-section-blue", blue);
    html.classList.toggle("f1-section-green", green);
    html.classList.toggle("f1-section-yellow", yellow);
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
    // Purely decorative, already-animated elements — wrapping their text
    // would just double up unused spans (pointer-events:none up the
    // chain means they can never actually be hovered anyway).
    var SKIP_ANCESTOR_SELECTOR = ".f1-floating-hearts, .f1-mini-race, .stat-strip";

    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        var parent = node.parentNode;
        if (!parent || SKIP_PARENT[parent.nodeName] || !node.nodeValue || !node.nodeValue.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        if (parent.closest && parent.closest(SKIP_ANCESTOR_SELECTOR)) {
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
   * Numeric stat values (the "At a glance" strip) count up from 0
   * instead of just appearing — only for values that actually start
   * with digits ("35", "65h"); anything else ("Dark373", "1.0.1") is
   * left alone rather than animating something that isn't really a
   * count. Any non-digit suffix after the number ("h") is preserved and
   * only appended once the count finishes.
   * ------------------------------------------------------------------ */
  function initCountUp() {
    if (prefersReducedMotion()) return;

    var values = document.querySelectorAll(".stat-strip .stat-value");
    values.forEach(function (el) {
      if (el.dataset.f1Counted) return;
      el.dataset.f1Counted = "1";

      var match = /^(\d+)(.*)$/.exec(el.textContent);
      if (!match) return;
      var target = parseInt(match[1], 10);
      var suffix = match[2];
      if (!target) return;

      var duration = 700;
      var start = null;

      function frame(ts) {
        if (start === null) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) {
          requestAnimationFrame(frame);
        } else {
          el.textContent = target + suffix; // land exactly on the real value
        }
      }
      requestAnimationFrame(frame);
    });
  }

  /* ------------------------------------------------------------------
   * Scroll reveal: .f1-reveal sections (see extra.css and the homepage)
   * fade + rise into place the first time they enter the viewport, rather
   * than just appearing. Any .gallery-grid (see the reusable pattern in
   * extra.css) gets this automatically too, one image at a time in a
   * staggered cascade — ScrollReveal.js-style — so dropping a plain
   * .gallery-grid into any project's Gallery page is enough; nothing to
   * hand-wire per image.
   *
   * CSS alone never hides a .f1-reveal element — only the "-armed"
   * class does, and only this function adds it, right as it starts
   * observing that element. That ordering matters: if this script fails
   * to load, throws, or an earlier init function in the onDocumentReady
   * chain throws first and blocks this one from ever running, content
   * simply stays visible the whole time instead of getting stuck
   * invisible forever. The animation is purely additive on top of an
   * always-visible default, never a hide-by-default/reveal-by-JS gate.
   * ------------------------------------------------------------------ */
  function initScrollReveal() {
    var manual = document.querySelectorAll(".f1-reveal:not([data-f1-reveal-bound])");

    // Auto-adopt every image inside an as-yet-unscanned .gallery-grid as
    // its own reveal target, staggering the delay by position so a row
    // cascades in left-to-right instead of every image fading at the
    // same instant. Delay resets every 8 items rather than climbing
    // forever, so a big gallery's last row doesn't lag half a second
    // behind its first.
    //
    // Targets the <img> itself, not its wrapping <p> or glightbox's <a>:
    // consecutive Markdown image lines with no blank line between them
    // compile into ONE shared <p> holding all of them (confirmed by
    // inspecting the actual build output, not assumed), so a per-image
    // target has to reach past that wrapper. And CSS transforms have no
    // effect on non-replaced inline elements (the spec's own wording) —
    // <a> is exactly that unless something gives it a block/inline-block
    // display, whereas <img> is a *replaced* inline element and isn't
    // exempted, so it's the one node guaranteed to actually animate.
    var galleryItems = [];
    document.querySelectorAll(".gallery-grid:not([data-f1-reveal-scanned])").forEach(function (grid) {
      grid.dataset.f1RevealScanned = "1";
      var imgs = grid.querySelectorAll("img");
      imgs.forEach(function (img, i) {
        img.classList.add("f1-reveal");
        img.style.transitionDelay = (i % 8) * 70 + "ms";
        galleryItems.push(img);
      });
    });

    var els = Array.prototype.slice.call(manual).concat(galleryItems);
    if (!els.length) return;

    if (prefersReducedMotion() || !("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.dataset.f1RevealBound = "1";
        el.classList.add("f1-revealed");
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("f1-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );

    els.forEach(function (el) {
      el.dataset.f1RevealBound = "1";
      el.classList.add("f1-reveal-armed");
      observer.observe(el);
    });
  }

  /* ------------------------------------------------------------------
   * Gallery hover captions: builds a two-tab (Render Location / Theme
   * Option) panel for every .gallery-grid image, sourced from that
   * image's data-location/data-theme attributes — see the relevant
   * gallery.md for where those actually get set per image (empty ones
   * fall back to placeholder text rather than an empty panel). Revealed
   * on hover/focus by the CSS (.f1-gallery-caption in extra.css); this
   * only builds the markup once per image, guarded the same way every
   * other DOM-injecting init function here is, so repeat calls across
   * instant-navigation page swaps don't double it up.
   * ------------------------------------------------------------------ */
  // HTML attributes can only ever hold a single line of plain text —
  // there's no way to put a real (or Markdown) list directly inside
  // data-location="..."/data-theme="...". This is the workaround: split
  // the attribute's value on ";" and render each piece as its own <li>
  // when there's more than one; a value with no ";" in it (the common
  // case) renders as plain text same as before, no empty bullet list
  // wrapper. A literal newline inside the quoted value (easy to try, and
  // it doesn't error) is NOT how you get a list here — attr_list values
  // are single-line; use ";" instead, e.g.
  // data-theme="Background Colour Theme: Custom Colour; Name: Test".
  function renderPanelContent(raw) {
    var parts = raw
      .split(";")
      .map(function (s) {
        return s.trim();
      })
      .filter(Boolean);
    if (parts.length <= 1) {
      return escapeHtml(raw);
    }
    return (
      "<ul>" +
      parts
        .map(function (p) {
          return "<li>" + escapeHtml(p) + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function initGalleryCaptions() {
    var imgs = document.querySelectorAll(".gallery-grid img:not([data-f1-caption-bound])");
    imgs.forEach(function (img) {
      img.dataset.f1CaptionBound = "1";
      var link = img.closest("a.glightbox");
      if (!link) return;

      var location = img.getAttribute("data-location") || "Add render location details here.";
      var themeOption = img.getAttribute("data-theme") || "Add theme option details here.";

      var caption = document.createElement("div");
      caption.className = "f1-gallery-caption";
      caption.innerHTML =
        '<div class="f1-gallery-tabs">' +
        '<button type="button" class="f1-gallery-tab f1-gallery-tab-active" data-tab="location">Render Location</button>' +
        '<button type="button" class="f1-gallery-tab" data-tab="theme">Theme Option</button>' +
        "</div>" +
        // These are <div>s, not <p>s, on purpose: .gallery-grid p is
        // already claimed by the masonry fix (display:contents, so a
        // shared multi-image paragraph unwraps into individual grid
        // items — see extra.css) and would silently win over
        // .f1-gallery-panel's own display:none/block on specificity,
        // showing both panels stacked at once instead of toggling.
        '<div class="f1-gallery-panels">' +
        '<div class="f1-gallery-panel f1-gallery-panel-active" data-panel="location">' +
        renderPanelContent(location) +
        "</div>" +
        '<div class="f1-gallery-panel" data-panel="theme">' +
        renderPanelContent(themeOption) +
        "</div>" +
        "</div>";
      link.appendChild(caption);
    });
  }

  // Tab-switching is a single delegated listener, not per-caption — the
  // captions themselves get rebuilt/added across instant-navigation page
  // swaps, but the listener only needs binding once, ever.
  //
  // Registered on the CAPTURE phase (that trailing `true`), not the
  // default bubble phase — confirmed by testing, not assumed: glightbox
  // binds its own open-on-click handler directly on the .glightbox <a>
  // itself, which is an ANCESTOR of the tab button and therefore fires
  // during the bubble phase *before* a bubble-phase listener sitting all
  // the way up on `document` ever gets a turn. By the time this handler
  // ran, the lightbox had already opened — stopPropagation() here was too
  // late to matter. A capture-phase listener on `document` runs first,
  // on the way down to the actual click target, so stopping it here keeps
  // the event from ever reaching the anchor's bubble-phase handler.
  document.addEventListener(
    "click",
    function (e) {
      var btn = e.target.closest(".f1-gallery-tab");
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();

      var caption = btn.closest(".f1-gallery-caption");
      if (!caption) return;
      var tab = btn.dataset.tab;
      caption.querySelectorAll(".f1-gallery-tab").forEach(function (b) {
        b.classList.toggle("f1-gallery-tab-active", b === btn);
      });
      caption.querySelectorAll(".f1-gallery-panel").forEach(function (p) {
        p.classList.toggle("f1-gallery-panel-active", p.dataset.panel === tab);
      });
    },
    true
  );

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
      '<svg viewBox="0 0 240 140" role="img" aria-label="Grand Prix Circuit: hover the checkered patch for a lap">' +
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
      '<p class="f1-track-laps">Cross the finish line</p>' +
      '<p class="f1-track-career"></p>'
    );
  }

  // Total laps ever recorded on this browser, across every track, every
  // page, every visit — a small "career" stat that only grows. Wrapped
  // in try/catch since localStorage can throw in some private-browsing
  // configurations; the site works fine without it, it just won't count.
  var CAREER_LAPS_KEY = "f1-career-laps";
  function readCareerLaps() {
    try {
      var v = parseInt(localStorage.getItem(CAREER_LAPS_KEY) || "0", 10);
      return isNaN(v) ? 0 : v;
    } catch (e) {
      return 0;
    }
  }
  function bumpCareerLaps() {
    var v = readCareerLaps() + 1;
    try {
      localStorage.setItem(CAREER_LAPS_KEY, String(v));
    } catch (e) {
      // ignore — no persistence this session, no big deal
    }
    return v;
  }

  // A little progression on top of the career total, so it's not just a
  // number that goes up but an actual rank you can climb.
  var DRIVER_RANKS = [
    { min: 50, label: "👑 Legend" },
    { min: 20, label: "🏆 Champion" },
    { min: 5, label: "🏎️ Racer" },
    { min: 0, label: "🔰 Rookie" },
  ];
  function driverRank(laps) {
    for (var i = 0; i < DRIVER_RANKS.length; i++) {
      if (laps >= DRIVER_RANKS[i].min) return DRIVER_RANKS[i].label;
    }
    return DRIVER_RANKS[DRIVER_RANKS.length - 1].label;
  }
  function careerLine(laps) {
    return "Career laps: " + laps + " · " + driverRank(laps);
  }

  // Wires up lap-counting + confetti on a freshly-built track widget.
  // Each widget keeps its own on-page lap count, but they all add to the
  // same career total. The listener sits on the checkered finish-line
  // patch specifically (not the whole SVG's bounding box), so a lap only
  // counts, and confetti only fires, exactly when the cursor crosses the
  // finish line.
  function wireTrackWidget(container) {
    var finish = container.querySelector(".f1-finish-line");
    var lapEl = container.querySelector(".f1-track-laps");
    var careerEl = container.querySelector(".f1-track-career");
    if (!finish || !lapEl) return;

    if (careerEl) careerEl.textContent = careerLine(readCareerLaps());

    var laps = 0;
    finish.addEventListener("mouseenter", function () {
      laps += 1;
      lapEl.textContent = "Lap " + (laps < 10 ? "0" + laps : laps);
      if (careerEl) careerEl.textContent = careerLine(bumpCareerLaps());
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
   * Leaderboard: local only, honestly. There's no server behind this
   * site, so "leaderboard" means the top scores saved on *this* browser,
   * not a global ranking shared with every visitor — it's an arcade
   * high-score table, not a live scoreboard. Lives in the homepage's
   * left sidebar, which is otherwise empty (Home has no sub-pages of its
   * own for Material to list there).
   * ------------------------------------------------------------------ */
  var LEADERBOARD_KEY = "f1-leaderboard";
  var LEADERBOARD_MAX_ENTRIES = 5;

  function readLeaderboard() {
    try {
      var v = JSON.parse(localStorage.getItem(LEADERBOARD_KEY) || "[]");
      return Array.isArray(v) ? v : [];
    } catch (e) {
      return [];
    }
  }

  function saveLeaderboardEntry(name, speed, laps) {
    var list = readLeaderboard();
    list.push({ name: name, speed: Math.round(speed), laps: laps });
    list.sort(function (a, b) {
      return b.speed - a.speed;
    });
    list = list.slice(0, LEADERBOARD_MAX_ENTRIES);
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(list));
    } catch (e) {
      // ignore — this run just won't be saved
    }
    return list;
  }

  function escapeHtml(s) {
    var div = document.createElement("div");
    div.textContent = s;
    return div.innerHTML;
  }

  function renderLeaderboard(listEl) {
    var list = readLeaderboard();
    if (!list.length) {
      listEl.innerHTML = '<li class="f1-leaderboard-empty">No runs yet. Be the first!</li>';
      return;
    }
    listEl.innerHTML = list
      .map(function (entry, i) {
        return (
          '<li class="f1-leaderboard-row">' +
          '<span class="f1-leaderboard-rank">' + (i + 1) + "</span>" +
          '<span class="f1-leaderboard-name">' + escapeHtml(entry.name || "Anonymous") + "</span>" +
          '<span class="f1-leaderboard-stat">' + entry.speed + " km/h</span>" +
          '<span class="f1-leaderboard-stat">' + entry.laps + " laps</span>" +
          "</li>"
        );
      })
      .join("");
  }

  function initLeaderboard() {
    if (!document.getElementById("f1-home-track")) return; // homepage only
    if (document.getElementById("f1-leaderboard")) return;

    var host =
      document.querySelector(".md-sidebar--primary .md-sidebar__inner") ||
      document.querySelector(".md-sidebar--primary .md-sidebar__scrollwrap") ||
      document.querySelector(".md-sidebar--primary");
    if (!host) return;

    var widget = document.createElement("div");
    widget.id = "f1-leaderboard";
    widget.innerHTML =
      '<p class="f1-leaderboard-title">🏆 Leaderboard</p>' +
      '<ol class="f1-leaderboard-list"></ol>' +
      '<button type="button" class="f1-leaderboard-save">Save my score</button>' +
      '<p class="f1-leaderboard-note">Top speeds, saved on this device only — not shared with other visitors.</p>';
    host.appendChild(widget);

    var listEl = widget.querySelector(".f1-leaderboard-list");
    renderLeaderboard(listEl);

    widget.querySelector(".f1-leaderboard-save").addEventListener("click", function () {
      var name = window.prompt("Username for the leaderboard (max 14 characters):");
      if (name === null) return; // cancelled
      name = name.trim().slice(0, 14);
      if (!name) return;
      saveLeaderboardEntry(name, sessionMaxSpeed, readCareerLaps());
      renderLeaderboard(listEl);
    });
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
    // Sibling of the rotor, not a child of it, so it tracks the cursor's
    // position without spinning along with the car.
    var speedo = document.createElement("div");
    speedo.id = "f1-speedo";
    cursorEl.appendChild(speedo);
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

    // Live "speed" readout: not physically real (there's no meaningful
    // unit for how fast a mouse moves across a screen of unknown size),
    // just a fun number that climbs when you wave the cursor around and
    // settles back to 0 the moment it stops — playing with it is the
    // whole point. Speed is measured between consecutive mousemove
    // events and smoothed (exponential moving average) so it reads as a
    // needle easing around rather than jumping every frame.
    var lastMoveTime = null;
    var smoothSpeed = 0;
    var idleTimer = null;

    document.addEventListener(
      "mousemove",
      function (e) {
        var now = performance.now();
        if (lastMoveTime !== null) {
          var dt = now - lastMoveTime;
          if (dt > 0) {
            var dist = Math.hypot(e.clientX - mouseX, e.clientY - mouseY);
            var instantSpeed = ((dist / dt) * 1000) * 0.18; // px/s, scaled into a fun range
            smoothSpeed = smoothSpeed * 0.75 + instantSpeed * 0.25;
            if (smoothSpeed > sessionMaxSpeed) sessionMaxSpeed = smoothSpeed;
          }
        }
        lastMoveTime = now;

        mouseX = e.clientX;
        mouseY = e.clientY;
        cursorEl.style.opacity = "1";
        requestTick();

        speedo.textContent = Math.round(smoothSpeed) + " km/h";
        speedo.classList.add("f1-speedo-active");
        clearTimeout(idleTimer);
        idleTimer = setTimeout(function () {
          speedo.classList.remove("f1-speedo-active");
          smoothSpeed = 0;
        }, 500);
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
