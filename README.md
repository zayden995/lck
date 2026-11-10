# LCK Tech website

One-page site for LCK Tech, which sells 3D-printed QR payment stands to hawker stalls and small shops.
Built with Astro 5. The hero shows the real stand in 3D and pulls it apart as you scroll.

## Run it

```
npm install     # first time only
npm run dev     # http://localhost:4321
npm run build   # static site in dist/
npm run preview # serve the built site
```

Node 22.12 or newer works. This project uses Astro 5, which runs on Node 22.15. Astro 7 needs Node 22.23.4 or newer, so upgrade Node first if you ever move to Astro 7.

## Page sections

`src/pages/index.astro` lists them in order:

| Section  | File                          |
| -------- | ----------------------------- |
| Header   | `src/components/Header.astro` |
| Hero     | `src/components/Hero.astro`   |
| About    | `src/components/About.astro`  |
| Products | `src/components/Products.astro` |
| Reviews  | `src/components/Reviews.astro` |
| Contact  | `src/components/Contact.astro` |
| Footer   | `src/components/Footer.astro` |

## Where content lives

Edit these files, not the components.

- `src/data/site.js`: business name, UEN, web address, WhatsApp number, phone, email, address, hours.
  The WhatsApp number is digits only with the country code first (for example `6591234567`).
  While it is `[PLACEHOLDER]`, every WhatsApp button points to the Contact section instead.
- `src/data/products.js`: the four tiers (name, price, description, features). Prices are SGD.
- `src/data/reviews.js`: the review cards.
- `src/data/hero.js`: the six part labels and where each part flies in the hero.

Anything still showing `[PLACEHOLDER]` on the page is styled in orange with a dashed underline.

## Colours and type

`src/styles/tokens.css` holds every colour: jet black, soft white and flame orange, plus see-through tints of them.
The hero's glow and outline text have their own tokens there (`--hero-*`). The font is Montserrat, loaded from `@fontsource-variable/montserrat`.

## The hero

- `src/scripts/hero.js` loads `public/model/LCK_QR_stand.stl`, splits it into six parts, and colours it from `public/model/preview_front.png`.
- The stage is pinned inside a tall track (`.hero-track` in `src/styles/hero.css`, 560vh). Scrolling through the track drives one anime.js timeline.
- Timeline: parts burst out in a stagger (foot, web address, UEN, logo, QR code), the base plate spins one full turn, they hold with labels showing, then merge back in reverse order.
- Labels sit on the side of the screen each part moves toward (`side` in `src/data/hero.js`). On phones every label sits on the right.
- To change the scroll length, edit the track height. To change where a part goes, edit `heroOffsets` in `src/data/hero.js` (millimetres: x right, y up, z toward you).
- If WebGL is unavailable or the model fails to load, the hero shows the flat photo and drops the pinned scroll.
- Reduced motion: the stand still follows your scroll, with no easing lag and no entrance animation.
- Debug: setting `window.__force = { p: 0.5 }` before the hero script runs freezes the progress (0 to 1).

### Replacing the model

The part split depends on the shape of the current STL: the foot is anything below y = -30, the print layer is raised 0.8 mm above a 3 mm plate, and the four print pieces are cut by distance from the top edge (`buildAssets` in `hero.js`). If a new STL has a different layout, check those rules. Put the new files in `public/model/` with the same names. `preview_front.png` must be a straight-on photo of the front on a flat grey background.

## Files

```
public/
  model/                 the stand (STL) and its front photo
  favicon.svg
src/
  components/            one file per page section
  data/                  content (site, products, reviews, hero)
  layouts/Base.astro     page shell
  pages/index.astro      the one page
  scripts/hero.js        3D hero
  styles/                tokens, global, hero
```

## Notes

- `three` is pinned to 0.128.0 so the lighting matches the design previews. Newer versions light the model differently.
- The hero script is the biggest file (about 540 kB, 140 kB gzipped), mostly three.js.
- There is no contact form yet. A comment in `Contact.astro` marks where it goes.
