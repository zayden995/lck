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
