const fs = require('fs');
const f = 'D:/2026AppDev/daetz-coder.github.io/assets/css/site.css';
let c = fs.readFileSync(f, 'utf8');

// 1. brand-mark: gradient square + serif-ish italic d
c = c.replace(
  '.brand-mark{width:26px;height:26px;border-radius:8px;display:grid;place-items:center;background:linear-gradient(135deg,var(--accent),#0e7490);color:#04121a;font-family:ui-monospace,monospace;font-size:.72rem;font-weight:800;box-shadow:0 0 16px var(--accent-line)}',
  '.brand-mark{width:28px;height:28px;border-radius:9px;display:grid;place-items:center;background:linear-gradient(135deg,var(--accent),#34d399 60%,#0e7490);color:#04121a;font-family:ui-monospace,monospace;font-size:.95rem;font-weight:800;font-style:italic;letter-spacing:-.02em;box-shadow:0 0 18px var(--accent-line),inset 0 1px 0 rgba(255,255,255,.25)}'
);

// 2. gh-icon svg colors: dim in sidebar/logo, text-colored in contact; dark-mode self-adapts via currentColor
c = c.replace(
  '.sb-links a .ci svg{width:13px;height:13px;color:var(--accent)}',
  '.sb-links a .ci svg{width:14px;height:14px;color:var(--dim)}\n.sb-links a:hover .ci svg{color:var(--accent)}'
);
// ch-head logo svg size
if (!c.includes('.ch-head .logo svg')) {
  c = c.replace(
    '.ch-head .logo img{width:22px;height:22px}',
    '.ch-head .logo img{width:22px;height:22px}\n.ch-head .logo svg{width:22px;height:22px;color:var(--text)}'
  );
}
// contact ci-ico svg already styled (17px accent) — but gh-icon should be text-colored
if (!c.includes('.contact .ci-ico svg.gh-icon')) {
  c = c.replace(
    '.contact .ci-ico svg{width:17px;height:17px;color:var(--accent)}',
    '.contact .ci-ico svg{width:17px;height:17px;color:var(--accent)}\n.contact .ci-ico svg.gh-icon{color:var(--text)}'
  );
}
// 3. remove inverted dark filter for github imgs (now inline SVG uses currentColor)
c = c.replace(/\/\* brand glyph theme adapt \*\/[\s\S]*?\n\n/, '');

fs.writeFileSync(f, c, 'utf8');
console.log('patched brand-mark + icon svg css; total bytes: ' + fs.statSync(f).size);