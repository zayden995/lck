// Business details and contact info.

export const site = {
  name: 'LCK Tech',
  tagline: 'Leading Computing Knowledge',
  uen: '53502724M', // printed on the stand
  web: 'lck.com.sg', // printed on the stand
  url: 'https://www.lck.com.sg', // full address, used for links shared on social media and search
  location: 'Singapore',

  // WhatsApp number: digits only, country code first (e.g. 6591234567).
  // If it is ever set back to a placeholder, every WhatsApp button points to the contact section instead.
  whatsapp: '6588567338',
  whatsappDisplay: '+65 8856 7338',

  email: 'contactus@lck.com.sg',

  // ROUGH GUESSES, to be confirmed. Shown in About, Products and How to order.
  turnaround: '3–5 working days',
  turnaroundShort: '3–5 days',
  delivery: 'Collect it, or we can arrange delivery within Singapore.',
  included: 'Prices are per stand, in Singapore dollars, with your QR and details printed on.',
};

export function whatsappReady() {
  return site.whatsapp.replace(/\D/g, '').length > 0;
}

// Link for a WhatsApp button, with a pre-filled message.
export function whatsappLink(message) {
  const digits = site.whatsapp.replace(/\D/g, '');
  if (!digits) return '#contact';
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const isPlaceholder = (s) => typeof s === 'string' && s.includes('[PLACEHOLDER');
