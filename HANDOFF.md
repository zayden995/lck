# HANDOFF

Last updated: 2026-11-12

## Current state

The site is built and runs. It has a header, a 3D hero, About, Products, How to order, Reviews, Contact and a footer. The first build is committed (`cc438a4`) and pushed to `origin/main` on GitHub. Everything from the 2026-11-12 session below is **not committed yet**. The dev server is stopped, so `npm run dev` is free.

Checked on 2026-11-12: the build succeeds. In Chrome, I looked at every section at desktop width, and at 390, 375, 360, 320, 820, 1000 and 1200px wide (in frames, because the browser window could not be resized). The phone menu opens and closes, the order form shows its error when the name is empty and builds the right WhatsApp message when filled in (Chinese characters included), and the browser console shows no errors.

Third round (model colours and the background text) also checked in Chrome at desktop width and 390px: the stand shows the new colours, the two copies of "LCK TECH" line up at the handover (within half a pixel), and the text slides back and hands back when scrolling up. No console errors.

Fourth round (text reaches the centre in one screen) checked in Chrome at desktop width and 390px: one screen after the hero the text is centred, 1.32× and at 40%, halfway through it is halfway there, and it stays centred down to the footer. No sideways scrolling, no console errors.

Fifth round (the fuller hero, option E) checked in Chrome: the build succeeds; at desktop width the dot grid, drifting squares, facts strip and sway all run, the burst labels stay clear of the headline and the strip, and the "LCK TECH" handover still lines up (within half a pixel). Phone frames at 405 × 844, 390 × 667, 375 × 740 and 335 × 583: both hero buttons on one line, the stand clear of the buttons and the strip, at rest and during the burst. Laptop frames at 1366 × 640, 1280 × 720, 1024 × 700 and 1366 × 768: the copy clear of the strip. No sideways scrolling, no console errors.

Not checked: a real phone, Safari or Firefox, a real WhatsApp send from the form, how the link preview looks when actually shared (that needs the site to be live), the reduced-motion setting, and the repainted flat photo that shows only when 3D cannot run.

## What changed on 2026-11-12

Zayden sent the WhatsApp number, email, the four product names and prices, and a photo of each stand, and asked to "fill in the gaps and make the website overall better". He chose to skip planning questions and give his input after seeing the changes, so everything below is waiting for his review.

- **Contact details filled in:** WhatsApp +65 8856 7338 and contactus@lck.com.sg (`src/data/site.js`). Every WhatsApp button now opens WhatsApp. Email and WhatsApp are links in Contact and the footer.
- **Products:** real names (Simple stand S$15, Stand with details S$25, Lucky Cat stand S$35, Custom stand) and real photos. The three priced stands sit three across; the custom stand is a full-width card with its wide photo. The "Tier 1/2/3" labels are gone. Photos moved into `src/assets/products/` and are shrunk at build time (about 20 to 70 kB each instead of 1 to 1.6 MB).
- **New How to order section** between Products and Reviews: three steps. Step 3 was a placeholder (rough guess added in the second round).
- **Order form** in Contact: stand, quantity, name, stall name and what it should say. It opens WhatsApp with the message written out. Nothing is stored or sent to a server.
- **About:** the facts were "90 × 120 mm plate" and "3 mm thick", which only describe one stand. They are now "S$15 starting price", "4 stand designs, custom included" and turnaround (a placeholder, then a rough guess in the second round). The intro now mentions the lucky cat as well as the plate.
- **Hero:** eyebrow is now "PayNow QR stands"; the subline ends "Printed with your PayNow QR, from S$15."
- **Header:** "How to order" added. "Home" left the desktop nav (the logo goes to the top) but stays in the phone menu. The nav folds into the Menu button below 1000px wide (was 760px), because six items no longer fit beside the logo. On phones a WhatsApp button now sits next to Menu instead of being hidden inside it.
- **Footer:** now has page links, WhatsApp and email, and the year updates itself.
- **Search and link previews:** page title and description mention PayNow and Singapore; link-preview tags and a link-preview picture (`public/og.jpg`, the three stands side by side); business details for search engines. `astro.config.mjs` now sets `site: 'https://www.lck.com.sg'`.
- **New files:** `src/components/HowToOrder.astro`, `src/assets/products/*.png`, `public/og.jpg`, `tools/make-og.cjs`, plus the `npm run og` script.

