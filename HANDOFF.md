# HANDOFF

Last updated: 2026-11-11

## Current state

The site is built and runs. It has a header, a 3D hero, About, Products and pricing, Reviews, Contact and a footer. Nothing is committed to git (no commit was requested). The dev server is stopped, so `npm run dev` is free for you to start.

Checked: the build succeeds. In a real Chrome tab, real scrolling works and the browser console shows no errors. I looked at the hero at the start, mid-burst and merged, and at the sections, at desktop and phone-style widths.

Not checked: a real phone, Safari or Firefox, or the full scroll at 60 fps (the Chrome test tab was throttled to about 2 fps, so it needed long waits).

## What is built

- **Hero:** your real STL, split into six parts. The foot drops, the web address, UEN and logo fly left, the QR code comes toward you and right, and the base plate stays and spins one full turn. Labels sit on each part's side. Left copy, buttons, black stage and orange glow come from preview A; the part labels come from preview B. The outline "LCK TECH" sits bottom right. The black stage runs edge to edge: the soft-white border and rounded corners from the reference image were removed on request (2026-11-11).
- **About:** short intro plus three facts.
- **Products:** four tiers: S$15, S$25, S$35, and Custom (priced by design, button opens WhatsApp).
- **Reviews:** six sample reviews, shown without any "sample" label, as you asked.
- **Contact:** WhatsApp button and contact details (placeholders). No form yet.

## My calls (not yet confirmed by you)

- **Palette:** Flame Glow, your original three colours. Confirmed by you on 2026-11-11 ("stick with the original"). Colours live in `src/styles/tokens.css`.
- **Hero version:** the spinning-plate burst, in the version we last refined. You have not asked for changes to it.
- **Astro 5, not 7:** Astro 7 needs Node 22.23 or newer and you have 22.15.
- **three.js pinned to 0.128.0** so the lighting matches the previews.
- **Currency:** S$.
- **Draft copy:** "Scan. Pay. Done.", the About intro, the Contact line, the label descriptions ("Scan to pay", "Your business ID", "Holds the plate upright"), and the Custom tier blurb. All need your approval.
- **Nav:** Home, About, Products, Reviews, Contact, plus a WhatsApp button. On phones it collapses to a Menu button.
- **Files sorted:** the STL and front photo moved from the project root to `public/model/`.

## Placeholders still outstanding

- WhatsApp number (`src/data/site.js`). Until it is set, every WhatsApp button goes to the Contact section.
- Phone, email, address, hours (`src/data/site.js`).
- Tier names, descriptions and features for Tiers 1 to 3 (`src/data/products.js`).
- Photos for all four tier cards (currently `[PLACEHOLDER: photo]` boxes in `Products.astro`).
- "What is included, delivery" line under the Products heading.
- Turnaround time in the About facts (`About.astro`).
- Contact form: you will decide where submissions go. A comment in `Contact.astro` marks the spot.
- **Reviews are made up.** Replace them with real customer reviews before the site goes live (`src/data/reviews.js`). Fake reviews on a live business site can break consumer-protection rules in Singapore.

## Tried and abandoned

- Full 360° spin of the whole stand, on its own and combined with the burst: the print layers hide behind the plate at the back, so their labels pointed at nothing.
- Burst with no spin: replaced by the version where the base plate spins.
- Six colour layouts (and an earlier set that used off-palette colours): kept only Flame Glow. The tokens make switching easy.

## Traps

- **Astro must stay on 5 while Node is 22.15.** On 2026-11-11 `package.json` had been changed to `"astro": "^7.4.9"`, and `npm run dev` failed with "Node.js v22.15.0 is not supported by Astro (>=22.23.4)". It was pinned back to `^5.18.2` and reinstalled. Do not run an Astro upgrade command unless Node is upgraded first.

- The part split in `src/scripts/hero.js` depends on the current STL's geometry (see README, "Replacing the model"). A different STL may split wrongly.
- Part colours come from `public/model/preview_front.png` by position, not from the STL. If the photo changes, the model's colours change.
- The hero script is about 540 kB (140 kB gzipped), mostly three.js.
- `html { scroll-behavior: smooth }` is on. Scripts that call `scrollTo` and then read the position need `behavior: 'instant'`.
- On a very short screen (small laptop, landscape phone) the burst has less room and may crowd the outline text.

## What should be done next

`npm run dev` was confirmed working by you after the Astro 5 fix. The palette is settled (Flame Glow). What is left, for the next sessions:

1. Send the WhatsApp number and the contact details (phone, email, address, hours).
2. Describe the three tiers (names, descriptions, features) and send photos for the four cards.
3. Decide where the contact form sends submissions, then I build it.
4. Replace the sample reviews with real ones before launch.
5. Check the site on a real phone and in Safari.
6. Pick where to host it (not set up yet).
7. Approve or change the draft copy (headline, About intro, Contact line, label descriptions).
