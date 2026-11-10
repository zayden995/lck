// Hero: loads the stand (STL), splits it into six parts, and drives a scroll-linked anime.js timeline.
// The parts burst out in their own directions, the base plate spins, labels follow each part, then it all merges back.
//
// Debug hook: setting window.__force = { p: 0..1 } before this script runs freezes the scroll progress.

import * as THREE from 'three';
import { createTimeline, animate, stagger } from 'animejs';
import { heroLabels, heroOffsets } from '../data/hero.js';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const STL_URL = `${BASE}/model/LCK_QR_stand.stl`;
const PHOTO_URL = `${BASE}/model/preview_front.png`;

const hero = document.getElementById('hero');
const stage = document.getElementById('hero-stage');
const track = document.getElementById('hero-track');
const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const FORCE = window.__force || null;
const KEYS = ['plate', 'foot', 'url', 'uen', 'logo', 'qr'];
const SIDE = Object.fromEntries(heroLabels.map((l) => [l.key, l.side]));
const TAU = Math.PI * 2;

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

/* ---------- reading the model ---------- */

function parseSTL(buf) {
  const dv = new DataView(buf);
  const n = dv.getUint32(80, true);
  const pos = new Float32Array(n * 9);
  for (let i = 0; i < n; i++) {
    const o = 84 + i * 50 + 12; // skip the 12-byte normal
    for (let k = 0; k < 9; k++) pos[i * 9 + k] = dv.getFloat32(o + k * 4, true);
  }
  return pos;
}

