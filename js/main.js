/* NPCAT! — the crowd
   Ten thousand NPC particles form the cat and morph through four scroll chapters.
   GSAP 3.15 (ScrollTrigger) from cdnjs; everything degrades to a static hero if it fails to load. */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  const $ = (s, c) => (c || document).querySelector(s);
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = matchMedia('(max-width: 760px)').matches;
  const hasGSAP = typeof gsap !== 'undefined';
  const hasST = hasGSAP && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  /* ---------- nav hides on scroll down ---------- */
  { let ly = scrollY; const nav = $('.nav'); addEventListener('scroll', () => { const y = scrollY; nav.classList.toggle('hide', y > ly && y > 140); ly = y; }, { passive: true }); }

  /* ---------- sound (off by default, one toggle) ---------- */
  let ac = null, soundOn = false; const sndBtn = $('#snd');
  function sting() {
    if (!soundOn) return;
    try {
      ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume();
      const t = ac.currentTime, o = ac.createOscillator(), g = ac.createGain();
      o.type = 'square'; o.frequency.setValueAtTime(987, t); o.frequency.setValueAtTime(1318, t + .06); o.frequency.setValueAtTime(1975, t + .12);
      g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.14, t + .01); g.gain.exponentialRampToValueAtTime(.0001, t + .4);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + .42);
    } catch (e) { /* no audio, no problem */ }
  }
  if (sndBtn) sndBtn.addEventListener('click', () => {
    soundOn = !soundOn; sndBtn.classList.toggle('on', soundOn); sndBtn.setAttribute('aria-pressed', String(soundOn));
    $('span', sndBtn).textContent = soundOn ? 'Sound on' : 'Sound off';
    if (soundOn) { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); ac.resume(); } catch (e) {} sting(); }
  });

  /* ---------- the crowd ---------- */
  const hero = $('.swarm'); const canvas = $('#crowd'); if (!canvas) return;
  const ctx = canvas.getContext('2d', { alpha: false });
  const DPR = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0;
  const N = isMobile ? 4200 : 10000;
  const PAL = ['#a1a1a1', '#2e2e2d', '#ffffff', '#ffc71a', '#6f6f6d'];
  const px = new Float32Array(N), py = new Float32Array(N), vx = new Float32Array(N), vy = new Float32Array(N);
  const tx = new Float32Array(N), ty = new Float32Array(N);
  const col = new Uint8Array(N), ncol = new Uint8Array(N), eye = new Uint8Array(N), neye = new Uint8Array(N);
  const seed = new Float32Array(N); for (let i = 0; i < N; i++) seed[i] = Math.random() * 6.283;
  const shapes = []; let chapter = 0, morphT = 1, geom = null, visible = true, running = false;
  const mouse = { x: -9999, y: -9999, vx: 0, vy: 0 }; const look = { x: 0, y: 0 };

  function resize() {
    W = canvas.clientWidth; H = canvas.clientHeight; canvas.width = W * DPR; canvas.height = H * DPR; ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    if (shapes.length) applyShape(chapter, true);
  }
  // sample a drawing into points (unit space, centred) with a colour class and an "is pupil" flag
  function sample(draw, step, eyes) {
    const S = 420; const oc = document.createElement('canvas'); oc.width = S; oc.height = S; const o = oc.getContext('2d');
    const fit = draw(o, S); const d = o.getImageData(0, 0, S, S).data; const pts = [];
    for (let y = 0; y < S; y += step) for (let x = 0; x < S; x += step) {
      const i = (y * S + x) * 4; if (d[i + 3] < 120) continue;
      const r = d[i], g = d[i + 1], b = d[i + 2]; let c = 0;
      if (r > 220 && g > 160 && b < 90) c = 3; else if (r > 225 && g > 225 && b > 225) c = 2; else if (r < 90) c = 1; else if (r < 140) c = 4; else c = 0;
      let e = 0;
      if (eyes && fit && c === 1) for (const ey of eyes) { const ex = fit.x0 + ey[0] * fit.w, eyy = fit.y0 + ey[1] * fit.h, rx = ey[2] * fit.w, ry = ey[3] * fit.h; const dx = (x - ex) / rx, dy = (y - eyy) / ry; if (dx * dx + dy * dy <= 1) e = 1; }
      pts.push({ x: (x + step * .5 * Math.random()) / S - .5, y: (y + step * .5 * Math.random()) / S - .5, c, e });
    }
    if (pts.length > N) { for (let i = pts.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; const t = pts[i]; pts[i] = pts[j]; pts[j] = t; } pts.length = N; }
    pts.sort((a, b) => Math.atan2(a.y, a.x) - Math.atan2(b.y, b.x)); // swirling morphs
    return pts;
  }
  function applyShape(k, instant) {
    const pts = shapes[k]; if (!pts) return;
    const scale = Math.min(W, H) * (isMobile ? .78 : .72); const cx = W * .5, cy = H * .5;
    const off = Math.floor(Math.random() * pts.length);
    for (let i = 0; i < N; i++) {
      const p = pts[(Math.floor(i * pts.length / N) + off) % pts.length];
      tx[i] = cx + p.x * scale; ty[i] = cy + p.y * scale; ncol[i] = p.c; neye[i] = p.e;
      if (instant) { px[i] = tx[i]; py[i] = ty[i]; col[i] = p.c; eye[i] = p.e; }
    }
    morphT = instant ? 1 : 0;
    const fh = .96 * scale; geom = { cx, cy, eyeY: cy - fh / 2 + fh * (242 / 760) };
  }

  const imgCat = new Image(), imgBang = new Image();
  imgCat.src = 'assets/img/cat.png'; imgBang.src = 'assets/img/bang.png';
  Promise.all([imgCat.decode(), imgBang.decode()])
    .then(() => document.fonts.load('800 96px "Unbounded"').catch(() => {}))
    .then(() => document.fonts.load('500 24px "Geist Mono"').catch(() => {}))
    .then(build).catch(() => { document.documentElement.classList.remove('js'); });

  function build() {
    const fit = (o, S, img, frac) => { const r = img.naturalWidth / img.naturalHeight; let w = S * frac, h = w / r; if (h > S * frac) { h = S * frac; w = h * r; } const x0 = (S - w) / 2, y0 = (S - h) / 2; o.drawImage(img, x0, y0, w, h); return { x0, y0, w, h }; };
    shapes[0] = sample((o, S) => fit(o, S, imgCat, .96), isMobile ? 4 : 3, [[240 / 690, 242 / 760, 31.5 / 690, 46.5 / 760], [450 / 690, 242 / 760, 31.5 / 690, 46.5 / 760]]);
    shapes[1] = sample((o, S) => fit(o, S, imgBang, .9), isMobile ? 3 : 2);
    shapes[2] = sample((o, S) => {
      o.textAlign = 'center'; o.textBaseline = 'middle';
      o.font = '800 96px "Unbounded", Impact, sans-serif'; const w = o.measureText('NPCAT').width; const x = S / 2 - 22;
      o.fillStyle = '#efeee9'; o.fillText('NPCAT', x, S / 2 - 22);
      o.fillStyle = '#ffc71a'; o.strokeStyle = '#ffc71a'; o.lineWidth = 10; o.lineJoin = 'round'; o.font = '800 112px "Unbounded", Impact, sans-serif'; o.strokeText('!', x + w / 2 + 34, S / 2 - 26); o.fillText('!', x + w / 2 + 34, S / 2 - 26);
      o.fillStyle = '#a1a1a1'; o.font = '500 24px "Geist Mono", monospace'; o.fillText('PAIRED WITH $NPC', S / 2, S / 2 + 58);
    }, isMobile ? 3 : 2);
    shapes[3] = sample((o, S) => { o.fillStyle = '#ffffff'; const s = S * .8, x = S / 2, y = S / 2 + s * .06; o.beginPath(); o.moveTo(x, y + s * .4); o.bezierCurveTo(x - s * .55, y, x - s * .55, y - s * .5, x, y - s * .28); o.bezierCurveTo(x + s * .55, y - s * .5, x + s * .55, y, x, y + s * .4); o.fill(); }, isMobile ? 4 : 3);
    resize(); applyShape(0, true); if (!running) { running = true; requestAnimationFrame(frame); }
  }
  addEventListener('resize', resize);

  /* ---------- input ---------- */
  const rect = () => canvas.getBoundingClientRect();
  addEventListener('pointermove', e => {
    const r = rect(); const nx = e.clientX - r.left, ny = e.clientY - r.top;
    mouse.vx = nx - mouse.x; mouse.vy = ny - mouse.y; mouse.x = nx; mouse.y = ny;
    if (geom && !reduce) { const dx = nx - geom.cx, dy = ny - geom.eyeY; const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 260); look.x = dx / d * 10 * k; look.y = dy / d * 7 * k; }
  });
  addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; });
  canvas.addEventListener('pointerdown', e => { const r = rect(); burst(e.clientX - r.left, e.clientY - r.top); sting(); const h = $('.hint'); if (h) h.style.opacity = 0; });
  function burst(x, y) { for (let i = 0; i < N; i++) { const dx = px[i] - x, dy = py[i] - y; const d2 = dx * dx + dy * dy; if (d2 < 260 * 260) { const d = Math.sqrt(d2) + 1; const f = (1 - d / 260) * 28; vx[i] += dx / d * f; vy[i] += dy / d * f; } } }

  /* ---------- frame loop (pauses off-screen) ---------- */
  const countEl = $('#count'); let shown = 0, last = performance.now();
  const R = isMobile ? 70 : 110, R2 = R * R;
  if ('IntersectionObserver' in window) new IntersectionObserver(en => { visible = en[0].isIntersecting; }).observe(hero);
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || document.hidden) { last = now; return; }
    const dt = Math.min(2, (now - last) / 16.7); last = now;
    morphT = Math.min(1, morphT + .012 * dt);
    const t = now * .001, jit = reduce ? 0 : 1;
    ctx.fillStyle = '#131312'; ctx.fillRect(0, 0, W, H);
    const mx = mouse.x, my = mouse.y;
    const k = (0.055 + 0.06 * morphT) * dt, damp = Math.pow(0.86, dt);
    for (let c = 0; c < PAL.length; c++) {
      ctx.fillStyle = PAL[c]; ctx.beginPath();
      for (let i = 0; i < N; i++) {
        if (c === 0) { // physics once per particle, on the first colour pass
          const s = seed[i];
          let ttx = tx[i] + Math.sin(t * 1.3 + s) * 1.2 * jit, tty = ty[i] + Math.cos(t * 1.1 + s * 1.7) * 1.2 * jit;
          if (eye[i]) { ttx += look.x; tty += look.y; }
          vx[i] += (ttx - px[i]) * k; vy[i] += (tty - py[i]) * k;
          const dx = px[i] - mx, dy = py[i] - my; const d2 = dx * dx + dy * dy;
          if (d2 < R2) { const d = Math.sqrt(d2) + .01; const f = (1 - d / R) * 3.2 * dt; vx[i] += dx / d * f + mouse.vx * .02 * (1 - d / R); vy[i] += dy / d * f + mouse.vy * .02 * (1 - d / R); }
          vx[i] *= damp; vy[i] *= damp; px[i] += vx[i] * dt; py[i] += vy[i] * dt;
          if (morphT > .5) { col[i] = ncol[i]; eye[i] = neye[i]; }
        }
        if (col[i] !== c) continue;
        const sz = c === 1 ? 2.2 : 2.6; ctx.rect(px[i], py[i], sz, sz);
      }
      ctx.fill();
    }
    mouse.vx *= .8; mouse.vy *= .8;
    if (shown < N && countEl) { shown = Math.min(N, shown + Math.ceil(N / 90)); countEl.textContent = shown.toLocaleString('en-US'); }
  }

  /* ---------- chapters (pinned scroll) ---------- */
  const chs = Array.from(document.querySelectorAll('.ch')); const chn = $('#chn'); const bar = $('#bar');
  function setChapter(k) {
    if (k === chapter) return; chapter = k; applyShape(k, false);
    chs.forEach(c => c.classList.toggle('on', +c.dataset.ch === k)); if (chn) chn.textContent = String(k + 1).padStart(2, '0');
  }
  if (hasST) {
    ScrollTrigger.create({ trigger: '.swarm', start: 'top top', end: '+=300%', pin: true, scrub: true, onUpdate: st => { const p = st.progress; if (bar) bar.style.width = (p * 100) + '%'; setChapter(Math.min(3, Math.floor(p * 4 + 0.0001))); } });
    let lastY = scrollY; addEventListener('scroll', () => { const v = scrollY - lastY; lastY = scrollY; if (Math.abs(v) > 60 && !reduce) for (let i = 0; i < N; i += 3) vy[i] -= v * .05 * Math.random(); }, { passive: true });
    gsap.utils.toArray('.block').forEach(sec => gsap.from(sec.querySelectorAll('.label, .t, .lead, .npc, .pairviz, .fact, .step, .community > *'), { y: 26, opacity: 0, duration: .8, ease: 'power3.out', stagger: .05, scrollTrigger: { trigger: sec, start: 'top 75%' } }));
  }

  /* ---------- copy buttons (contract address etc.) ---------- */
  document.querySelectorAll('[data-copy]').forEach(btn => btn.addEventListener('click', () => {
    const v = btn.getAttribute('data-copy'); if (!v || v === 'TBA') return;
    navigator.clipboard && navigator.clipboard.writeText(v).then(() => { const o = btn.textContent; btn.textContent = 'Copied'; setTimeout(() => { btn.textContent = o; }, 1400); });
  }));
})();
