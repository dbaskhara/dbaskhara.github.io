import './style.css';

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* --------------------------------------------------------------------------
   Intro: let the HUD draw in, then reveal the content
   -------------------------------------------------------------------------- */
const startIntro = () => document.body.classList.remove('is-loading');
requestAnimationFrame(() => requestAnimationFrame(startIntro));
// Animation frames pause in background tabs; make sure the content still appears.
setTimeout(startIntro, 120);

/* --------------------------------------------------------------------------
   Live clock in the top bar (visitor's local time)
   -------------------------------------------------------------------------- */
const clock = document.getElementById('clock');
const tick = () => {
  clock.textContent = new Date().toLocaleTimeString('en-GB', { hour12: false });
};
tick();
setInterval(tick, 1000);

/* --------------------------------------------------------------------------
   Section counter in the bottom bar
   -------------------------------------------------------------------------- */
const indexEl = document.getElementById('section-index');
const sections = [...document.querySelectorAll('[data-index]')];
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) indexEl.textContent = entry.target.dataset.index;
    });
  },
  { rootMargin: '-45% 0px -45% 0px' }
);
sections.forEach((s) => sectionObserver.observe(s));

/* --------------------------------------------------------------------------
   Statement paragraphs dim as they move away from the reading line
   -------------------------------------------------------------------------- */
const paragraphs = [...document.querySelectorAll('.statement p')];
const dimParagraphs = () => {
  const vh = window.innerHeight;
  const focus = vh * 0.45;
  paragraphs.forEach((p) => {
    const r = p.getBoundingClientRect();
    const center = r.top + r.height / 2;
    const distance = Math.max(0, Math.abs(center - focus) - r.height / 2);
    const opacity = 1 - Math.min(distance / (vh * 0.35), 1) * 0.45;
    p.style.opacity = opacity.toFixed(3);
  });
};

if (!reduceMotion) {
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      dimParagraphs();
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  dimParagraphs();
}

/* --------------------------------------------------------------------------
   Typewriter for role sub-lines when they enter the viewport
   -------------------------------------------------------------------------- */
const typeTargets = [...document.querySelectorAll('.type')];
const typeOut = (el) => {
  const text = el.dataset.text;
  el.setAttribute('aria-label', text);
  el.textContent = '';
  el.classList.add('typing');
  let i = 0;
  const step = () => {
    el.textContent = text.slice(0, ++i);
    if (i < text.length) {
      setTimeout(step, 22 + Math.random() * 30);
    } else {
      setTimeout(() => el.classList.remove('typing'), 900);
    }
  };
  step();
};

if (!reduceMotion) {
  typeTargets.forEach((el) => {
    el.textContent = '';
  });
  const typeObserver = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          typeOut(entry.target);
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  typeTargets.forEach((el) => typeObserver.observe(el));
}

/* --------------------------------------------------------------------------
   Seeded random helper
   -------------------------------------------------------------------------- */
const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const COLORS = {
  rust: '200, 74, 45',
  green: '107, 142, 101',
  white: '255, 255, 255',
};

/* --------------------------------------------------------------------------
   Drifting glyph field behind everything
   -------------------------------------------------------------------------- */
const field = document.querySelector('.glyph-field');
const fctx = field.getContext('2d');
const GLYPHS = ['∆', '◊', '○', '·', '+', '×', '·', '·'];
let glyphs = [];
let fieldW = 0;
let fieldH = 0;
const mouse = { x: -9999, y: -9999 };

const buildField = () => {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  fieldW = window.innerWidth;
  fieldH = window.innerHeight;
  field.width = fieldW * dpr;
  field.height = fieldH * dpr;
  fctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const rand = mulberry32(7);
  const count = Math.round((fieldW * fieldH) / 26000);
  glyphs = Array.from({ length: count }, () => {
    const roll = rand();
    return {
      x: rand() * fieldW,
      y: rand() * fieldH,
      z: 0.3 + rand() * 0.7,
      g: GLYPHS[Math.floor(rand() * GLYPHS.length)],
      vx: (rand() - 0.5) * 0.08,
      vy: (rand() - 0.5) * 0.08,
      ox: 0,
      oy: 0,
      color: roll > 0.92 ? COLORS.green : roll > 0.88 ? COLORS.rust : COLORS.white,
      phase: rand() * Math.PI * 2,
    };
  });
};