// Where the plate sits inside the front-view photo (the photo has a flat grey background).
function plateBounds(img) {
  const c = document.createElement('canvas');
  c.width = img.naturalWidth;
  c.height = img.naturalHeight;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  const d = g.getImageData(0, 0, c.width, c.height).data;
  let x0 = c.width, y0 = c.height, x1 = 0, y1 = 0;
  for (let y = 0; y < c.height; y++) {
    for (let x = 0; x < c.width; x++) {
      const o = (y * c.width + x) * 4;
      if (Math.abs(d[o] - 208) > 14 || Math.abs(d[o + 1] - 208) > 14 || Math.abs(d[o + 2] - 208) > 14) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { x0, y0, x1: x1 + 1, y1: y1 + 1, w: c.width, h: c.height };
}

// Split the STL into: foot, plate (base + frame), and four print layers (logo, UEN, QR, web address).
// Colours come from the front-view photo, mapped onto each face by position.
function buildAssets(pos, img) {
  const n = pos.length / 9;
  const b = plateBounds(img);

  let pxMin = 1e9, pxMax = -1e9, pyMin = 1e9, pyMax = -1e9;
  for (let i = 0; i < n; i++) {
    if ((pos[i * 9 + 1] + pos[i * 9 + 4] + pos[i * 9 + 7]) / 3 < -30) continue; // the foot sits below y = -30
    for (let v = 0; v < 3; v++) {
      const X = pos[i * 9 + v * 3], Y = pos[i * 9 + v * 3 + 1];
      if (X < pxMin) pxMin = X;
      if (X > pxMax) pxMax = X;
      if (Y < pyMin) pyMin = Y;
      if (Y > pyMax) pyMax = Y;
    }
  }
  const W = pxMax - pxMin, H = pyMax - pyMin;
  const edge = (x, y) => Math.min(x - pxMin, pxMax - x, y - pyMin, pyMax - y);
  const toUV = (x, y) => {
    const px = b.x0 + ((x - pxMin) / W) * (b.x1 - b.x0);
    const py = b.y0 + ((pyMax - y) / H) * (b.y1 - b.y0);
    return [px / b.w, 1 - py / b.h];
  };

  const G = {};
  const bucket = (name, textured) => G[name] || (G[name] = { p: [], uv: textured ? [] : null });
  const maskTris = []; // print-layer triangles in photo space, painted out of the plate's colour map

  for (let t = 0; t < n; t++) {
    const o = t * 9;
    const ax = pos[o], ay = pos[o + 1], az = pos[o + 2];
    const bx = pos[o + 3], by = pos[o + 4], bz = pos[o + 5];
    const cx = pos[o + 6], cy = pos[o + 7], cz = pos[o + 8];
    const cenY = (ay + by + cy) / 3;

    if (cenY < -30) {
      // foot: flipped so its slot opens upward, centred on the plate, 11 mm tall
      bucket('foot', false).p.push(ax - 45, 11 - az, ay + 58, bx - 45, 11 - bz, by + 58, cx - 45, 11 - cz, cy + 58);
      continue;
    }

    const ux = bx - ax, uy = by - ay, uz = bz - az, vx = cx - ax, vy = cy - ay, vz = cz - az;
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz;
    let nz = ux * vy - uy * vx;
    const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
    nz /= len;

    const minZ = Math.min(az, bz, cz), maxZ = Math.max(az, bz, cz);
    const raised = minZ >= 2.99 && maxZ > 3.7; // the 0.8 mm print layer
    const ring = raised && edge(ax, ay) < 7 && edge(bx, by) < 7 && edge(cx, cy) < 7; // the amber frame stays with the plate

    let name, textured = true;
    if (raised && !ring) {
      const mmTop = pyMax - cenY; // distance from the top edge of the plate
      name = mmTop < 35.1 ? 'logo' : mmTop < 43 ? 'uen' : mmTop < 97 ? 'qr' : 'url';
      if (nz > 0.5) maskTris.push([toUV(ax, ay), toUV(bx, by), toUV(cx, cy)]);
    } else if (raised || nz > 0.5) {
      name = 'plateFront';
    } else {
      name = 'plateRest';
      textured = false;
    }

    const bk = bucket(name, textured);
    const tri = [ax, ay, az, bx, by, bz, cx, cy, cz];
    for (let k = 0; k < 3; k++) {
      const x = tri[k * 3], y = tri[k * 3 + 1], z = tri[k * 3 + 2];
      bk.p.push(x - 45, 8 + y, z - 1.9);
      if (textured) bk.uv.push(...toUV(x, y));
    }
  }

  // The plate's colour map: the photo with the print layer painted out, so the plate is blank once the print lifts off.
  const sc = document.createElement('canvas');
  sc.width = b.w;
  sc.height = b.h;
  const sg = sc.getContext('2d');
  sg.drawImage(img, 0, 0);
  const sp = sg.getImageData(Math.round(b.x0 + (b.x1 - b.x0) * 0.13), Math.round(b.y0 + (b.y1 - b.y0) * 0.5), 1, 1).data;
  const fill = `rgb(${sp[0]},${sp[1]},${sp[2]})`;
  sg.fillStyle = fill;
  sg.strokeStyle = fill;
  sg.lineWidth = 4;
  sg.lineJoin = 'round';
  for (const T of maskTris) {
    sg.beginPath();
    sg.moveTo(T[0][0] * b.w, (1 - T[0][1]) * b.h);
    sg.lineTo(T[1][0] * b.w, (1 - T[1][1]) * b.h);
    sg.lineTo(T[2][0] * b.w, (1 - T[2][1]) * b.h);
    sg.closePath();
    sg.fill();
    sg.stroke();
  }

  const tex = (src) => {
    const t = new THREE.Texture(src);
    t.encoding = THREE.sRGBEncoding;
    t.anisotropy = 8;
    t.needsUpdate = true;
    return t;
  };
  const geo = (bk) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(bk.p), 3));
    if (bk.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(bk.uv), 2));
    g.computeVertexNormals();
    g.computeBoundingBox();
    return g;
  };

  const art = new THREE.MeshStandardMaterial({ map: tex(img), roughness: 0.42, metalness: 0, side: THREE.DoubleSide });
  const base = new THREE.MeshStandardMaterial({ map: tex(sc), roughness: 0.42, metalness: 0 });
  const amber = new THREE.MeshStandardMaterial({ color: 0xf2a024, roughness: 0.5, metalness: 0 });

  const parts = {
    plate: [[geo(G.plateFront), base], [geo(G.plateRest), amber]],
    foot: [[geo(G.foot), amber]],
    logo: [[geo(G.logo), art]],
    uen: [[geo(G.uen), art]],
    qr: [[geo(G.qr), art]],
    url: [[geo(G.url), art]],
  };

  // Label anchors in model millimetres: the left and right edge of each part, at its vertical centre.
  const anchors = {};
  for (const k of KEYS) {
    const box = new THREE.Box3();
    parts[k].forEach((pr) => box.union(pr[0].boundingBox));
    const cyy = (box.min.y + box.max.y) / 2;
    anchors[k] = { r: new THREE.Vector3(box.max.x, cyy, box.max.z), l: new THREE.Vector3(box.min.x, cyy, box.max.z) };
  }
  anchors.plate = { l: new THREE.Vector3(0, 128, 0), r: new THREE.Vector3(0, 128, 0) }; // top centre: stays put while the plate spins
  anchors.plateN = { l: new THREE.Vector3(0, 40, 0), r: new THREE.Vector3(0, 40, 0) }; // phones: lower, clear of the logo label
  return { parts, anchors };
}

