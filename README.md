# LCK Tech website

One-page site for LCK Tech, which sells 3D-printed PayNow QR stands to hawker stalls and small shops.
Built with Astro 5. The hero shows the real stand in 3D and pulls it apart as you scroll.

## Run it

```
npm install     # first time only
npm run dev     # http://localhost:4321
npm run build   # static site in dist/
npm run preview # serve the built site
npm run og      # rebuild the link-preview picture (public/og.jpg)
```

Node 22.12 or newer works. This project uses Astro 5, which runs on Node 22.15. Astro 7 needs Node 22.23.4 or newer, so upgrade Node first if you ever move to Astro 7.

## Page sections

`src/pages/index.astro` lists them in order:

| Section      | File                              |
| ------------ | --------------------------------- |
| Header       | `src/components/Header.astro`     |
| Hero         | `src/components/Hero.astro`       |
| About        | `src/components/About.astro`      |
| Products     | `src/components/Products.astro`   |
| How to order | `src/components/HowToOrder.astro` |
| Reviews      | `src/components/Reviews.astro`    |
| Contact      | `src/components/Contact.astro`    |
| Footer       | `src/components/Footer.astro`     |

Behind all of them sits the outline "LCK TECH" that follows the scroll: `src/components/ScrollWord.astro` (see "The background LCK TECH" below).

## Where content lives

Edit these files, not the components.

- `src/data/site.js`: business name, UEN, web address, full site address (`url`), where the business is based (`location`), WhatsApp number and email, plus the ordering lines:
  - `whatsapp` is digits only with the country code first (`6588567338`). `whatsappDisplay` is how it is written on the page (`+65 8856 7338`).
  - `turnaround` (How to order, step 3), `turnaroundShort` (About facts), `delivery` (Products intro and step 3) and `included` (Products intro). Change them here and every section follows.
  - If `whatsapp` is ever set back to `[PLACEHOLDER]`, every WhatsApp button points to the Contact section instead.
  - `isPlaceholder(text)` is exported here and used by the components to style anything marked `[PLACEHOLDER]`.
- `src/data/products.js`: the four stands. Each has `id`, `name`, `price` (SGD, or `null` for "priced by design"), `blurb`, `features`, `photo` and `alt` (the photo description for screen readers). The About section's "starting price" and the hero's "from S$15" are worked out from these prices.
- `src/assets/products/`: the product photos (`simple-stand.png`, `stand-with-details.png`, `lucky-cat-stand.png`, `custom-stand.png`). They are shot on pure black, and the card frames are black to match. Astro turns each one into small AVIF, WebP and JPG copies at build time.
- `src/components/HowToOrder.astro`: the three ordering steps are listed at the top of this file. Step 3 is built from `turnaround` and `delivery` in `site.js`.
- `src/data/reviews.js`: the review cards.
- `src/data/hero.js`: the six part labels, where each part flies in the hero, the 3D stand's colours (`heroColours`), the hero's living background (`heroLive`: sway, number of squares, strip speed) and how far the background "LCK TECH" scrolls, grows and dims (`heroWord`).
- The words in the hero's facts strip are listed at the top of `src/components/Hero.astro`. The price comes from `products.js` and the turnaround and location from `site.js`, so they update with those files.

Anything still showing `[PLACEHOLDER]` on the page is styled in orange with a dashed underline.

## Products layout

The three priced stands sit three across from 760px wide, with a square photo on phones and a 4:5 photo above that. The custom stand is a full-width card underneath, with its wide photo beside the text. Every "Order on WhatsApp" button opens WhatsApp with a message naming that stand and its price.

## Contact and the order form

The form in `Contact.astro` does not send anything to a server. When it is submitted, it writes the customer's choices into a WhatsApp message and opens WhatsApp with that message ready to send to the business number. Only "Your name" is required. Below the form is a link to email instead. The details list beside it shows WhatsApp and email as links, and "Based in Singapore". The footer repeats both links and "Based in Singapore".

## Header

The bar is 30px tall above and below its contents at the top of the page, and 22px once you scroll (it also turns see-through dark). From 1000px wide, the nav sits split around the logo: About, Products, How to order on the left; Reviews, Contact and a WhatsApp button on the right. Below 1000px the links move into a Menu button, and the WhatsApp button stays visible next to it. Below 520px the "Leading Computing Knowledge" line under the logo is hidden to make room, and below 400px the logo text and buttons shrink slightly so everything fits on a 320px phone.

## The background LCK TECH

The outline "LCK TECH" (11% of the screen width, soft white outline) stays on screen behind the whole page:

- **In the hero** it is the hero's own copy (`.hero-word` in `Hero.astro`), bottom right just above the facts strip, in front of the orange glow and behind the 3D stand. It does not move.
- **When the hero lets go of the screen**, a fixed copy (`ScrollWord.astro`) takes over in exactly the same spot. Over the next screen of scrolling (`heroWord.moveOver`, 1 screen height) it drifts to the centre of the screen and grows (to `heroWord.grow`, 1.32×), then stays centred for the rest of the page. It also dims (to `heroWord.fadeTo`, 40%, over `heroWord.fadeOver`, 0.6 screen heights).
- Scrolling back up, it slides home, then hands back to the hero's copy.
- With reduced motion on, it stays in its corner (it still dims behind the content).

Two copies are needed because the hero stage is pinned (`position: sticky`), and a pinned element keeps its own layers: one element cannot sit behind the 3D stand and also behind the sections. The moving logic is in `src/scripts/scroll-word.js`.

