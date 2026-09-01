const fs = require('fs');
const f = 'D:/2026AppDev/daetz-coder.github.io/assets/css/site.css';
let c = fs.readFileSync(f, 'utf8');
const block = `/* brand glyph theme adapt */
[data-theme="dark"] .sb-links .ci img[src*="github"],
[data-theme="dark"] .contact .ci-ico img[src*="github"]{filter:invert(1) brightness(.9)}
[data-theme="dark"] .ch-head .logo img[src*="github"]{filter:invert(1) brightness(.9)}
`;
if (c.includes(block)) {
  c = c.replace(block, '');
  fs.writeFileSync(f, c, 'utf8');
  console.log('removed stale dark filter block');
} else {
  console.log('block not found exactly; manual inspect needed');
}
console.log('still contains adapt:', c.includes('brand glyph theme adapt'));