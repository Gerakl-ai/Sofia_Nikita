/**
 * ═══════════════════════════════════════
 *  SOFIA & NIKITA — WEDDING INVITATION
 *  Optimized for mobile performance
 * ═══════════════════════════════════════
 */
'use strict';

const WEDDING = new Date('2026-08-01T15:00:00');
const IS_MOBILE = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) || window.innerWidth < 768;
const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ══════════════════════════════════
   LOADING SCREEN
══════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    startHeroAnimations();
  }, 1600);
});

/* ══════════════════════════════════
   HERO — CANVAS PARTICLE SYSTEM
   Heavily optimized for mobile
══════════════════════════════════ */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || PREFERS_REDUCED) return;
  const ctx = canvas.getContext('2d', { alpha: true });
  let W, H, particles = [], animId = null, isVisible = false;

  /* Pre-computed color strings to avoid runtime concat */
  const COLORS = [
    { fill: 'rgba(212,165,165,', glow: 'rgba(212,165,165,' },
    { fill: 'rgba(253,232,224,', glow: 'rgba(253,232,224,' },
    { fill: 'rgba(201,176,55,',  glow: 'rgba(201,176,55,' },
    { fill: 'rgba(156,175,136,', glow: 'rgba(156,175,136,' },
    { fill: 'rgba(200,184,212,', glow: 'rgba(200,184,212,' },
    { fill: 'rgba(255,255,240,', glow: 'rgba(255,255,240,' },
  ];

  /* Lock initial height on mobile to prevent address-bar-resize jank */
  let lockedH = null;

  function resize(force) {
    const dpr = IS_MOBILE ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;

    if (IS_MOBILE) {
      /* On mobile, lock height to first measurement so the
         canvas doesn't jump when the browser chrome hides/shows */
      if (!lockedH || force) lockedH = window.innerHeight;
      H = lockedH;
    } else {
      H = window.innerHeight;
    }

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    /* Let CSS handle visual size via 100% on the element */
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  // On mobile: fewer particles, no glow orbs, simpler drawing
  const MAX_PARTICLES = IS_MOBILE ? 25 : 70;

  class Particle {
    constructor(init) { this.reset(init); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : -20;
      this.c = COLORS[Math.floor(Math.random() * COLORS.length)];

      if (IS_MOBILE) {
        // Mobile: only petals and sparkles, no expensive glow orbs
        this.type = Math.random() < 0.6 ? 1 : 2;
      } else {
        this.type = Math.random() < 0.25 ? 0 : (Math.random() < 0.5 ? 1 : 2);
      }

      if (this.type === 0) {
        this.size = 25 + Math.random() * 40;
        this.opacity = 0.02 + Math.random() * 0.03;
        this.vy = 0.12 + Math.random() * 0.2;
        this.vx = (Math.random() - 0.5) * 0.15;
      } else if (this.type === 1) {
        this.size = 3 + Math.random() * 6;
        this.opacity = 0.12 + Math.random() * 0.3;
        this.vy = 0.3 + Math.random() * 0.7;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.rot = Math.random() * Math.PI * 2;
        this.rotV = (Math.random() - 0.5) * 0.02;
      } else {
        this.size = 1 + Math.random() * 2;
        this.opacity = 0.2 + Math.random() * 0.5;
        this.vy = 0.08 + Math.random() * 0.3;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.twinkle = Math.random() * 6.28;
      }
      this.wave = Math.random() * 6.28;
      this.waveAmp = 0.2 + Math.random() * 0.4;
    }

    update() {
      this.wave += 0.012;
      this.x += this.vx + Math.sin(this.wave) * this.waveAmp;
      this.y += this.vy;
      if (this.type === 1) this.rot += this.rotV;
      if (this.type === 2) this.twinkle += 0.04;
      if (this.y > H + 30 || this.x < -30 || this.x > W + 30) this.reset(false);
    }

    draw() {
      if (this.type === 0 && !IS_MOBILE) {
        // Glow orb — desktop only
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, this.c.glow + this.opacity + ')');
        grad.addColorStop(1, this.c.glow + '0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 6.28);
        ctx.fill();
      } else if (this.type === 1) {
        // Petal — simple ellipse
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = this.c.fill + '1)';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.35, this.size, 0, 0, 6.28);
        ctx.fill();
        ctx.restore();
      } else {
        // Sparkle — simple dot
        const a = this.opacity * (0.5 + 0.5 * Math.sin(this.twinkle));
        ctx.globalAlpha = a;
        ctx.fillStyle = this.c.fill + '1)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 6.28);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(Math.floor(W / (IS_MOBILE ? 30 : 12)), MAX_PARTICLES);
    for (let i = 0; i < count; i++) particles.push(new Particle(true));
  }

  function loop() {
    if (!isVisible) { animId = null; return; }
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    animId = requestAnimationFrame(loop);
  }

  const heroEl = document.getElementById('hero');
  const obs = new IntersectionObserver(([e]) => {
    isVisible = e.isIntersecting;
    if (isVisible && !animId) loop();
  }, { threshold: 0.01 });
  obs.observe(heroEl);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    /* On mobile only re-init on orientation change (large width delta) */
    resizeTimer = setTimeout(() => {
      const widthDelta = Math.abs(window.innerWidth - W);
      if (!IS_MOBILE || widthDelta > 100) {
        if (IS_MOBILE) lockedH = null; /* unlock for orientation change */
        init();
      }
    }, 300);
  }, { passive: true });

  init();
})();