## Second round on 2026-11-12 (from your feedback)

- **Taller header:** 30px above and below at the top of the page (was 24px), 22px once scrolled (was 14px). Nav text 12px (was 11px), logo 17px (was 15px), WhatsApp button a little bigger. Small phones get a 15px logo so it still fits at 320px.
- **Contact:** Phone, Address and Hours rows removed. A "Based in: Singapore" row added; the footer also says "Based in Singapore". `site.js` lost `phone`, `address` and `hours` and gained `location`.
- **Review cards** now lift, get an orange border and a faint orange tint on hover, like the product cards.
- **Rough guesses filled in** for every remaining placeholder (you said you will correct them later). They live together in `src/data/site.js`:
  - Turnaround: "3–5 working days" (About fact shows "3–5 days, from order to ready"; How to order step 3).
  - Delivery: "Collect it, or we can arrange delivery within Singapore." (Products intro and step 3).
  - What is included: "Prices are per stand, in Singapore dollars, with your QR and details printed on." (Products intro).
  - The page no longer shows any `[PLACEHOLDER]`.

## Third round on 2026-11-12: hero colours and background text

You compared live options on a preview page (https://claude.ai/artifact/CfJnMZZL2zfvd65yv1Gnn8) and picked **B, Flame match** and **3, Hold, then drift and grow**. Both are built.

- **Why the old model looked off:** its amber (#f5a623, a yellow-orange) sat next to the site's flame (#ff4d14, a red-orange) glow, and its plate edges and foot used a colour setting that rendered a shade lighter than the painted front.
- **Flame match:** soft white plate, flame frame, edges, foot and logo, jet print and QR. Colours are a list (`heroColours`) in `src/data/hero.js`; `hero.js` repaints the front photo in them, and the solid parts are now converted the same way as the painted front so the edges match. The flat fallback photo is repainted too.
- **Background "LCK TECH":** stays in the hero's corner through the hero, then a fixed copy takes over and drifts to the centre, growing to 1.32× and dimming to 40%, arriving at the bottom of the page. New files: `src/components/ScrollWord.astro`, `src/scripts/scroll-word.js`. Settings: `heroWord` in `src/data/hero.js`.
- **Layering change:** every `.section` and the footer now have `z-index: 2` so the text sits behind them (`global.css`, `Footer.astro`).
- Options not picked: colours A, C, D (orange border with purple QR), E (black stand), F (graphite); text options 1 (drift all the way, moving during the hero) and 2 (hold then drift, no grow).

## Fourth round on 2026-11-12: shorter text move

- You asked for the background "LCK TECH" to reach the centre "in 1 scroll". It used to take the whole rest of the page (about 5 screens on desktop). It now reaches the centre, full size, one screen height after the hero lets go, then stays centred to the footer. New setting `heroWord.moveOver` (1 = one screen height) in `src/data/hero.js`.
- You also said the hero feels a little empty ("in general, but slightly better when the stand comes apart").

## Fifth round on 2026-11-12: a fuller hero (option E, Living background)

You compared five options on a preview page (https://claude.ai/artifact/DJtDvBstKZJhbf7DyvVk88) and picked **E, Living background**. Built:

- **Bigger:** headline up to 7.8% of the screen width (was 6.1%), larger subline, eyebrow and buttons; the stand fills 56% of the screen height (was 46%) and sits a little closer to the copy.
- **Living background:** a faint dot grid; 18 small squares drifting up like loose QR pixels (10 on phones); a strip of facts sliding along the bottom ("PayNow QR stands · From S$15 · Ready in 3–5 days · Order on WhatsApp · Based in Singapore"); a gentle sway of the stand. The outline "LCK TECH" moved up to sit above the strip.
- **Settings:** `heroLive` in `src/data/hero.js` (sway, squares, strip speed). The strip's words are at the top of `Hero.astro`, built from `site.js` and `products.js`. Two new colour tokens: `--hero-dot`, `--hero-strip`.
- **Fixed while building:** on phones the "WhatsApp us" button dropped to a second line and the stand covered it (the text column was too narrow for both buttons; this was already close before). The column is now wider, the buttons are slightly smaller below 360px, and the script fits the stand into the space between the buttons and the strip. On short laptops (below 720px tall) the copy ran into the strip; the "Scroll to take it apart" hint now hides there and the copy is tighter.
- Options not picked: A Today, B Bigger and closer, C Fact tags (my recommendation), D The range.

## My calls (not yet confirmed by you)

From the fifth round, 2026-11-12:

- The sway runs only while the stand is whole (at the top, and after it merges back), not during the burst, so the parts and labels don't wobble.
- The strip says "Ready in 3–5 days", which is still a rough guess, now shown right at the top of the site.
- On short laptops the "Scroll to take it apart" hint is hidden to make room.
- On phones the stand shrinks if needed so it never covers the buttons or the strip.

From the fourth round, 2026-11-12:

- "1 scroll" read as one screen height of scrolling, not one turn of the mouse wheel (about 100px), which would make the text jump.

From the third round, 2026-11-12:

- "Fade behind content" is on (40%), as shown by default on the preview page.

From the second round, 2026-11-12:

- "Thicker navbar" read as a taller bar with slightly bigger text, not a wider one.
- The rough guesses above, and "Based in" as the row label.

From the first round, 2026-11-12:

- **Product blurbs and features** are written from what each photo shows (for example "Your logo, UEN, PayNow QR and website"). They make no claims about size, material or colour choices.
- **Custom stand features:** "Your design", "Your words, in any language" (from the Chinese example photo), "Quoted per order".
- **Order form goes to WhatsApp**, not email or a form service. The earlier handoff left this for you to decide. It needs no server and matches how you take orders now. Easy to swap if you prefer email.
- **How to order** steps 1 and 2 ("Pick your stand", "Send us your QR").
- **Products layout:** three across plus a wide custom card, rather than four across, because the custom photo is very wide.
- **Hero copy** now says "PayNow" and "from S$15".
- **The live address is https://www.lck.com.sg**, taken from the stand itself. It is only used in the link-preview and search tags.
- **Reviews kept out of the search-engine details**, because they are samples.

Earlier calls, still standing:

- **Palette:** Flame Glow. Confirmed by you on 2026-11-11. Colours live in `src/styles/tokens.css`.
- **Hero version:** the spinning-plate burst.
- **Astro 5, not 7:** Astro 7 needs Node 22.23 or newer and you have 22.15.
- **three.js pinned to 0.128.0** so the lighting matches the previews.
- **Currency:** S$.
- **Draft copy:** "Scan. Pay. Done.", the About intro, the Contact line, the hero part-label descriptions and the Custom blurb.

## Placeholders and guesses still outstanding

- No `[PLACEHOLDER]` is left on the page, but turnaround, delivery and "what is included" are **rough guesses** to confirm (`src/data/site.js`).
- **Reviews are made up.** Replace them with real customer reviews before the site goes live (`src/data/reviews.js`). Fake reviews on a live business site can break consumer-protection rules in Singapore.

## Tried and abandoned

- Full 360° spin of the whole stand, on its own and combined with the burst: the print layers hide behind the plate at the back, so their labels pointed at nothing.
- Burst with no spin: replaced by the version where the base plate spins.
- Six colour layouts (and an earlier set that used off-palette colours): kept only Flame Glow. The tokens make switching easy.
- 2026-11-12: four product cards across in one row. The custom photo is about 2.5 times wider than tall and looked tiny in a portrait card, so custom got its own wide card.

## Traps

- **Astro must stay on 5 while Node is 22.15.** On 2026-11-11 `package.json` had been changed to `"astro": "^7.4.9"`, and `npm run dev` failed with "Node.js v22.15.0 is not supported by Astro (>=22.23.4)". It was pinned back to `^5.18.2` and reinstalled. Do not run an Astro upgrade command unless Node is upgraded first.
- The part split in `src/scripts/hero.js` depends on the current STL's geometry (see README, "Replacing the model"). A different STL may split wrongly.
- Part shapes and shading come from `public/model/preview_front.png` by position; the colours are repainted from `heroColours`. The repaint only recognises the photo's current amber, white and black (`REF` in `hero.js`). A new photo printed in other colours will repaint wrongly.
- **The background "LCK TECH" is two elements** (the hero's `.hero-word` and the fixed `ScrollWord`). If you change the hero word's size, outline or position in `hero.css`, change `.scroll-word` in `ScrollWord.astro` to match, or the handover will jump. The script reads the hero word's right and bottom offsets itself.
- **New sections need `z-index: 2`** (the `.section` class gives it), or the background text draws over them.
- **Testing the moving text in the Chrome test tab:** the tab runs only a few frames a second while in the background, so the text lags far behind. Taking a screenshot makes it draw; measure after a few screenshots, not after a wait.
- **Phone frames in the Chrome test tab show a scrollbar** (about 15–19px), so a 390px frame is really about 371px of page. Real phones have no scrollbar taking space, so frames are slightly harsher than real phones.
- The hero script is about 540 kB (140 kB gzipped), mostly three.js. The build's chunk-size warning is about this file.
- `html { scroll-behavior: smooth }` is on. Scripts that call `scrollTo` and then read the position need `behavior: 'instant'`.
- On a very short screen (small laptop, landscape phone) the burst has less room and may crowd the outline text.
- **On phones the stand's size and height are worked out from the hero buttons** (`phoneRoom` in `hero.js`): it sits between the bottom of the buttons and the top of the facts strip. Changing the phone headline, buttons or strip height moves the stand; that is intended. On the smallest phones (about 320 × 570) the stand shrinks and the "QR code" and "Base plate" labels sit very close during the burst.
- **The facts strip loop needs its spacing on each item** (`margin-right`), not `gap` or padding on the row, or the loop jumps once per cycle. It also needs the six repeats in `Hero.astro` to cover very wide screens.
- The hero copy on desktop is close to the strip on short laptops; the headline size is capped by screen height and the scroll hint hides below 720px tall. Adding lines to the hero copy can push it into the strip there.
- The phone header is tight: logo, WhatsApp and Menu just fit at 320px. Longer button text there will push the buttons onto two lines (found and fixed on 2026-11-12).
- Product photos are on pure black (`#000`), and the card photo frames are `#000` to match. A photo with a different background will show a visible box.
- After changing a product photo, run `npm run og` or the link preview will still show the old one.

## What should be done next

1. Look at the fuller hero (option E) on your own screen and phone (`npm run dev`) and say if anything needs tuning: the sway, how many squares, how fast the strip slides, or the strip's words.
2. Look at the moving "LCK TECH" and say if it needs tuning (how far it scrolls, how big it grows, how dim it gets).
3. Review the rest of the 2026-11-12 changes (see "My calls" above) and correct the rough guesses for turnaround, delivery and what is included.
4. Replace the sample reviews with real ones before launch.
5. Commit this session's work once you are happy with it.
6. Pick where to host it, then point www.lck.com.sg at it.
7. Check the site on a real phone and in Safari, and send one real order through the form.
