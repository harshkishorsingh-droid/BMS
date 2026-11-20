# Hold & Split — prototype

A clickable prototype of a group-booking feature for BookMyShow: everyone in the group pays a small
part of their own ticket to hold the seats, then pays the rest before the show. No one fronts the
whole amount, and nobody has to chase anyone for money.

25 screens across three flows — the organiser in the app, a friend paying on mobile web with no app
installed, and the edge cases.

> **Not affiliated with BookMyShow.** This is an unsolicited design exercise built for a product
> design assignment. The screens deliberately replicate BookMyShow's visual language so the proposed
> feature can be judged in context. It is a static mock-up: no accounts, no real payments, no data
> collection of any kind. Every input on every screen is inert and posts nowhere.

## Run it locally

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

Serve it over `http://` rather than opening `index.html` as a `file://` URL. The shell reads which
screen the iframe is on to keep the tabs in sync, and the browser blocks that across `file://`
origins — tab-syncing silently stops working.

## Deploy to Vercel

1. Create a **private** repo on GitHub and push this folder:

   ```bash
   git init
   git add .
   git commit -m "Hold & Split prototype"
   git branch -M main
   git remote add origin git@github.com:<you>/hold-and-split.git
   git push -u origin main
   ```

2. On [vercel.com](https://vercel.com) → **Add New → Project → Import Git Repository**, pick the repo.

3. Leave every build setting at its default:

   | Setting | Value |
   | --- | --- |
   | Framework Preset | Other |
   | Root Directory | `./` |
   | Build Command | *empty* |
   | Output Directory | *empty* |
   | Install Command | *empty* |

   There is no `package.json` and no build step. Vercel serves the folder as-is.

4. **Deploy.** The live URL is the one to share.

Pushing to `main` redeploys automatically.

## What's in here

```
index.html        prototype shell — three tabs, screen list, phone frame
routes.json       tabs, 24 screens, 43 hotspots
screens/*.html    25 standalone screens, 393 × 852, no JS, no dependencies
docs/solution.md  the full feature spec — flow, money rules, edge cases, guardrails
BUILD.md          build brief for the shell
tools/            scripts that generated screens/ from the design canvas
vercel.json       no-index headers
.vercelignore     keeps docs/, tools/ and the markdown out of the public deployment
```

`docs/`, `tools/`, `BUILD.md` and `README.md` stay in the repo but are **not** deployed. The repo is
private; the deployed site is not, and the write-ups shouldn't sit at a guessable public URL.

## A note on the screens

`screens/` is generated output. Don't hand-edit it — re-export from the design canvas and re-run
`tools/flatten.js` and `tools/routes.js`, or the edits get overwritten.

Two conventions the screens rely on:

- Every screen carries `data-screen="<id>"` on `<body>`. The shell reads it to follow taps and switch
  tabs. Remove it and cross-flow navigation breaks.
- Amber `#F5A623` means **held but not paid for**. It's the only colour the feature adds, and it
  appears nowhere in the shell chrome.

## Known gaps

Five transitions happen because time passes or someone else acts, so no screen links to them. Reach
them from the screen list in the sidebar:

| Transition | Real-world trigger |
| --- | --- |
| Group status → Seats secured | the last person pays their hold |
| Hold paid → Secured (friend) | the group completes |
| Group status → Hold expired | the 30-minute window runs out |
| Group status → Book short / Cover a friend | expiry with 3 of 4 paid, or a balance going unpaid |
| Secured → Seat released | the balance deadline passes |

`screens/System.html` documents every token, type style and component state. It isn't listed in
`routes.json`, so it won't appear in the sidebar — open it directly at `/screens/System.html`.
