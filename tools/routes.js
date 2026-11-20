/* Builds routes.json from the flattened screens. */
const fs = require('fs');
const path = require('path');

const DIR = '/home/claude/handoff/screens';

const TITLES = {
  A1: 'Seat map', A1b: 'Seat map · high demand', A2: 'Split & hold setup', A3: 'Name the seats',
  A4: 'Confirm your hold', A5: 'Payment — hold', A6: 'Hold active', A7: 'Group status',
  A8: 'Seats secured', A9: 'Pay your balance', A10: 'Group ticket', A10b: 'Ticket · balance due',
  B1: 'Join page', B2: 'Phone number', B3: 'Pay your hold', B4: 'Hold paid, waiting',
  B5: 'Secured', B6: 'Pay balance', B7: "Friend's ticket",
  C1: 'Hold expired', C2: 'Book short · 3 of 4', C3: 'Cover a friend', C4: 'Seat released',
  C5: 'Payment failed', System: 'Tokens & components'
};

const TABS = [
  { id: 'hold', label: 'Hold & Split', caption: 'Rohan — in the app', entry: 'A1b',
    screens: ['A1b', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9', 'A10', 'A10b'] },
  { id: 'friend', label: "Friend's payment", caption: 'Arjun — mobile web, no app', entry: 'B1',
    screens: ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7'] },
  { id: 'edge', label: 'Edge cases', caption: 'When it goes wrong', entry: 'C1',
    screens: ['C1', 'C2', 'C3', 'C4', 'C5'] }
];

function textOf(html) {
  return html.replace(/<svg[\s\S]*?<\/svg>/g, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const hotspots = [];
for (const tab of TABS) {
  for (const id of tab.screens) {
    const file = path.join(DIR, id + '.html');
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, 'utf8');
    const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/g;
    let m;
    while ((m = re.exec(src))) {
      const attrs = m[1];
      const href = (/href="([^"]+)"/.exec(attrs) || [])[1];
      if (!href || !href.endsWith('.html')) continue;
      const aria = (/aria-label="([^"]+)"/.exec(attrs) || [])[1];
      let label = textOf(m[2]) || aria || 'tap target';
      if (label.length > 48) label = label.slice(0, 45) + '…';
      hotspots.push({ from: id, label, to: href.replace('.html', '') });
    }
  }
}

const screens = {};
for (const tab of TABS) {
  for (const id of tab.screens) {
    screens[id] = {
      title: TITLES[id] || id,
      tab: tab.id,
      chrome: tab.id === 'friend' ? 'mobile-web' : 'app',
      file: 'screens/' + id + '.html'
    };
  }
}

const routes = {
  meta: {
    project: 'Hold & Split — BookMyShow group booking',
    device: { width: 393, height: 852, name: 'iPhone 15 Pro' },
    note: 'Screens are standalone static HTML, already cross-linked by <a href>. Navigation works inside an iframe with no router. Serve over http:// so the shell can read the active screen.'
  },
  tabs: TABS,
  screens,
  hotspots
};

fs.writeFileSync('/home/claude/handoff/routes.json', JSON.stringify(routes, null, 2));
console.log('hotspots:', hotspots.length);
console.log(hotspots.map((h) => `${h.from} → ${h.to}  (${h.label})`).join('\n'));
