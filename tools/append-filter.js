const fs = require('fs');
const f = 'D:/2026AppDev/daetz-coder.github.io/assets/css/site.css';
let css = fs.readFileSync(f, 'utf8');
const add = `
/* brand glyph theme adapt */
[data-theme="dark"] .sb-links .ci img[src*="github"],
[data-theme="dark"] .contact .ci-ico img[src*="github"]{filter:invert(1) brightness(.9)}
[data-theme="dark"] .ch-head .logo img[src*="github"]{filter:invert(1) brightness(.9)}
`;
css += add;
fs.writeFileSync(f, css, 'utf8');
console.log('appended theme img filter, total: ' + css.length);