/* NOVA — parallax engine, reveals, tilt cards & counters */
(() => {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Scroll parallax (data-speed) ----------
     Elements translate at a fraction of the scroll distance.
     Positive speed = moves slower than page (background feel),
     negative speed = moves against the scroll. */
  const speedEls = Array.from(document.querySelectorAll("[data-speed]"));
  const bgEls = Array.from(document.querySelectorAll("[data-bg-parallax]"));

  let scrollY = window.scrollY;
  let ticking = false;

  function applyScrollParallax() {
    for (const el of speedEls) {
      const speed = parseFloat(el.dataset.speed);
      // Offset relative to the element's section so distant sections don't fly away
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = `translate3d(0, ${-offset}px, 0)`;
    }
    for (const el of bgEls) {
      const speed = parseFloat(el.dataset.bgParallax);
      const rect = el.parentElement.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
      el.style.transform = `translate3d(0, ${offset}px, 0)`;
    }
    ticking = false;
  }

  function onScroll() {
    scrollY = window.scrollY;
    updateProgress();
    updateNavbar();
    if (!prefersReducedMotion && !ticking) {
      ticking = true;
      requestAnimationFrame(applyScrollParallax);
    }
  }

  /* ---------- Mouse parallax in hero (data-mouse) ---------- */
  const hero = document.getElementById("hero");
  const mouseEls = Array.from(document.querySelectorAll("[data-mouse]"));
  let mouseRaf = null;

  function onHeroMouse(e) {
    if (prefersReducedMotion || mouseRaf) return;
    mouseRaf = requestAnimationFrame(() => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx; // -1 .. 1
      const dy = (e.clientY - cy) / cy;
      for (const el of mouseEls) {
        const depth = parseFloat(el.dataset.mouse);
        // combine with existing scroll transform via CSS variable-free approach:
        // mouse layers live inside the hero, whose scroll offset is small at top,
        // so we fold both into one transform.
        const speed = parseFloat(el.dataset.speed || 0);
        const rect = el.parentElement.getBoundingClientRect();
        const scrollOffset =
          (rect.top + rect.height / 2 - window.innerHeight / 2) * speed;
        el.style.transform = `translate3d(${-dx * depth}px, ${
          -dy * depth - scrollOffset
        }px, 0)`;
      }
      mouseRaf = null;
    });
  }
  if (hero) hero.addEventListener("mousemove", onHeroMouse);

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById("progressBar");
  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = `${(scrollY / max) * 100}%`;
  }

  /* ---------- Navbar background on scroll ---------- */
  const navbar = document.getElementById("navbar");
  function updateNavbar() {
    navbar.classList.toggle("scrolled", scrollY > 40);
  }

  /* ---------- Cursor glow ---------- */
  const glow = document.getElementById("cursorGlow");
  window.addEventListener("pointermove", (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top = `${e.clientY}px`;
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-left, .reveal-right");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.18 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* ---------- 3D tilt cards ---------- */
  const tiltEls = document.querySelectorAll(".tilt");
  const MAX_TILT = 10; // degrees

  tiltEls.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (prefersReducedMotion) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${px * MAX_TILT}deg) rotateX(${
        -py * MAX_TILT
      }deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll(".stat-num");
  const counterObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        counterObserver.unobserve(entry.target);
        animateCount(entry.target);
      }
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterObserver.observe(el));

  function animateCount(el) {
    const target = parseInt(el.dataset.count, 10);
    if (prefersReducedMotion || target === 0) {
      el.textContent = target;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      el.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* ---------- Init ---------- */
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