/* ══════════════════════════════════
   HERO — ENTRANCE ANIMATIONS
══════════════════════════════════ */
function startHeroAnimations() {
  const items = document.querySelectorAll('.hero__content .anim-item');
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 150 + i * 200);
  });
}

/* ══════════════════════════════════
   HERO — PARALLAX (desktop only)
══════════════════════════════════ */
(function initParallax() {
  // Skip parallax on mobile completely to avoid jank
  if (IS_MOBILE) return;

  const content = document.getElementById('heroContent');
  const frame = document.querySelector('.hero__frame');
  if (!content) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const maxH = window.innerHeight;
        if (y <= maxH) {
          const pct = y / maxH;
          content.style.transform = `translate3d(0,${y * 0.3}px,0)`;
          content.style.opacity = String(Math.max(0, 1 - pct * 1.6));
          if (frame) frame.style.opacity = String(Math.max(0, 1 - pct * 2));
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ══════════════════════════════════
   SCROLL REVEAL
══════════════════════════════════ */
(function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ══════════════════════════════════
   COUNTDOWN TIMER
══════════════════════════════════ */
(function initCountdown() {
  const dE = document.getElementById('days');
  const hE = document.getElementById('hours');
  const mE = document.getElementById('minutes');
  const sE = document.getElementById('seconds');
  if (!dE) return;

  function pad(n, l = 2) { return String(n).padStart(l, '0'); }

  let prev = { d: -1, h: -1, m: -1, s: -1 };

  function update() {
    const diff = WEDDING - Date.now();
    if (diff <= 0) {
      dE.textContent = '000'; hE.textContent = '00';
      mE.textContent = '00'; sE.textContent = '00';
      return;
    }

    const d = Math.floor(diff / 864e5);
    const h = Math.floor((diff % 864e5) / 36e5);
    const m = Math.floor((diff % 36e5) / 6e4);
    const s = Math.floor((diff % 6e4) / 1e3);

    if (d !== prev.d) { dE.textContent = pad(d, 3); prev.d = d; }
    if (h !== prev.h) { hE.textContent = pad(h); prev.h = h; }
    if (m !== prev.m) { mE.textContent = pad(m); prev.m = m; }
    if (s !== prev.s) { sE.textContent = pad(s); prev.s = s; }
  }

  update();
  setInterval(update, 1000);
})();

/* ══════════════════════════════════
   COUNTDOWN — FLOATING PARTICLES
   (Desktop only — skip on mobile)
══════════════════════════════════ */
(function initCountdownParticles() {
  if (IS_MOBILE || PREFERS_REDUCED) return;

  const canvas = document.getElementById('countdownParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dots = [], animId = null, isVisible = false;

  function resize() {
    W = canvas.width = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  class Dot {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = 1 + Math.random() * 1.5;
      this.vy = -(0.1 + Math.random() * 0.2);
      this.vx = (Math.random() - 0.5) * 0.15;
      this.opacity = 0.1 + Math.random() * 0.25;
      this.gold = Math.random() > 0.5;
    }
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.gold ? '#C9B037' : '#D4A5A5';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 6.28);
      ctx.fill();
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.opacity -= 0.0004;
      if (this.y < -10 || this.opacity <= 0) this.reset(false);
    }
  }

  function init() {
    resize();
    dots = [];
    const count = Math.min(Math.floor(W / 25), 35);
    for (let i = 0; i < count; i++) dots.push(new Dot());
  }

  function loop() {
    if (!isVisible) { animId = null; return; }
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < dots.length; i++) { dots[i].update(); dots[i].draw(); }
    animId = requestAnimationFrame(loop);
  }

  const section = document.getElementById('countdown');
  const obs = new IntersectionObserver(([e]) => {
    isVisible = e.isIntersecting;
    if (isVisible && !animId) loop();
  }, { threshold: 0.05 });
  obs.observe(section);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 250);
  }, { passive: true });
  init();
})();

