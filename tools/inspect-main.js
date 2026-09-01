const fs = require('fs');
const h = fs.readFileSync('D:/2026AppDev/daetz-coder.github.io/index.html','utf8');
const t = h.slice(h.indexOf('id="contact"'), h.indexOf('</footer>'));
const sectEnd = t.lastIndexOf('</section>');
console.log(JSON.stringify(t.slice(sectEnd, sectEnd + 120)));
console.log('--- after </main>: ---');
const m = h.indexOf('</main>');
console.log(JSON.stringify(h.slice(m - 60, m + 30)));