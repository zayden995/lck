// Business details and contact info. Anything real that has not been supplied is a [PLACEHOLDER].

export const site = {
  name: 'LCK Tech',
  tagline: 'Leading Computing Knowledge',
  uen: '53502724M', // printed on the stand
  web: 'lck.com.sg', // printed on the stand

  // WhatsApp number: digits only, country code first (e.g. 6591234567).
  // While it is a placeholder, every WhatsApp button points to the contact section instead.
  whatsapp: '[PLACEHOLDER]',

  phone: '[PLACEHOLDER]',
  email: '[PLACEHOLDER]',
  address: '[PLACEHOLDER]',
  hours: '[PLACEHOLDER]',
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
