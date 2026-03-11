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