const drawField = (time = 0) => {
  fctx.clearRect(0, 0, fieldW, fieldH);
  const scroll = window.scrollY;
  fctx.textAlign = 'center';
  fctx.textBaseline = 'middle';

  glyphs.forEach((p) => {
    if (!reduceMotion) {
      p.x += p.vx;
      p.y += p.vy;
    }
    // Depth-based parallax, wrapped to the viewport
    let y = (p.y - scroll * p.z * 0.25) % fieldH;
    if (y < 0) y += fieldH;
    let x = ((p.x % fieldW) + fieldW) % fieldW;

    // Ease away from the cursor
    const dx = x - mouse.x;
    const dy = y - mouse.y;
    const d2 = dx * dx + dy * dy;
    const radius = 110;
    if (d2 < radius * radius && !reduceMotion) {
      const d = Math.sqrt(d2) || 1;
      const push = (1 - d / radius) * 18;
      p.ox += ((dx / d) * push - p.ox) * 0.12;
      p.oy += ((dy / d) * push - p.oy) * 0.12;
    } else {
      p.ox *= 0.94;
      p.oy *= 0.94;
    }

    const flicker = reduceMotion ? 1 : 0.75 + 0.25 * Math.sin(time * 0.001 + p.phase);
    const alpha = (0.12 + p.z * 0.28) * flicker;
    fctx.font = `${Math.round(7 + p.z * 7)}px "Geist Mono", monospace`;
    fctx.fillStyle = `rgba(${p.color}, ${alpha.toFixed(3)})`;
    fctx.fillText(p.g, x + p.ox, y + p.oy);
  });
};

let rafId = null;
const loop = (t) => {
  drawField(t);
  rafId = requestAnimationFrame(loop);
};

buildField();
if (reduceMotion) {
  drawField();
  window.addEventListener('scroll', () => drawField(), { passive: true });
} else {
  rafId = requestAnimationFrame(loop);
  window.addEventListener('pointermove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('pointerleave', () => {
    mouse.x = mouse.y = -9999;
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      rafId = requestAnimationFrame(loop);
    }
  });
}
window.addEventListener('resize', () => {
  buildField();
  if (reduceMotion) drawField();
});

/* --------------------------------------------------------------------------
   Generative artwork for each artifact tile
   -------------------------------------------------------------------------- */
