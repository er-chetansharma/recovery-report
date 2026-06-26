/* ===================================================================
   RECOVERY INSIGHTS — SCRIPT
   Vanilla JS only. No dependencies, no build step.

   Sections:
   1. Reduced-motion detection
   2. Future-ready data layer (placeholder variables)
   3. Loading sequence
   4. Scroll-reveal (Intersection Observer)
   5. Number counting + progress bars
   6. Pattern rings + balance bars animation
   7. Accordion (FAQ)
   8. Button ripple micro-interaction
   9. Booking button wiring (Calendly placeholder)
   =================================================================== */

(function () {
  'use strict';

  /* -----------------------------------------------------------
     1. REDUCED MOTION
     Respected everywhere animation timing is decided in JS.
     CSS handles its own reduced-motion rules independently.
     ----------------------------------------------------------- */
  var prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  /* -----------------------------------------------------------
     2. FUTURE-READY DATA LAYER
     This object is the single source of truth for dynamic content.
     Today it holds placeholders. Later, this can be populated from
     a query string, a backend call, or an AI-generated report —
     without touching the markup or layout below.
     ----------------------------------------------------------- */
  var RecoveryInsightsData = {
    firstName: null, // e.g. "Aisha" — falls back to "there" if null
    insights: null,  // future: array of { title, text, confidence }
    pattern: null,   // future: dynamic protection/recovery narrative
    balance: {
      protection: 78,
      recovery: 22
    }
  };

  function applyDynamicData() {
    var nameEl = document.querySelector('[data-var="firstName"]');
    if (nameEl && RecoveryInsightsData.firstName) {
      nameEl.textContent = RecoveryInsightsData.firstName;
    }
    // Future hooks: insights + pattern injection would render here,
    // replacing static markup once an AI-generated report is wired in.
  }

  // Optional: read ?name= from URL so the link can be personalized
  // immediately, without any backend changes.
  (function readNameFromQuery() {
    try {
      var params = new URLSearchParams(window.location.search);
      var name = params.get('name');
      if (name) {
        RecoveryInsightsData.firstName = decodeURIComponent(name).trim();
      }
    } catch (e) {
      /* no-op: keep default placeholder if anything goes wrong */
    }
  })();

  /* -----------------------------------------------------------
     3. LOADING SEQUENCE
     ----------------------------------------------------------- */
  function runLoader() {
    var loader = document.getElementById('loader');
    var loaderText = document.getElementById('loaderText');
    var experience = document.getElementById('experience');

    var messages = [
      'Analyzing your responses…',
      'Understanding your nervous system…',
      'Preparing your Recovery Insights…'
    ];

    var totalDuration = prefersReducedMotion ? 400 : 2400;
    var step = totalDuration / messages.length;

    messages.forEach(function (msg, i) {
      setTimeout(function () {
        if (loaderText) loaderText.textContent = msg;
      }, i * step);
    });

    setTimeout(function () {
      applyDynamicData();
      experience.hidden = false;
      requestAnimationFrame(function () {
        loader.setAttribute('data-hide', '');
        initRevealObserver();
      });
      setTimeout(function () {
        loader.style.display = 'none';
        loader.setAttribute('aria-hidden', 'true');
      }, 500);
    }, totalDuration);
  }

  /* -----------------------------------------------------------
     4. SCROLL REVEAL
     ----------------------------------------------------------- */
  function initRevealObserver() {
    var targets = document.querySelectorAll('[data-reveal]');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-visible'); });
      triggerAllDataVisuals();
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            handleSectionAnimations(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(function (el) { observer.observe(el); });
  }

  function triggerAllDataVisuals() {
    document.querySelectorAll('[data-fill]').forEach(animateFillBar);
    document.querySelectorAll('[data-count]').forEach(animateCount);
    document.querySelectorAll('.pattern-rings').forEach(function (svg) {
      svg.classList.add('is-animated');
    });
  }

  /* -----------------------------------------------------------
     5 & 6. NUMBER COUNTING / PROGRESS / RINGS — dispatched per
     section so they fire only once their container is visible.
     ----------------------------------------------------------- */
  function handleSectionAnimations(target) {
    // Insight card confidence bars
    target.querySelectorAll('[data-fill].confidence__fill').forEach(animateFillBar);

    // Balance viz (Section 4 signature element)
    target.querySelectorAll('.balance-row__fill[data-fill]').forEach(animateFillBar);
    target.querySelectorAll('[data-count]').forEach(animateCount);

    // Pattern rings (Section 3)
    if (target.querySelector('.pattern-rings')) {
      target.querySelector('.pattern-rings').classList.add('is-animated');
    }
  }

  function animateFillBar(el) {
    var value = el.getAttribute('data-fill');
    requestAnimationFrame(function () {
      el.style.width = value + '%';
      el.classList.add('is-filled');
    });
  }

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    if (prefersReducedMotion) {
      el.textContent = target + '%';
      return;
    }
    var duration = 1100;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      var current = Math.round(eased * target);
      el.textContent = current + '%';
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }
    requestAnimationFrame(step);
  }

  /* -----------------------------------------------------------
     7. ACCORDION (FAQ)
     ----------------------------------------------------------- */
  function initAccordion() {
    var accordion = document.querySelector('[data-accordion]');
    if (!accordion) return;

    accordion.addEventListener('click', function (e) {
      var trigger = e.target.closest('.accordion__trigger');
      if (!trigger) return;

      var panel = document.getElementById(trigger.getAttribute('aria-controls'));
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';

      // Close any other open panel for a single-open accordion feel
      accordion.querySelectorAll('.accordion__trigger[aria-expanded="true"]').forEach(function (openTrigger) {
        if (openTrigger !== trigger) {
          var openPanel = document.getElementById(openTrigger.getAttribute('aria-controls'));
          collapsePanel(openPanel);
          openTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      if (isOpen) {
        collapsePanel(panel);
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        expandPanel(panel);
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  }

  function expandPanel(panel) {
    panel.hidden = false;
    var height = panel.scrollHeight;
    panel.style.maxHeight = '0px';
    requestAnimationFrame(function () {
      panel.style.maxHeight = height + 'px';
    });
  }

  function collapsePanel(panel) {
    panel.style.maxHeight = '0px';
    var onEnd = function () {
      panel.hidden = true;
      panel.removeEventListener('transitionend', onEnd);
    };
    panel.addEventListener('transitionend', onEnd);
    if (prefersReducedMotion) onEnd();
  }

  /* -----------------------------------------------------------
     8. BUTTON RIPPLE
     ----------------------------------------------------------- */
  function initRipple() {
    document.querySelectorAll('.btn--primary').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        if (prefersReducedMotion) return;
        var rect = btn.getBoundingClientRect();
        var ripple = document.createElement('span');
        var size = Math.max(rect.width, rect.height);
        ripple.className = 'btn__ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        setTimeout(function () { ripple.remove(); }, 650);
      });
    });
  }

  /* -----------------------------------------------------------
     9. BOOKING BUTTONS
     The Calendly embed/link is intentionally NOT hardcoded here.
     Replace the body of `openBooking()` with the Calendly inline
     widget call or a direct link once the link is available:

       Calendly.initPopupWidget({ url: 'YOUR_CALENDLY_URL' });

     Until then, this scrolls to the pricing card as a graceful
     placeholder so the button is never dead.
     ----------------------------------------------------------- */
  function initBooking() {
    var bookingTriggers = document.querySelectorAll('#bookingButton, .js-book-trigger');

    function openBooking() {
  window.location.href = "https://rzp.io/rzp/a2IcTs5";
}

    bookingTriggers.forEach(function (btn) {
      btn.addEventListener('click', openBooking);
    });
  }

  /* -----------------------------------------------------------
     INIT
     ----------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    runLoader();
    initAccordion();
    initRipple();
    initBooking();
  });
})();
