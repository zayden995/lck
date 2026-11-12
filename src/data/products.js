// The four stands. Names and prices are real (SGD). The blurbs and features describe what the
// product photos show. `price: null` means "varies with the design".
// `photo` is a file in src/assets/products/; `alt` describes it for screen readers.

import simple from '../assets/products/simple-stand.png';
import details from '../assets/products/stand-with-details.png';
import luckyCat from '../assets/products/lucky-cat-stand.png';
import custom from '../assets/products/custom-stand.png';

export const currency = 'S$';

export const tiers = [
  {
    id: 'simple',
    name: 'Simple stand',
    price: 15,
    blurb: 'Your PayNow QR on a clean white plate, with a "Scan for PayNow" header and your name underneath.',
    features: ['Your PayNow QR', '"Scan for PayNow" header', 'Your name along the bottom'],
    photo: simple,
    alt: 'Simple stand: a white plate on a red base, with "Scan for Paynow" above a purple PayNow QR code and "LCK TECH" below it.',
  },
  {
    id: 'details',
    name: 'Stand with details',
    price: 25,
    blurb: 'Your logo, UEN, PayNow QR and website on one plate, framed with a coloured border.',
    features: ['Your logo', 'Your UEN and web address', 'Your PayNow QR'],
    photo: details,
    alt: 'Stand with details: a white plate with an orange border, showing the LCK Tech logo, the UEN, a PayNow QR code and the web address.',
  },
  {
    id: 'lucky-cat',
    name: 'Lucky Cat stand',
    price: 35,
    blurb: 'A waving lucky cat holding your PayNow QR, with a red collar and gold bell.',
    features: ['Waving lucky cat figure', 'Your PayNow QR on its sign', 'Red collar and gold bell'],
    photo: luckyCat,
    alt: 'Lucky Cat stand: a white waving lucky cat with a red collar and gold bell, holding a sign with a PayNow QR code.',
  },
  {
    id: 'custom',
    name: 'Custom stand',
    price: null,
    priceNote: 'Priced by design',
    blurb: 'Your own shape, colours, words and artwork. Tell us what you have in mind and we will quote you.',
    features: ['Your design', 'Your words, in any language', 'Quoted per order'],
    photo: custom,
    alt: 'Custom stand example: a PayNow QR code on a white base beside large raised red Chinese characters reading 扫码财神爷.',
  },
];
