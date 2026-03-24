/**
 * ═══════════════════════════════════════
 *  SOFIA & NIKITA — WEDDING INVITATION
 *  Cinematic JavaScript Engine
 * ═══════════════════════════════════════
 */
'use strict';

const WEDDING = new Date('2026-08-01T15:00:00');

/* ══════════════════════════════════
   LOADING SCREEN
══════════════════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('hidden');
    // Start hero entrance
    startHeroAnimations();
  }, 1800);
});

/* ══════════════════════════════════
   HERO — CANVAS PARTICLE SYSTEM
   Magical floating lights + petals
══════════════════════════════════ */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], animId;

  const PETAL_COLORS = [
    { r: 212, g: 165, b: 165 },  // rose
    { r: 253, g: 232, b: 224 },  // rose light
    { r: 201, g: 176, b: 55 },   // gold
    { r: 156, g: 175, b: 136 },  // sage
    { r: 200, g: 184, b: 212 },  // lavender
    { r: 255, g: 255, b: 240 },  // ivory
  ];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor(init) {
      this.reset(init);
    }
    reset(init) {
      this.x = init ? Math.random() * W : Math.random() * W;
      this.y = init ? Math.random() * H : -20;
      const c = PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)];
      this.color = c;

      // Decide type: 0=glow orb, 1=petal, 2=sparkle
      this.type = Math.random() < 0.35 ? 0 : (Math.random() < 0.6 ? 1 : 2);

      if (this.type === 0) {
        // Glow orb
        this.size = 30 + Math.random() * 60;
        this.opacity = 0.02 + Math.random() * 0.04;
        this.vy = 0.15 + Math.random() * 0.3;
        this.vx = (Math.random() - 0.5) * 0.2;
      } else if (this.type === 1) {
        // Petal
        this.size = 4 + Math.random() * 8;
        this.opacity = 0.15 + Math.random() * 0.35;
        this.vy = 0.4 + Math.random() * 0.9;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.rot = Math.random() * Math.PI * 2;
        this.rotV = (Math.random() - 0.5) * 0.03;
      } else {
        // Sparkle
        this.size = 1.5 + Math.random() * 2.5;
        this.opacity = 0.3 + Math.random() * 0.6;
        this.vy = 0.1 + Math.random() * 0.4;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.twinkle = Math.random() * Math.PI * 2;
      }

      this.wave = Math.random() * Math.PI * 2;
      this.waveAmp = 0.3 + Math.random() * 0.6;
    }

    draw() {
      const { r, g, b } = this.color;
      ctx.save();

      if (this.type === 0) {
        // Glow orb
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        grad.addColorStop(0, `rgba(${r},${g},${b},${this.opacity})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      } else if (this.type === 1) {
        // Petal
        ctx.globalAlpha = this.opacity;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size * 0.4, this.size, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Sparkle
        const twinkleOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.twinkle));
        ctx.globalAlpha = twinkleOpacity;
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        // Tiny cross rays
        ctx.strokeStyle = `rgba(${r},${g},${b},${twinkleOpacity * 0.5})`;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(this.x - this.size * 2, this.y);
        ctx.lineTo(this.x + this.size * 2, this.y);
        ctx.moveTo(this.x, this.y - this.size * 2);
        ctx.lineTo(this.x, this.y + this.size * 2);
        ctx.stroke();
      }

      ctx.restore();
    }

    update() {
      this.wave += 0.015;
      this.x += this.vx + Math.sin(this.wave) * this.waveAmp;
      this.y += this.vy;
      if (this.type === 1) this.rot += this.rotV;
      if (this.type === 2) this.twinkle += 0.05;
      if (this.y > H + 40 || this.x < -40 || this.x > W + 40) this.reset(false);
    }
  }

  function init() {
    resize();
    particles = [];
    const count = Math.min(Math.floor(W / 8), 120);
    for (let i = 0; i < count; i++) particles.push(new Particle(true));
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(loop);
  }

  // Perf: only run when hero visible
  const heroEl = document.getElementById('hero');
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!animId) loop(); }
    else { cancelAnimationFrame(animId); animId = null; }
  }, { threshold: 0.05 });
  obs.observe(heroEl);

  window.addEventListener('resize', init, { passive: true });
  init();
  loop();
})();

/* ══════════════════════════════════
   HERO — ENTRANCE ANIMATIONS
══════════════════════════════════ */
function startHeroAnimations() {
  const items = document.querySelectorAll('.hero__content .anim-item');
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 250);
  });
}

/* ══════════════════════════════════
   HERO — PARALLAX
══════════════════════════════════ */
(function initParallax() {
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
          content.style.transform = `translateY(${y * 0.35}px)`;
          content.style.opacity = String(Math.max(0, 1 - pct * 1.8));
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
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
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

  function animateTick(el) {
    el.classList.remove('tick');
    void el.offsetWidth;
    el.classList.add('tick');
  }

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

    if (d !== prev.d) { dE.textContent = pad(d, 3); animateTick(dE); prev.d = d; }
    if (h !== prev.h) { hE.textContent = pad(h); animateTick(hE); prev.h = h; }
    if (m !== prev.m) { mE.textContent = pad(m); animateTick(mE); prev.m = m; }
    if (s !== prev.s) { sE.textContent = pad(s); animateTick(sE); prev.s = s; }
  }

  update();
  setInterval(update, 1000);
})();

/* ══════════════════════════════════
   COUNTDOWN — FLOATING PARTICLES
══════════════════════════════════ */
(function initCountdownParticles() {
  const canvas = document.getElementById('countdownParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, dots = [], animId;

  function resize() {
    W = canvas.width = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  class Dot {
    constructor() { this.reset(true); }
    reset(init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 10;
      this.size = 1 + Math.random() * 2;
      this.vy = -(0.15 + Math.random() * 0.3);
      this.vx = (Math.random() - 0.5) * 0.2;
      this.opacity = 0.1 + Math.random() * 0.3;
      this.gold = Math.random() > 0.5;
    }
    draw() {
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.gold ? '#C9B037' : '#D4A5A5';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.opacity -= 0.0005;
      if (this.y < -10 || this.opacity <= 0) this.reset(false);
    }
  }

  function init() {
    resize();
    dots = [];
    const count = Math.min(Math.floor(W / 15), 60);
    for (let i = 0; i < count; i++) dots.push(new Dot());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    dots.forEach(d => { d.update(); d.draw(); });
    animId = requestAnimationFrame(loop);
  }

  const section = document.getElementById('countdown');
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!animId) loop(); }
    else { cancelAnimationFrame(animId); animId = null; }
  }, { threshold: 0.1 });
  obs.observe(section);

  window.addEventListener('resize', init, { passive: true });
  init();
})();

/* ══════════════════════════════════
   SAVE THE DATE — STARFIELD CANVAS
══════════════════════════════════ */
(function initSavedateCanvas() {
  const canvas = document.getElementById('savedateCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [], animId;

  function resize() {
    W = canvas.width = canvas.parentElement.offsetWidth;
    H = canvas.height = canvas.parentElement.offsetHeight;
  }

  class Star {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.size = 0.5 + Math.random() * 1.8;
      this.opacity = 0.1 + Math.random() * 0.5;
      this.phase = Math.random() * Math.PI * 2;
      this.speed = 0.01 + Math.random() * 0.03;
      this.gold = Math.random() < 0.35;
    }
    draw() {
      const o = this.opacity * (0.4 + 0.6 * Math.sin(this.phase));
      ctx.globalAlpha = o;
      ctx.fillStyle = this.gold ? '#C9B037' : '#FDE8E0';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    update() { this.phase += this.speed; }
  }

  function init() {
    resize();
    stars = [];
    const count = Math.min(Math.floor(W * H / 3000), 150);
    for (let i = 0; i < count; i++) stars.push(new Star());
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => { s.update(); s.draw(); });
    animId = requestAnimationFrame(loop);
  }

  const section = document.getElementById('savedate');
  const obs = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) { if (!animId) loop(); }
    else { cancelAnimationFrame(animId); animId = null; }
  }, { threshold: 0.1 });
  obs.observe(section);

  window.addEventListener('resize', init, { passive: true });
  init();
})();

/* ══════════════════════════════════
   CURSOR GLOW (desktop)
══════════════════════════════════ */
(function initCursorGlow() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(hover: none)').matches) return;

  let mx = -999, my = -999;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    glow.style.left = mx + 'px';
    glow.style.top = my + 'px';
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
   CURSOR SPARKLE TRAIL (desktop)
══════════════════════════════════ */
(function initSparkle() {
  if (window.matchMedia('(hover: none)').matches) return;
  const colors = ['#C9B037', '#D4A5A5', '#9CAF88', '#FDE8E0', '#C8B8D4'];

  document.addEventListener('mousemove', e => {
    if (Math.random() > 0.93) {
      const sp = document.createElement('div');
      const c = colors[Math.floor(Math.random() * colors.length)];
      const size = 3 + Math.random() * 4;
      sp.style.cssText = `
        position:fixed; pointer-events:none; z-index:9999;
        left:${e.clientX}px; top:${e.clientY}px;
        width:${size}px; height:${size}px; border-radius:50%;
        background:${c};
        transform:translate(-50%,-50%) scale(1);
        opacity:0.7;
        transition:all 0.7s cubic-bezier(0.16,1,0.3,1);
      `;
      document.body.appendChild(sp);
      requestAnimationFrame(() => {
        sp.style.transform = `translate(${(Math.random()-0.5)*50}px, ${-25-Math.random()*25}px) scale(0)`;
        sp.style.opacity = '0';
      });
      setTimeout(() => sp.remove(), 750);
    }
  });
})();
