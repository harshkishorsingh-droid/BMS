/* Flattens Design-canvas .dc.html artboards into standalone static HTML screens. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SRC = '/home/claude/bms/project';
const OUT = '/home/claude/handoff/screens';

const RENAME = { 'Main': 'A1' };

function screenName(file) {
  const stem = path.basename(file, '.dc.html');
  return RENAME[stem] || stem;
}

function getVals(src) {
  const scriptMatch = src.match(/<script type="text\/x-dc" data-dc-script data-props='([\s\S]*?)'>([\s\S]*?)<\/script>/);
  if (!scriptMatch) return {};
  const props = JSON.parse(scriptMatch[1].replace(/&amp;/g, '&').replace(/&#39;/g, "'"));
  const body = scriptMatch[2];
  const defaults = {};
  for (const [k, v] of Object.entries(props)) {
    if (k !== '$preview' && v && typeof v === 'object' && 'default' in v) defaults[k] = v.default;
  }
  const sandbox = { module: {}, console };
  sandbox.DCLogic = class DCLogic {
    constructor(p) { this.props = p || {}; this.state = undefined; }
    setState() {}
  };
  vm.createContext(sandbox);
  vm.runInContext(body + '\n;module.exports = Component;', sandbox);
  const C = sandbox.module.exports;
  const inst = new C(defaults);
  inst.props = defaults;
  return inst.renderVals() || {};
}

function lookup(scope, pathStr) {
  const p = pathStr.trim();
  if (p === 'true') return true;
  if (p === 'false') return false;
  let cur = scope;
  for (const seg of p.split('.')) {
    if (cur === undefined || cur === null) return undefined;
    cur = cur[seg];
  }
  return cur;
}

/* Find the matching close tag for a block element starting at `open` index. */
function matchBlock(html, tag, startIdx) {
  const openRe = new RegExp(`<${tag}\\b`, 'g');
  const closeTag = `</${tag}>`;
  let depth = 0;
  let i = startIdx;
  while (i < html.length) {
    openRe.lastIndex = i;
    const nextOpen = openRe.exec(html);
    const nextClose = html.indexOf(closeTag, i);
    if (nextClose === -1) throw new Error(`unclosed <${tag}>`);
    if (nextOpen && nextOpen.index < nextClose) {
      depth++;
      i = nextOpen.index + tag.length + 1;
    } else {
      depth--;
      if (depth === 0) return { contentEnd: nextClose, blockEnd: nextClose + closeTag.length };
      i = nextClose + closeTag.length;
    }
  }
  throw new Error(`unclosed <${tag}>`);
}

function expand(html, scope) {
  const forIdx = html.search(/<sc-for\b/);
  const ifIdx = html.search(/<sc-if\b/);
  if (forIdx === -1 && ifIdx === -1) return fillHoles(html, scope);

  const useFor = forIdx !== -1 && (ifIdx === -1 || forIdx < ifIdx);
  const tag = useFor ? 'sc-for' : 'sc-if';
  const start = useFor ? forIdx : ifIdx;

  const tagEnd = html.indexOf('>', start);
  const attrs = html.slice(start, tagEnd);
  const { contentEnd, blockEnd } = matchBlock(html, tag, start);
  const inner = html.slice(tagEnd + 1, contentEnd);

  const before = fillHoles(html.slice(0, start), scope);
  const after = expand(html.slice(blockEnd), scope);

  let middle = '';
  if (useFor) {
    const listPath = /list="\{\{([^}]*)\}\}"/.exec(attrs)[1];
    const asName = /as="([^"]*)"/.exec(attrs)[1];
    const items = lookup(scope, listPath) || [];
    items.forEach((item, idx) => {
      const child = Object.assign({}, scope);
      child[asName] = item;
      child['$index'] = idx;
      middle += expand(inner, child);
    });
  } else {
    const valPath = /value="\{\{([^}]*)\}\}"/.exec(attrs)[1];
    if (lookup(scope, valPath)) middle = expand(inner, scope);
  }
  return before + middle + after;
}

const DROP_ATTRS = ['onClick', 'onChange', 'onInput', 'onSubmit'];

function fillHoles(html, scope) {
  // drop event handler attributes bound to holes
  for (const a of DROP_ATTRS) {
    html = html.replace(new RegExp(`\\s${a}="\\{\\{[^}]*\\}\\}"`, 'g'), '');
  }
  // boolean attributes
  html = html.replace(/\sdisabled="\{\{([^}]*)\}\}"/g, (m, p) => (lookup(scope, p) ? ' disabled' : ''));
  // remaining holes
  return html.replace(/\{\{([^}]*)\}\}/g, (m, p) => {
    const v = lookup(scope, p);
    if (v === undefined || v === null || typeof v === 'function') return '';
    return String(v);
  });
}

function build(file) {
  const src = fs.readFileSync(path.join(SRC, file), 'utf8');
  const vals = getVals(src);

  const title = (/<title>([\s\S]*?)<\/title>/.exec(src) || [, 'Screen'])[1];
  const helmet = (/<helmet>([\s\S]*?)<\/helmet>/.exec(src) || [, ''])[1];
  let body = (/<x-dc>([\s\S]*?)<\/x-dc>/.exec(src) || [, ''])[1];
  body = body.replace(/<helmet>[\s\S]*?<\/helmet>/, '');

  body = expand(body, vals);

  // rewrite artboard links to flat screen files
  body = body.replace(/href="([A-Za-z0-9_]+)\.dc\.html"/g, (m, stem) => `href="${RENAME[stem] || stem}.html"`);

  const out = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=393, initial-scale=1">
<title>${title}</title>
${helmet.trim()}
<style>
html,body{margin:0;padding:0;width:393px;height:852px;overflow:hidden}
*{-webkit-tap-highlight-color:transparent}
a{text-decoration:none}
</style>
</head>
<body data-screen="${screenName(file)}">
${body.trim()}
</body>
</html>
`;
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, screenName(file) + '.html'), out);
  return screenName(file);
}

const files = fs.readdirSync(SRC).filter((f) => f.endsWith('.dc.html'));
const made = [];
for (const f of files) {
  try {
    made.push(build(f));
  } catch (e) {
    console.error('FAIL', f, e.message);
  }
}
console.log('built', made.length, made.sort().join(' '));
