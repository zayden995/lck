// Builds public/og.jpg (1200 x 630), the picture shown when the site link is shared
// on WhatsApp, Facebook, Telegram and so on: the three priced stands side by side on black.
// Run with `npm run og` after changing a product photo.
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const photos = ['simple-stand', 'stand-with-details', 'lucky-cat-stand'];
const centers = [225, 600, 975]; // x centre of each photo
const height = 560;
const top = 35;

(async () => {
  const layers = [];
  for (let i = 0; i < photos.length; i++) {
    const buf = await sharp(path.join(root, 'src/assets/products', `${photos[i]}.png`)).resize({ height }).toBuffer();
    const { width } = await sharp(buf).metadata();
    // "lighten" lets the black edges of neighbouring photos overlap without covering each other.
    layers.push({ input: buf, top, left: Math.round(centers[i] - width / 2), blend: 'lighten' });
  }
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#000' } })
    .composite(layers)
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(path.join(root, 'public/og.jpg'));
  console.log('Wrote public/og.jpg');
})();