/* ---------- scene ---------- */

const S = { ready: false, sp: 0, groups: {}, state: { rot: 0.15 }, plate: { r: 0 }, e: {} };
const labels = {};
stage.querySelectorAll('.lbl').forEach((el) => {
  labels[el.dataset.k] = { el, line: el.querySelector('i') };
});
let assets;

function fallback() {
  hero.classList.add('no3d');
  if (!stage.querySelector('.hero-fallback')) {
    const im = document.createElement('img');
    im.className = 'hero-fallback';
    im.alt = 'The LCK Tech QR payment stand';
    im.src = PHOTO_URL;
    stage.appendChild(im);
  }
}

function initScene() {
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  stage.appendChild(canvas);
  try {
    S.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) {
    canvas.remove();
    fallback();
    return;
  }
  S.renderer.outputEncoding = THREE.sRGBEncoding;
  S.renderer.setClearColor(0x000000, 0);
  S.scene = new THREE.Scene();
  S.camera = new THREE.PerspectiveCamera(28, 1, 0.1, 60);
  S.scene.add(new THREE.AmbientLight(0xffffff, 0.32));
  const key = new THREE.DirectionalLight(0xfff4e6, 0.85);
  key.position.set(-2, 3, 4);
  S.scene.add(key);
  const fill = new THREE.DirectionalLight(0xffd2b0, 0.28);
  fill.position.set(3, 0.5, 2);
  S.scene.add(fill);
  const rim = new THREE.PointLight(0xff4d14, 1.1, 12);
  rim.position.set(2, 1, -2.4);
  S.scene.add(rim);
  const rim2 = new THREE.PointLight(0xf3f0ea, 0.6, 12);
  rim2.position.set(-2.4, -1, -2);
  S.scene.add(rim2);

  S.pivot = new THREE.Group();
  S.inner = new THREE.Group();
  S.inner.scale.setScalar(0.01); // millimetres to scene units
  S.inner.position.y = -0.64;
  S.pivot.add(S.inner);
  S.scene.add(S.pivot);

  for (const k of KEYS) {
    const g = new THREE.Group();
    assets.parts[k].forEach((pr) => g.add(new THREE.Mesh(pr[0], pr[1])));
    S.inner.add(g);
    S.groups[k] = g;
    S.e[k] = { e: 0 };
  }
  buildTimeline();
  S.ready = true;
  resize();
}

// One scroll-linked timeline: parts burst out in a stagger, the plate spins, hold, then merge back.
function buildTimeline() {
  const tl = createTimeline({ autoplay: false, defaults: { ease: 'inOutCubic' } });
  // the whole stand only drifts a little; the base plate does the spinning
  tl.add(S.state, { rot: 0.3, duration: 2300, ease: 'inOutSine' }, 0);
  tl.add(S.state, { rot: 0.15, duration: 1600, ease: 'inOutSine' }, 2300);
  // each part bursts out its own way in a stagger
  const order = ['foot', 'url', 'uen', 'logo', 'qr'];
  order.forEach((k, i) => tl.add(S.e[k], { e: 1, duration: 1100, ease: 'outCubic' }, 450 + i * 110));
  // once the foot has dropped away and the print layers are clear of it, the plate turns a full circle
  tl.add(S.plate, { r: TAU, duration: 1700, ease: 'inOutSine' }, 1000);
  // merge back in reverse order
  order.slice().reverse().forEach((k, i) => tl.add(S.e[k], { e: 0, duration: 900, ease: 'inOutCubic' }, 2750 + i * 110));
  S.tl = tl;
}

function resize() {
  if (!S.renderer) return;
  const w = stage.clientWidth, h = stage.clientHeight;
  if (!w || !h) return;
  S.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  S.renderer.setSize(w, h, false);
  const aspect = w / h, narrow = aspect < 0.8;
  S.narrow = narrow;
  S.w = w;
  S.h = h;
  S.camera.aspect = aspect;
  const half = Math.tan((14 * Math.PI) / 180);
  const frac = narrow ? 0.3 : 0.46;
  const shift = narrow ? 0.16 : -0.065;
  const dH = 1.31 / frac / 2 / half, dW = 1.15 / 2 / (half * aspect);
  const d = Math.max(dH, dW), sy = shift * (1.31 / frac);
  S.camera.position.set(0, d * 0.06 + sy, d);
  S.camera.lookAt(0, sy, 0);
  // slide the stand sideways so the copy sits left and the labels have room
  S.camera.setViewOffset(w, h, narrow ? w * 0.16 : -w * 0.14, 0, w, h);
  S.camera.updateProjectionMatrix();
}