/* ══════════════════════════════════
   SAVE THE DATE — STARFIELD CANVAS
   (Desktop only — CSS fallback on mobile)
══════════════════════════════════ */
(function initSavedateCanvas() {
  if (IS_MOBILE || PREFERS_REDUCED) return;

  const canvas = document.getElementById('savedateCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], animId = null, isVisible = false;

  function resize() {
    W = canvas.width = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  class Star {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = 0.5 + Math.random() * 1.5;
      this.opacity = 0.1 + Math.random() * 0.4;
      this.phase = Math.random() * 6.28;
      this.speed = 0.008 + Math.random() * 0.02;
      this.gold = Math.random() < 0.35;
    }
    draw() {
      const o = this.opacity * (0.4 + 0.6 * Math.sin(this.phase));
      ctx.globalAlpha = o;
      ctx.fillStyle = this.gold ? '#C9B037' : '#FDE8E0';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, 6.28);
      ctx.fill();
    }
    update() { this.phase += this.speed; }
  }

  function init() {
    resize();
    stars = [];
    const count = Math.min(Math.floor(W * H / 5000), 80);
    for (let i = 0; i < count; i++) stars.push(new Star());
  }

  function loop() {
    if (!isVisible) { animId = null; return; }
    ctx.clearRect(0, 0, W, H);
    for (let i = 0; i < stars.length; i++) { stars[i].update(); stars[i].draw(); }
    animId = requestAnimationFrame(loop);
  }

  const section = document.getElementById('savedate');
  const obs = new IntersectionObserver(([e]) => {
    isVisible = e.isIntersecting;
    if (isVisible && !animId) loop();
  }, { threshold: 0.05 });
  obs.observe(section);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(init, 250);
  }, { passive: true });
  init();
})();

/* ══════════════════════════════════
   CURSOR GLOW (desktop only)
══════════════════════════════════ */
(function initCursorGlow() {
  if (IS_MOBILE) return;
  const glow = document.getElementById('cursorGlow');
  if (!glow) return;

  document.addEventListener('mousemove', e => {
    glow.style.transform = `translate3d(${e.clientX - 200}px, ${e.clientY - 200}px, 0)`;
    glow.style.opacity = '1';
  }, { passive: true });

  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
})();

/* ══════════════════════════════════
   MUSIC BUTTON (UI demo)
══════════════════════════════════ */
(function initMusic() {
  const btn = document.getElementById('musicToggle');
  if (!btn) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('playing');
    const isPlaying = btn.classList.contains('playing');
    btn.querySelector('i').className = isPlaying ? 'fas fa-pause' : 'fas fa-music';
  });
})();

/* ══════════════════════════════════
   SMOOTH ANCHOR SCROLL
══════════════════════════════════ */
(function initSmooth() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const el = document.querySelector(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ══════════════════════════════════
   CURSOR SPARKLE TRAIL (desktop only)
══════════════════════════════════ */
(function initSparkle() {
  if (IS_MOBILE) return;
  const colors = ['#C9B037', '#D4A5A5', '#9CAF88', '#FDE8E0'];

  document.addEventListener('mousemove', e => {
    if (Math.random() > 0.95) {
      const sp = document.createElement('div');
      const c = colors[Math.floor(Math.random() * colors.length)];
      const size = 3 + Math.random() * 3;
      sp.style.cssText = `position:fixed;pointer-events:none;z-index:9999;left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;border-radius:50%;background:${c};opacity:0.6;transition:all 0.6s ease-out;transform:translate(-50%,-50%) scale(1);`;
      document.body.appendChild(sp);
      requestAnimationFrame(() => {
        sp.style.transform = `translate(${(Math.random()-0.5)*40}px,${-20-Math.random()*20}px) scale(0)`;
        sp.style.opacity = '0';
      });
      setTimeout(() => sp.remove(), 650);
    }
  }, { passive: true });
})();
