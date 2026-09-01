const fs = require('fs');
const file = 'D:\\2026AppDev\\daetz-coder.github.io\\assets\\css\\site.css';
const block = `
/* ============================================================
   HOME LAYOUT: sidebar + breadcrumb
   ============================================================ */
.home-layout{display:grid;grid-template-columns:250px minmax(0,1fr);gap:34px;align-items:start;padding-top:10px}
.home-content{min-width:0}

/* ---- 面包屑 ---- */
.crumb-nav{
  display:flex;align-items:center;gap:9px;font-size:.78rem;color:var(--faint);
  padding:10px 0 4px;margin-bottom:14px;flex-wrap:wrap;
}
.crumb-nav a{color:var(--dim);font-weight:600;transition:color .2s}
.crumb-nav a:hover{color:var(--accent)}
.crumb-nav svg{width:11px;height:11px;color:var(--faint);flex-shrink:0}
.crumb-nav .now{color:var(--accent);font-weight:700}
.crumb-nav .live-dot{width:5px;height:5px;border-radius:50%;background:var(--ok);box-shadow:0 0 6px var(--ok);animation:pulse 2.2s infinite;margin-left:2px}

/* ---- 侧边栏 ---- */
.sidebar{position:sticky;top:calc(var(--nav-h) + 18px);display:flex;flex-direction:column;gap:14px}
.sb-card{
  background:linear-gradient(165deg,var(--card),var(--card-2));
  border:1px solid var(--line);border-radius:var(--r-lg);padding:18px;
  box-shadow:var(--shadow);position:relative;overflow:hidden;
}
.sb-card::before{content:"";position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,var(--accent),#34d399)}
.sb-head{display:flex;align-items:center;gap:12px;margin-bottom:12px}
.sb-avatar{width:52px;height:52px;border-radius:15px;overflow:hidden;border:2px solid var(--accent-line);flex-shrink:0}
.sb-avatar img{width:100%;height:100%;object-fit:cover;display:block}
.sb-name{font-size:1.05rem;font-weight:800;line-height:1.2}
.sb-handle{font-family:ui-monospace,monospace;font-size:.74rem;color:var(--accent)}
.sb-status{display:inline-flex;align-items:center;gap:7px;font-size:.76rem;color:var(--ok);font-weight:600;margin-bottom:10px}
.sb-status .dot{width:6px;height:6px;border-radius:50%;background:var(--ok);box-shadow:0 0 6px var(--ok);animation:pulse 2.2s infinite}
.sb-loc{font-size:.76rem;color:var(--dim);display:flex;align-items:center;gap:5px}
.sb-loc svg{width:11px;height:11px;color:var(--accent)}

.sb-panel{background:var(--card);border:1px solid var(--line);border-radius:var(--r-md);padding:14px 16px}
.sb-panel h4{font-size:.68rem;font-weight:700;color:var(--faint);letter-spacing:.14em;text-transform:uppercase;margin-bottom:10px}
.sb-nav{display:flex;flex-direction:column;gap:2px}
.sb-nav a{
  display:flex;align-items:center;gap:9px;color:var(--dim);font-size:.86rem;font-weight:600;
  padding:7px 10px;border-radius:9px;text-decoration:none;transition:color .2s,background .2s;
  border-left:2px solid transparent;
}
.sb-nav a svg{width:14px;height:14px;color:var(--faint);transition:color .2s}
.sb-nav a:hover{color:var(--accent);background:var(--accent-soft)}
.sb-nav a:hover svg{color:var(--accent)}
.sb-nav a.active{color:var(--accent);background:var(--accent-soft);border-left-color:var(--accent)}
.sb-nav a.active svg{color:var(--accent)}
.sb-nav .sb-num{font-size:.68rem;color:var(--faint);margin-left:auto;font-variant-numeric:tabular-nums}

.sb-mini-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}
.sb-mini{border:1px solid var(--line-soft);background:var(--card-2);border-radius:9px;padding:9px 6px;text-align:center}
.sb-mini .v{font-size:1rem;font-weight:800;color:var(--accent);font-variant-numeric:tabular-nums;line-height:1.15}
.sb-mini .k{font-size:.62rem;color:var(--faint);margin-top:2px}

.sb-links{display:flex;flex-direction:column;gap:2px}
.sb-links a{display:flex;align-items:center;gap:9px;color:var(--dim);font-size:.82rem;font-weight:600;padding:6px 8px;border-radius:8px;text-decoration:none;transition:color .2s,background .2s}
.sb-links a:hover{color:var(--accent);background:var(--accent-soft)}
.sb-links a .ci{width:24px;height:24px;border-radius:7px;background:var(--card-2);border:1px solid var(--line);display:grid;place-items:center;flex-shrink:0}
.sb-links a .ci img{width:13px;height:13px}
.sb-links a .ci svg{width:13px;height:13px;color:var(--accent)}
.sb-links a .go{margin-left:auto;font-size:.68rem;color:var(--faint)}
.sb-links a.copy-handle{cursor:pointer}

.sb-cta{
  display:flex;align-items:center;justify-content:space-between;gap:10px;
  text-decoration:none;color:var(--text);padding:13px 16px;border-radius:var(--r-md);
  background:linear-gradient(135deg,var(--accent-soft),transparent 130%);border:1px solid var(--accent-line);
  transition:transform .22s var(--ease),box-shadow .22s;
}
.sb-cta:hover{transform:translateY(-2px);box-shadow:0 8px 26px rgba(0,0,0,.22)}
.sb-cta .t{font-size:.84rem;font-weight:700;line-height:1.35}
.sb-cta .t small{display:block;font-size:.68rem;color:var(--faint);font-weight:500;margin-top:2px}
.sb-cta .arr{width:28px;height:28px;border-radius:50%;background:var(--accent);color:#04121a;display:grid;place-items:center;flex-shrink:0}
.sb-cta .arr svg{width:13px;height:13px}

/* ---- 响应式 ---- */
@media (max-width:1080px){
  .home-layout{grid-template-columns:215px minmax(0,1fr);gap:24px}
}
@media (max-width:900px){
  .home-layout{grid-template-columns:1fr}
  .sidebar{display:none}
  .crumb-nav{margin-top:8px}
}
`;
fs.appendFileSync(file, block, 'utf8');
console.log('appended sidebar/crumb css, total bytes: ' + fs.statSync(file).size);