const PAINTERS = {
  grid(ctx, w, h, rand) {
    const step = Math.max(14, w / 32);
    for (let y = step / 2; y < h; y += step) {
      for (let x = step / 2; x < w; x += step) {
        const hot = rand() > 0.93;
        const r = hot ? 2.2 : 1;
        ctx.fillStyle = hot ? `rgba(${COLORS.rust}, 0.9)` : `rgba(${COLORS.white}, ${0.08 + rand() * 0.18})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // A few panels, like a dashboard layout
    ctx.strokeStyle = `rgba(${COLORS.green}, 0.55)`;
    ctx.lineWidth = 1;
    ctx.strokeRect(w * 0.08, h * 0.12, w * 0.22, h * 0.6);
    ctx.strokeRect(w * 0.34, h * 0.12, w * 0.58, h * 0.28);
    ctx.strokeRect(w * 0.34, h * 0.44, w * 0.28, h * 0.28);
  },

  rings(ctx, w, h, rand) {
    const cx = w * (0.55 + rand() * 0.2);
    const cy = h * (0.35 + rand() * 0.15);
    const max = Math.hypot(w, h);
    for (let r = 12, i = 0; r < max; r += 10 + i * 1.6, i++) {
      ctx.strokeStyle = i % 7 === 3 ? `rgba(${COLORS.rust}, 0.8)` : `rgba(${COLORS.white}, ${0.05 + (i % 3) * 0.05})`;
      ctx.lineWidth = i % 7 === 3 ? 1.5 : 1;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = `rgba(${COLORS.green}, 0.9)`;
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fill();
  },

  scan(ctx, w, h, rand) {
    const words = ['channel', 'url', 'focus', 'push_back', 'getline', 'string', 'vector', 'ifstream', '//', 'cout'];
    const size = Math.max(10, w / 46);
    ctx.font = `${size}px "Geist Mono", monospace`;
    for (let y = size * 1.6; y < h; y += size * 1.7) {
      let x = size + (rand() * 4 | 0) * size * 1.2;
      while (x < w) {
        const word = words[(rand() * words.length) | 0];
        const hot = rand() > 0.94;
        ctx.fillStyle = hot ? `rgba(${COLORS.rust}, 0.9)` : `rgba(${COLORS.white}, ${0.06 + rand() * 0.16})`;
        ctx.fillText(word, x, y);
        x += ctx.measureText(word).width + size * (1 + rand() * 2);
      }
    }
    ctx.fillStyle = `rgba(${COLORS.green}, 0.18)`;
    ctx.fillRect(0, h * 0.42, w, size * 1.7);
  },

  bars(ctx, w, h, rand) {
    const n = 28;
    const bw = w / n;
    for (let i = 0; i < n; i++) {
      const bh = h * (0.15 + rand() * 0.6);
      const hot = rand() > 0.88;
      ctx.fillStyle = hot ? `rgba(${COLORS.rust}, 0.85)` : `rgba(${COLORS.white}, ${0.06 + rand() * 0.12})`;
      ctx.fillRect(i * bw + bw * 0.2, h - bh, bw * 0.6, bh);
    }
    ctx.strokeStyle = `rgba(${COLORS.green}, 0.7)`;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.3);
    ctx.lineTo(w, h * 0.3);
    ctx.stroke();
  },

  wave(ctx, w, h, rand) {
    const lines = 26;
    for (let l = 0; l < lines; l++) {
      const yBase = (h / lines) * l + h / lines / 2;
      const amp = 6 + rand() * 18;
      const freq = 0.01 + rand() * 0.02;
      const phase = rand() * 10;
      const hot = l % 9 === 4;
      ctx.strokeStyle = hot ? `rgba(${COLORS.rust}, 0.85)` : `rgba(${COLORS.white}, ${0.06 + rand() * 0.14})`;
      ctx.lineWidth = hot ? 1.5 : 1;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 4) {
        const y = yBase + Math.sin(x * freq + phase) * amp * Math.sin((x / w) * Math.PI);
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  },

  orbit(ctx, w, h, rand) {
    const cx = w * 0.62;
    const cy = h * 0.42;
    for (let i = 0; i < 9; i++) {
      const rx = 40 + i * (w / 18);
      const ry = rx * (0.35 + rand() * 0.1);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(-0.35 + rand() * 0.1);
      ctx.setLineDash([2, 6]);
      ctx.strokeStyle = `rgba(${COLORS.white}, ${0.1 + (i % 2) * 0.08})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
      const a = rand() * Math.PI * 2;
      ctx.setLineDash([]);
      ctx.fillStyle = i % 3 === 0 ? `rgba(${COLORS.rust}, 0.9)` : `rgba(${COLORS.green}, 0.85)`;
      ctx.beginPath();
      ctx.arc(Math.cos(a) * rx, Math.sin(a) * ry, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  },
};

const paintArtifact = (canvas) => {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const w = rect.width;
  const h = rect.height;
  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, '#16100f');
  bg.addColorStop(1, '#0d0a0b');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  const painter = PAINTERS[canvas.dataset.kind] || PAINTERS.grid;
  painter(ctx, w, h, mulberry32(Number(canvas.dataset.seed) || 1));

  // Darken the lower-left so the title stays readable
  const shade = ctx.createLinearGradient(0, h, 0, h * 0.4);
  shade.addColorStop(0, 'rgba(11, 8, 9, 0.85)');
  shade.addColorStop(1, 'rgba(11, 8, 9, 0)');
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, w, h);
};

const artCanvases = [...document.querySelectorAll('.artifact-art')];
const repaintAll = () => artCanvases.forEach(paintArtifact);
const resizeObserver = new ResizeObserver((entries) => entries.forEach((e) => paintArtifact(e.target)));
artCanvases.forEach((c) => resizeObserver.observe(c));
// Repaint once the mono font is ready so code text in the art uses it
document.fonts?.ready.then(repaintAll);
