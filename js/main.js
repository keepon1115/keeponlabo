/* ============================================
   キープオン LP — Main JavaScript
   ============================================ */

(function () {
  "use strict";

  /* ---------- Header shadow on scroll ---------- */
  const header = document.getElementById("header");

  function updateHeader() {
    if (!header) return;
    header.classList.toggle("header--scrolled", window.scrollY > 20);
  }

  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ---------- Scroll reveal (IntersectionObserver) ---------- */
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = parseInt(el.dataset.delay, 10) || 0;
          setTimeout(() => el.classList.add("is-visible"), delay);
          revealObserver.unobserve(el);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Hero title — character-by-character "speaking" animation ---------- */
  (function initHeroTitle() {
    const titleEl   = document.querySelector(".hero__title");
    const schoolEl  = document.querySelector(".hero__school");
    const copyEl    = document.querySelector(".hero__copy");
    const ctaEl     = document.querySelector(".hero__content .btn--cta");

    // Hide supporting elements until after the title finishes
    [schoolEl, copyEl, ctaEl].forEach(function (el) {
      if (el) el.classList.add("hero__fade-hidden");
    });

    if (!titleEl) return;

    const text = titleEl.textContent.trim();
    titleEl.innerHTML = "";

    // Build per-character spans with staggered animation-delay
    var delayMs = 350; // initial pause (video starts loading)
    [...text].forEach(function (char) {
      var span = document.createElement("span");
      span.textContent = char;
      span.className = "hero__char";
      span.style.animationDelay = delayMs + "ms";
      titleEl.appendChild(span);

      // Base cadence: 90ms per character
      delayMs += 90;
      // Longer pause at punctuation — feels like the speaker is pausing
      if ("。、！？".includes(char)) delayMs += 220;
    });

    // After title finishes, reveal school label → copy → CTA in sequence
    var afterMs = delayMs + 150;

    function revealEl(el, extraMs) {
      if (!el) return;
      setTimeout(function () {
        el.classList.remove("hero__fade-hidden");
        el.style.transition = "opacity 0.75s ease, transform 0.75s ease";
      }, afterMs + extraMs);
    }

    revealEl(schoolEl, 0);
    revealEl(copyEl,   200);
    revealEl(ctaEl,    450);
  })();

  /* ---------- Counter animation for stat values ---------- */
  const statValues = document.querySelectorAll(".stat-card__value");

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    if (isNaN(target)) return;

    const duration = 2000;
    const startTime = performance.now();
    const hasDecimal = String(target).includes(".");
    const decimalPlaces = hasDecimal
      ? String(target).split(".")[1].length
      : 0;

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      el.textContent = hasDecimal
        ? current.toFixed(decimalPlaces)
        : Math.round(current).toString();

      if (progress < 1) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  if (statValues.length > 0 && "IntersectionObserver" in window) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );

    statValues.forEach((el) => counterObserver.observe(el));
  }
})();
