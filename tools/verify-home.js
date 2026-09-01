const fs = require('fs');
const h = fs.readFileSync('D:/2026AppDev/daetz-coder.github.io/index.html', 'utf8');
const out = {
  sbNavKept: h.includes('class="sb-nav"'),
  sbPanelKept: h.includes('sb-panel'),
  bioLine: h.includes('Agent Engineering · NIDS · AMC · Few-Shot Learning · SLAM'),
  idBioPresent: h.includes('id-bio'),
  crumbKept: h.includes('crumb-nav'),
  sidebarSingle: (h.match(/<aside/g)||[]).length === 1 && (h.match(/<\/aside>/g)||[]).length === 1,
  canvasGone: !h.includes('<canvas id="net"'),
  noSbCard: !h.includes('sb-card'),
  noSbCta: !h.includes('sb-cta'),
  noSbLinks: !h.includes('sb-links'),
  heroHasIdCard: h.includes('id-card')
};
for (const k of Object.keys(out)) console.log(k + ': ' + out[k]);