Layers: the fixed copy is `z-index: 1`. Every `.section` and the footer are `z-index: 2`, so the text sits behind them; product photos (solid black frames) hide it, see-through cards show it faintly. A new section must use the `.section` class (or its own `position: relative; z-index: 2`), or the text will draw over it.

## Hover effects

Product cards and review cards lift 4px and get an orange border when hovered; review cards also take a faint orange tint. With the reduced-motion setting on, review cards do not lift.

## Search and link previews

`src/layouts/Base.astro` sets the page title, description, the canonical address, the link-preview tags and a block of business details for search engines (name, email, WhatsApp number, country and the three prices). The reviews are left out of that block on purpose.

The live address is set in `astro.config.mjs` (`site: 'https://www.lck.com.sg'`); the preview tags use it to build full links. The link-preview picture is `public/og.jpg` (1200 × 630), made by `tools/make-og.cjs` from the three priced product photos. Run `npm run og` after changing a product photo. The script uses `sharp`, which comes installed with Astro.

## Colours and type

`src/styles/tokens.css` holds every colour: jet black, soft white and flame orange, plus see-through tints of them.
The hero's glow, outline text, dot grid and facts strip have their own tokens there (`--hero-*`). The 3D stand's colours are in `heroColours` in `src/data/hero.js` (currently "Flame match": soft white plate, flame frame, edges, foot and logo, jet print). The font is Montserrat, loaded from `@fontsource-variable/montserrat`.

## The hero

- `src/scripts/hero.js` loads `public/model/LCK_QR_stand.stl`, splits it into six parts, and colours it from `public/model/preview_front.png`, repainted in `heroColours`: every pixel of the photo is read as a mix of its amber, white and black, and painted as the same mix of the new frame or logo, plate and print colours. The plate's edges, back and the foot are solid colours from the same list.
- To change the stand's colours, edit `heroColours` in `src/data/hero.js` (frame, sides, foot, logo, plate, text, qr).
- The stage is pinned inside a tall track (`.hero-track` in `src/styles/hero.css`, 560vh). Scrolling through the track drives one anime.js timeline.
- **Living background** (behind and around the stand, for the whole hero):
  - a faint dot grid;
  - small squares drifting up like loose QR pixels (18 on wide screens, the first 10 on phones and tablets, placed from a fixed seed so they are the same on every build);
  - a strip of facts sliding along the bottom (48px tall, 38px on phones). The words repeat six times and slide left by half, so the loop has no gap even on very wide screens. The outline "LCK TECH" sits just above the strip.
  - The stand sways gently while it is whole (at the top, and after it merges back). The sway fades out as the parts fly, so the labels do not wobble.
  - With reduced motion on, the squares and the strip stand still and the stand does not sway.
- **Size and placement:** on wide screens the stand fills 56% of the screen height, just right of centre. The headline is up to 7.8% of the screen width but never more than 13% of its height, so the copy stays clear of the strip on short laptops. Below 720px tall, the "Scroll to take it apart" hint is hidden and the copy is tightened for the same reason.
- **Phones** (screen narrower than 0.8 × its height): the script measures the space between the hero buttons and the facts strip (`phoneRoom` in `hero.js`) and fits the stand inside it, shrinking it if needed. So if the phone copy or buttons change, the stand moves to match. The text column is wide enough for both buttons on one line; below 360px wide the buttons are slightly smaller.
- Timeline: parts burst out in a stagger (foot, web address, UEN, logo, QR code), the base plate spins one full turn, they hold with labels showing, then merge back in reverse order.
- Labels sit on the side of the screen each part moves toward (`side` in `src/data/hero.js`). On phones every label sits on the right.
- To change the scroll length, edit the track height. To change where a part goes, edit `heroOffsets` in `src/data/hero.js` (millimetres: x right, y up, z toward you).
- If WebGL is unavailable or the model fails to load, the hero shows the flat photo (repainted in the same colours) and drops the pinned scroll.
- Reduced motion: the stand still follows your scroll, with no easing lag and no entrance animation.
- Debug: setting `window.__force = { p: 0.5 }` before the hero script runs freezes the progress (0 to 1).

### Replacing the model

The part split depends on the shape of the current STL: the foot is anything below y = -30, the print layer is raised 0.8 mm above a 3 mm plate, and the four print pieces are cut by distance from the top edge (`buildAssets` in `hero.js`). If a new STL has a different layout, check those rules. Put the new files in `public/model/` with the same names. `preview_front.png` must be a straight-on photo of the front on a flat grey background, printed in the same three colours as now (amber #f5a623, white #f4f4f4, black #1a1a1a): the repaint looks for exactly those (`REF` in `hero.js`).

## Files

```
public/
  model/                 the stand (STL) and its front photo
  favicon.svg
  og.jpg                 link-preview picture (made by tools/make-og.cjs)
src/
  assets/products/       the four product photos
  components/            one file per page section, plus ScrollWord (the background LCK TECH)
  data/                  content (site, products, reviews, hero)
  layouts/Base.astro     page shell, title, search and link-preview tags
  pages/index.astro      the one page
  scripts/hero.js        3D hero
  scripts/scroll-word.js moves the background LCK TECH
  styles/                tokens, global, hero
tools/
  make-og.cjs            builds public/og.jpg
```

## Notes

- `three` is pinned to 0.128.0 so the lighting matches the design previews. Newer versions light the model differently.
- The hero script is the biggest file (about 540 kB, 140 kB gzipped), mostly three.js. The build prints a chunk-size warning for it; that is expected.
