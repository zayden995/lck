// The outline "LCK TECH" behind the page.
//
// During the hero, the hero's own copy shows (bottom right, in front of the glow and behind the 3D stand).
// When the hero lets go of the screen, this fixed copy takes over in exactly the same spot. As you scroll on,
// it drifts to the centre of the screen, grows (heroWord.grow) and dims behind the content (heroWord.fadeTo).
// It reaches the centre after heroWord.moveOver screen heights and stays there for the rest of the page.
// With reduced motion on, it stays in its corner.
//
// Two copies are needed because the hero stage keeps its own layers: one element cannot sit behind the
// 3D stand and also behind the sections further down.

import { heroWord } from '../data/hero.js';

const word = document.getElementById('scroll-word');
const stageWord = document.querySelector('.hero-word');
const stage = document.getElementById('hero-stage');
const track = document.getElementById('hero-track');
const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

if (word && stageWord && stage && track) {
  let G = null; // measured geometry
  const cur = { x: 0, y: 0, s: 1, o: 1 };
  let snapped = false;
  let running = false;

  function measure() {
    const W = stage.clientWidth;
    const Hs = stage.clientHeight;
    const Hv = window.innerHeight;
    const cs = getComputedStyle(stageWord);
    const ww = word.offsetWidth;
    const wh = word.offsetHeight;
    G = {
      Hv,
      // start: where the hero's copy sits when the hero lets go (the stage is then at the top of the screen)
      x0: W - (parseFloat(cs.right) || 0) - ww,
      y0: Hs - (parseFloat(cs.bottom) || 0) - wh,
      // end: the centre of the screen
      x1: (W - ww) / 2,
      y1: (Hv - wh) / 2,
      heroEnd: track.getBoundingClientRect().top + window.scrollY + track.offsetHeight - Hs,
    };
  }

  function target() {
    const y = window.scrollY;
    const t = clamp((y - G.heroEnd) / Math.max(1, G.Hv * heroWord.moveOver));
    const e = reduce ? 0 : t * t * (3 - 2 * t);
    const after = clamp((y - G.heroEnd) / (G.Hv * heroWord.fadeOver));
    return {
      inHero: y < G.heroEnd,
      x: G.x0 + (G.x1 - G.x0) * e,
      y: G.y0 + (G.y1 - G.y0) * e,
      s: 1 + (heroWord.grow - 1) * e,
      o: 1 - (1 - heroWord.fadeTo) * after,
    };
  }

  function frame() {
    if (!G) measure();
    const T = target();
    const k = reduce || !snapped ? 1 : 0.14;
    snapped = true;
    cur.x += (T.x - cur.x) * k;
    cur.y += (T.y - cur.y) * k;
    cur.s += (T.s - cur.s) * k;
    cur.o += (T.o - cur.o) * k;

    // hand back to the hero's own copy only once this one has settled back in the corner
    const home = Math.abs(cur.x - G.x0) < 0.5 && Math.abs(cur.y - G.y0) < 0.5 && Math.abs(cur.s - 1) < 0.002;
    const useStage = T.inHero && home;
    word.style.visibility = useStage ? 'hidden' : 'visible';
    stageWord.style.visibility = useStage ? 'visible' : 'hidden';
    word.style.transform = `translate3d(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px, 0) scale(${cur.s.toFixed(4)})`;
    word.style.opacity = cur.o.toFixed(3);

    const settled =
      Math.abs(T.x - cur.x) < 0.1 && Math.abs(T.y - cur.y) < 0.1 && Math.abs(T.s - cur.s) < 0.0005 && Math.abs(T.o - cur.o) < 0.002;
    if (settled) running = false;
    else requestAnimationFrame(frame);
  }

  function kick() {
    if (running) return;
    running = true;
    requestAnimationFrame(frame);
  }

  function remeasure() {
    G = null;
    kick();
  }

  window.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', remeasure);
  // the page grows as images load, and the word's width changes once the font arrives
  if ('ResizeObserver' in window) new ResizeObserver(remeasure).observe(document.body);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
  kick();
}
