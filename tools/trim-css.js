const fs = require('fs');
const f = 'D:/2026AppDev/daetz-coder.github.io/assets/css/site.css';
let c = fs.readFileSync(f, 'utf8');

// remove blocks: .sb-card … .sb-loc  (profile card)
let removed = [];
function cut(startMark, endMark, label) {
  const i = c.indexOf(startMark);
  if (i === -1) { removed.push(label + ': start not found'); return; }
  const j = c.indexOf(endMark, i);
  if (j === -1) { removed.push(label + ': end not found'); return; }
  c = c.slice(0, i) + c.slice(j + endMark.length);
  removed.push(label + ': cut ' + (j + endMark.length - i) + ' chars');
}

// profile card block
cut('.sb-card{', '.sb-loc svg{width:11px;height:11px;color:var(--accent)}\n', 'sb-card');
// github mini stats block (between "sb-panel h4" nav rules and "sb-panel h4" second use)
cut('.sb-mini-stats{', '.sb-mini .k{font-size:.62rem;color:var(--faint);margin-top:2px}\n', 'sb-mini');
// quick links block
cut('.sb-links{', '.sb-links a.copy-handle{cursor:pointer}\n', 'sb-links');
// cta block
cut('.sb-cta{', '.sb-cta .arr svg{width:13px;height:13px}\n', 'sb-cta');
// theme adapt rules for removed imgs
c = c.replace(/\[data-theme="dark"\] \.sb-links \.ci img\[src\*="github"\],\n/g, '');
c = c.replace(/\[data-theme="dark"\] \.sb-links \.ci img\[src\*="github"\]\n/g, '');

fs.writeFileSync(f, c, 'utf8');
console.log(removed.join('\n'));
console.log('remaining sb- classes: ' + (c.match(/\.sb-(card|head|avatar|name|handle|status|loc|mini|links|cta)/g) || []).length);
console.log('total bytes: ' + fs.statSync(f).size);