// 0..1 through the pinned track, with a short hold at both ends
function progress() {
  const total = track.offsetHeight - window.innerHeight;
  const r = track.getBoundingClientRect();
  const p = total > 0 ? clamp(-r.top / total) : 0;
  return clamp((p - 0.04) / 0.92);
}

const tmp = new THREE.Vector3();

function placeLabels() {
  S.scene.updateMatrixWorld(true);
  let avg = 0, minL = 1e9, maxR = 0;
  const pts = {};
  for (const k of KEYS) if (k !== 'plate') avg += S.e[k].e / 5;

  for (const k of KEYS) {
    const L = labels[k];
    const e = k === 'plate' ? avg : S.e[k].e;
    const a = clamp((e - 0.55) / 0.35);
    L.el.style.opacity = a.toFixed(3);
    if (a <= 0) continue;
    const side = S.narrow ? 'r' : SIDE[k]; // phones: every label on the right
    tmp.copy(assets.anchors[k === 'plate' && S.narrow ? 'plateN' : k][side]);
    S.groups[k].localToWorld(tmp);
    tmp.project(S.camera);
    const ax = (tmp.x * 0.5 + 0.5) * S.w, ay = (-tmp.y * 0.5 + 0.5) * S.h;
    pts[k] = [ax, ay, side];
    if (side === 'l') minL = Math.min(minL, ax);
    else maxR = Math.max(maxR, ax);
  }

  // left labels share a column just left of the left-most part; right labels just right of the right-most
  const colR = minL - 44;
  const colX = Math.min(maxR + 44, S.w - (S.narrow ? 120 : 200));
  for (const k of Object.keys(pts)) {
    const L = labels[k], [px, py, side] = pts[k];
    L.el.classList.toggle('left', side === 'l');
    if (side === 'l') {
      L.line.style.width = `${Math.max(16, px - colR)}px`;
      L.el.style.transform = `translate(calc(${px.toFixed(1)}px - 100%), calc(${py.toFixed(1)}px - 50%))`;
    } else {
      L.line.style.width = `${Math.max(16, colX - px)}px`;
      L.el.style.transform = `translate(${px.toFixed(1)}px, calc(${py.toFixed(1)}px - 50%))`;
    }
  }
}

function frame() {
  requestAnimationFrame(frame);
  if (!S.ready || !S.renderer) return;
  const r = track.getBoundingClientRect();
  if (!FORCE && (r.bottom < -80 || r.top > window.innerHeight + 80)) return; // hero is off screen: skip the work

  const p = FORCE && FORCE.p !== undefined ? FORCE.p : progress();
  S.sp += (p - S.sp) * (reduce || FORCE ? 1 : 0.14);
  if (S.tl) S.tl.seek(S.tl.duration * S.sp);

  const fx = S.narrow ? 0.55 : 1, fy = S.narrow ? 0.6 : 1, fz = S.narrow ? 0.8 : 1;
  for (const k of KEYS) {
    const e = S.e[k].e, o = heroOffsets[k];
    const yk = k === 'foot' && S.narrow ? 1.25 : fy; // phones: drop the foot further so its label clears the web-address label
    S.groups[k].position.set(o[0] * e * fx, o[1] * e * yk, o[2] * e * fz);
  }
  S.pivot.rotation.y = S.state.rot;
  S.groups.plate.rotation.y = S.plate.r;
  placeLabels();
  S.renderer.render(S.scene, S.camera);
}

/* ---------- start ---------- */

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = src;
  });

Promise.all([fetch(STL_URL).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject(new Error('STL not found')))), loadImage(PHOTO_URL)])
  .then(([buf, img]) => {
    assets = buildAssets(parseSTL(buf), img);
    initScene();
    if (!reduce) {
      animate(document.querySelectorAll('.hero .rise'), {
        translateY: [26, 0],
        opacity: [0, 1],
        duration: 900,
        ease: 'outCubic',
        delay: stagger(90),
      });
    }
  })
  .catch((err) => {
    console.error('Hero 3D could not start:', err);
    fallback();
  });

window.addEventListener('resize', resize);
requestAnimationFrame(frame);
