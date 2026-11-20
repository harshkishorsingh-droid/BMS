# Hold & Split — prototype build brief

A clickable prototype of a BookMyShow group-booking feature. **The 25 screens already exist as
standalone HTML and are already cross-linked.** Your job is the shell around them, not the screens.

---

## 1. Run what's here first

```bash
python3 -m http.server 8080      # from this folder
open http://localhost:8080
```

`index.html` is a **working reference shell**: three tabs, a screen list, a phone frame, and taps
inside the screens that drive the whole thing. Open it before writing any code — it tells you what
"done" looks like, and you may decide to improve it rather than start over.

> Must be served over `http://`. Opened as a `file://` URL the shell can't read which screen the
> iframe is on, so tab-syncing silently stops working.

---

## 2. What's in the package

```
index.html        reference shell (3 tabs + rail + phone frame)
routes.json       machine-readable map: tabs, screens, 43 hotspots
screens/*.html    25 standalone screens, 393 × 852, no dependencies
tools/            scripts that regenerated screens/ from the design canvas
```

Each screen in `screens/` is a complete HTML document: inline styles, inline SVG, one Google Fonts
link (Roboto), no JS, no build step. They link to each other with plain `<a href="A2.html">`, so
**navigation works inside an `<iframe>` with no router at all.**

---

## 3. What to build

A three-tab prototype viewer.

| Tab | Label | Caption | Entry screen |
| --- | --- | --- | --- |
| 1 | Hold & Split | Rohan — in the app | **A1b** |
| 2 | Friend's payment | Arjun — mobile web, no app | **B1** |
| 3 | Edge cases | When it goes wrong | **C1** |

Requirements:

1. **Tabs switch flows.** Selecting a tab loads that flow's entry screen.
2. **A screen list per tab**, in flow order (see `routes.json → tabs[].screens`). Clicking one jumps
   straight to it. Highlight the current screen.
3. **Taps inside the screen drive navigation.** The screens already contain the links — let them
   work. Do not intercept clicks and route them yourself.
4. **Cross-flow jumps switch the tab automatically.** Four taps leave flow A for flow B:
   `A6 → B1` (Share on WhatsApp), `A6 → B1` (Copy link), `A6 → B1` (SMS), `A7 → B1` (Share link
   again). When the iframe lands on a B screen, tab 2 must become active. Read
   `document.body.dataset.screen` from the loaded iframe — every screen carries it.
5. **Restart flow** returns to the active tab's entry screen. **Back** steps through visited screens.
6. **Phone frame.** 393 × 852 viewport, rounded, on a neutral background. The screens draw their own
   status bar and home indicator — don't add another.

Stack is yours. Vanilla HTML + JS is enough and is what the reference shell uses; React + Vite is
fine if you want routing and deep links (`/hold/A4`). **Do not rewrite the screens into components** —
the point of this package is that the visual work is finished and frozen.

---

## 4. Known gaps — transitions with no button

Five transitions happen because *time passes* or *someone else acts*, so no screen links to them.
They're reachable from the screen list, which is enough for a walkthrough:

| Missing edge | Real-world trigger |
| --- | --- |
| A7 → A8 | the fourth person pays their hold |
| B4 → B5 | the group completes |
| A7 → C1 | the 30-minute hold window expires |
| A7 → C2 / C3 | expiry with 3 of 4 paid / a balance going unpaid |
| B5 or B6 → C4 | the balance deadline passes |

**Optional, and only if the demo needs it:** a small "simulate" control in the shell chrome — never
inside the phone — that fires these. Keep it visually outside the device frame so nobody mistakes it
for part of the product.

---

## 5. Interactivity that was flattened out

The screens were exported from a design canvas; three had live inputs that are now static. Restore
them **only if asked** — a click-through demo doesn't need them:

- **A1 / A1b** — seat selection. Tapping a seat toggles green; the CTA recomputes
  (Platinum ₹250 / Gold ₹200 / Silver ₹150) and the `4 Tickets` chip follows the count.
- **A3** — the three name fields (G6, G7, G8) accept typing; G5 stays disabled.
- **B2** — the phone field accepts typing.

---

## 6. Rules that are not negotiable

- **Don't restyle the screens.** They match the live BookMyShow app deliberately, down to the
  spacing. If something looks nicer than the real app, it's wrong.
- **Amber `#F5A623` means held-but-not-paid.** It is the only colour the feature adds. Never use it
  in the shell chrome.
- **Keep the shell neutral.** Greys and one accent. The shell is a tool; the red belongs to the
  product inside the frame.
- **393 × 852, light mode only.**

Tokens, type scale, and every component state are documented on the `System` screen
(`screens/System.html`) — open it if you need a value.

---

## 7. Acceptance checklist

- [ ] Three tabs, correct entry screen each
- [ ] Screen list per tab, current screen marked
- [ ] Tapping `Split & hold` on A1b reaches A2 → A4 → A5 → A6 → A7 without touching the rail
- [ ] Tapping `Share on WhatsApp` on A6 lands on B1 **and** flips to tab 2
- [ ] B1 → B2 → B3 → B4 plays; B5 → B6 → B7 plays
- [ ] `Restart flow` and `Back` behave on all three tabs
- [ ] No console errors; no layout shift inside the frame; nothing added over the screens

---

## 8. Regenerating the screens

`screens/` was produced from a Claude Design canvas by `tools/flatten.js` (expands the canvas's
template syntax into static HTML and rewrites `*.dc.html` links to `*.html`), and `routes.json` by
`tools/routes.js`. If the canvas changes, re-export the `.dc.html` files and re-run both scripts —
don't hand-edit `screens/`, the edits will be overwritten.

```bash
node tools/flatten.js     # canvas .dc.html  →  screens/*.html
node tools/routes.js      # screens/*.html   →  routes.json
```

Both scripts have the source and output paths at the top; point them at wherever the files live.
