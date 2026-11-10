// The four tiers. Prices are real (SGD). Names, descriptions and features are placeholders
// until the tiers are described. `price: null` means "varies with the design".

export const currency = 'S$';

export const tiers = [
  {
    id: 'tier-1',
    label: 'Tier 1',
    name: '[PLACEHOLDER: tier 1 name]',
    price: 15,
    blurb: '[PLACEHOLDER: what this tier is]',
    features: ['[PLACEHOLDER: size]', '[PLACEHOLDER: design]', '[PLACEHOLDER: finish]'],
  },
  {
    id: 'tier-2',
    label: 'Tier 2',
    name: '[PLACEHOLDER: tier 2 name]',
    price: 25,
    blurb: '[PLACEHOLDER: what this tier is]',
    features: ['[PLACEHOLDER: size]', '[PLACEHOLDER: design]', '[PLACEHOLDER: finish]'],
  },
  {
    id: 'tier-3',
    label: 'Tier 3',
    name: '[PLACEHOLDER: tier 3 name]',
    price: 35,
    blurb: '[PLACEHOLDER: what this tier is]',
    features: ['[PLACEHOLDER: size]', '[PLACEHOLDER: design]', '[PLACEHOLDER: finish]'],
  },
  {
    id: 'custom',
    label: 'Custom',
    name: 'Custom stand',
    price: null,
    priceNote: 'Priced by design',
    blurb: 'Your own shape, colours and artwork. Tell us what you have in mind and we will quote you.',
    features: ['Your design', 'Your size', 'Quoted per order'],
  },
];
