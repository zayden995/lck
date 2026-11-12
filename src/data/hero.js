// Hero: the stand in 3D, pulled apart as you scroll.
// Units for OFFSET are millimetres in model space: [x right, y up, z toward the viewer].

// Labels that appear next to each part. `side` is the side of the screen the label sits on.
export const heroLabels = [
  { key: 'plate', side: 'r', name: 'Base plate', note: '90 × 120 mm, 3 mm thick' },
  { key: 'logo', side: 'l', name: 'Logo', note: 'LCK Tech brand mark' },
  { key: 'uen', side: 'l', name: 'UEN', note: 'Your business ID' },
  { key: 'qr', side: 'r', name: 'QR code', note: 'Scan to pay' },
  { key: 'url', side: 'l', name: 'Web address', note: 'lck.com.sg' },
  { key: 'foot', side: 'r', name: 'Foot', note: 'Holds the plate upright' },
];

// Where each part flies when the stand bursts apart.
export const heroOffsets = {
  plate: [0, 0, 0], // stays put and spins
  foot: [0, -24, -8],
  url: [-56, -26, 52],
  uen: [-56, 0, 58],
  logo: [-52, 18, 66],
  qr: [30, 4, 100],
};

// Colours of the 3D stand ("Flame match", chosen 2026-11-12). The front photo's amber, white and black
// are repainted with these, so the shapes still come from the photo.
export const heroColours = {
  plate: '#f3f0ea', // the plate's face (soft white)
  frame: '#ff4d14', // the raised border on the front
  sides: '#ff4d14', // the plate's edges and back
  foot: '#ff4d14',
  logo: '#ff4d14',
  text: '#0b0b0c', // UEN and web address
  qr: '#0b0b0c',
};

// The "living background" in the hero (option E, chosen 2026-11-12): a faint dot grid, small squares drifting up
// like loose QR pixels, a strip of facts sliding along the bottom, and a gentle sway of the stand while it is whole.
// The strip's words are built in Hero.astro from site.js and products.js, so the price and turnaround follow those files.
export const heroLive = {
  sway: 0.2, // how far the stand turns each way while it is whole, in radians (0 = no sway)
  squares: 18, // drifting squares on wide screens (phones and tablets show the first 10)
  stripSeconds: 46, // seconds for the facts strip to slide through one loop (higher = slower)
};

// The outline "LCK TECH" behind the page (option 3, chosen 2026-11-12): it holds in the hero's corner,
// then drifts to the centre of the screen and grows within one screen of scrolling, and stays there.
export const heroWord = {
  moveOver: 1, // how many screen heights after the hero it takes to reach the centre
  grow: 1.32, // size once centred (1 = as in the hero)
  fadeTo: 0.4, // brightness behind the content (1 = as in the hero)
  fadeOver: 0.6, // how many screen heights after the hero it takes to dim
};
