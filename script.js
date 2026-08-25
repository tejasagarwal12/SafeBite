/* ==========================================================================
   SAFE BITE — Interactions
   All functionality here is a front-end simulation for presentation
   purposes only. Nothing connects to a real backend, database, or
   food-testing system.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------------
     1. Sticky navbar + scroll progress trace
  --------------------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const scanTrace = document.getElementById('scanTrace');

  function onScroll(){
    const scrollTop = window.scrollY;
    nav.classList.toggle('scrolled', scrollTop > 20);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scanTrace.style.width = progress + '%';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------------
     2. Mobile hamburger menu
  --------------------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');

  function openMenu(){
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function closeMenu(){
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  mobileClose.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close the menu automatically if the viewport is resized back to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && mobileMenu.classList.contains('open')) closeMenu();
  });

  /* ---------------------------------------------------------------------
     3. Smooth scrolling for in-page anchor links
     (native CSS scroll-behavior handles most cases; this adds a small
     offset so the sticky nav never overlaps the target heading)
  --------------------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e){
      const targetId = this.getAttribute('href');
      if (targetId.length < 2) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navHeight = document.getElementById('nav').offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------------------------------------------------------------------
     4. Scroll reveal animations
  --------------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------------------------------------------------------------------
     5. Button click feedback (micro-interaction)
  --------------------------------------------------------------------- */
  document.querySelectorAll('.btn, .sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('clicked');
      setTimeout(() => btn.classList.remove('clicked'), 180);
    });
  });

  /* ---------------------------------------------------------------------
     6. Interactive simulated testing demo
  --------------------------------------------------------------------- */
  const sampleButtons = document.querySelectorAll('.sample-btn');
  const runDemoBtn = document.getElementById('runDemo');
  const demoReadout = document.getElementById('demoReadout');
  const demoLed = document.getElementById('demoLed');
  const scanBeam = document.getElementById('scanBeam');

  let selectedSample = 'Milk';
  let isRunning = false;

  sampleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      sampleButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSample = btn.dataset.sample;
      resetReadout();
    });
  });

  function resetReadout(){
    demoReadout.innerHTML = '<span class="readout-idle">Select a sample and run the test</span>';
    demoLed.classList.remove('is-unsafe');
  }

  runDemoBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    runDemoBtn.disabled = true;

    demoReadout.innerHTML = `<span class="readout-scanning">Scanning ${selectedSample.toLowerCase()} sample…</span>`;
    demoLed.classList.remove('is-unsafe');
    scanBeam.classList.remove('scanning');
    // trigger reflow so the animation can restart
    void scanBeam.offsetWidth;
    scanBeam.classList.add('scanning');

    setTimeout(() => {
      // DEMO result only — not a real test. Chosen for a balanced,
      // varied demonstration rather than any real detection logic.
      const isSafe = Math.random() > 0.45;

      if (isSafe){
        demoLed.classList.remove('is-unsafe');
        demoReadout.innerHTML = `
          <span class="readout-result readout-safe">
            <span class="readout-dot"></span> Demo Result: SAFE
          </span>`;
      } else {
        demoLed.classList.add('is-unsafe');
        demoReadout.innerHTML = `
          <span class="readout-result readout-unsafe">
            <span class="readout-dot"></span> Demo Result: POSSIBLE ADULTERATION
          </span>`;
      }

      scanBeam.classList.remove('scanning');
      isRunning = false;
      runDemoBtn.disabled = false;
    }, 2400);
  });

});
