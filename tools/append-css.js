const fs = require('fs');
const file = 'D:\\2026AppDev\\daetz-coder.github.io\\assets\\css\\site.css';
const block = `
/* ============================================================
   PROJECT PAGES (projects/<slug>/index.html)
   ============================================================ */
.crumbs{display:flex;align-items:center;gap:8px;font-size:.78rem;color:var(--faint);margin-bottom:26px;flex-wrap:wrap}
.crumbs a{color:var(--dim);font-weight:600;transition:color .2s}
.crumbs a:hover{color:var(--accent)}
.crumbs svg{width:11px;height:11px;color:var(--faint)}
.crumbs .now{color:var(--accent);font-weight:700}

.proj-hero{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:40px;align-items:center;padding:0 0 46px}
.pj-eyebrow{display:inline-flex;align-items:center;gap:8px;font-size:.7rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);border:1px solid var(--accent-line);background:var(--accent-soft);padding:5px 13px;border-radius:999px;margin-bottom:16px}
.pj-eyebrow svg{width:12px;height:12px}
.pj-title{font-size:clamp(2rem,4.6vw,3rem);line-height:1.08;letter-spacing:-.02em;font-weight:800;margin-bottom:12px}
.pj-title .grad{background:linear-gradient(100deg,var(--accent) 10%,#67e8f9 55%,#34d399 100%);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent}
[data-theme="light"] .pj-title .grad{background:linear-gradient(100deg,var(--accent),#0e7490 55%,#15803d 100%);-webkit-background-clip:text;background-clip:text}
.pj-desc{color:var(--dim);font-size:1rem;line-height:1.8;max-width:52ch}
.pj-actions{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
.pj-meta{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.pj-meta span{font-size:.78rem;color:var(--dim);border:1px solid var(--line);background:var(--card);padding:5px 12px;border-radius:999px}
.pj-meta span b{color:var(--accent);font-weight:800}
.pj-meta .pill-star b{color:var(--warn)}

.pj-visual{position:relative;display:flex;justify-content:center}
.pj-frame{width:100%;max-width:430px;border-radius:var(--r-lg);background:linear-gradient(160deg,var(--card),var(--card-2));border:1px solid var(--line);padding:20px;box-shadow:var(--shadow-lg)}
.pj-frame .fw-bar{display:flex;align-items:center;gap:6px;padding-bottom:12px;border-bottom:1px solid var(--line-soft);margin-bottom:12px}
.pj-frame .fw-bar i{width:9px;height:9px;border-radius:50%;background:var(--line)}
.pj-frame .fw-bar i:first-child{background:#f87171}
.pj-frame .fw-bar i:nth-child(2){background:#fbbf24}
.pj-frame .fw-bar i:nth-child(3){background:#34d399}
.pj-frame .fw-bar span{font-family:ui-monospace,monospace;font-size:.72rem;color:var(--faint);margin-left:8px}
.pj-frame .fw-body{font-family:ui-monospace,monospace;font-size:.8rem;line-height:1.85;color:var(--dim);white-space:pre-wrap;word-break:break-all}
.pj-frame .fw-body .ok{color:var(--ok)}
.pj-frame .fw-body .ac{color:var(--accent)}
.pj-frame .fw-body .dim{color:var(--faint)}
.pj-frame .fw-body .warn{color:var(--warn)}

.prose{color:var(--dim);font-size:.96rem;line-height:1.9}
.prose p{margin-bottom:16px}
.prose b,.prose strong{color:var(--text)}
.prose h3{color:var(--text);font-size:1.06rem;font-weight:800;margin:30px 0 12px}
.prose ul{margin:0 0 16px;padding-left:20px}
.prose li{margin-bottom:7px}
.prose li::marker{color:var(--accent)}
.prose code{font-size:.86em;color:var(--accent);background:var(--accent-soft);border:1px solid var(--accent-line);padding:1px 7px;border-radius:6px}

.feat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:14px}
.feat{background:linear-gradient(165deg,var(--card),var(--card-2));border:1px solid var(--line);border-radius:var(--r-md);padding:18px;transition:transform .25s var(--ease),border-color .25s,box-shadow .25s;position:relative;overflow:hidden}
.feat::before{content:"";position:absolute;inset:0;border-radius:var(--r-md);background:radial-gradient(200px 120px at var(--mx,70%) var(--my,0%),var(--accent-soft),transparent 65%);opacity:0;transition:opacity .3s;pointer-events:none}
.feat:hover{transform:translateY(-3px);border-color:var(--accent-line);box-shadow:var(--shadow)}
.feat:hover::before{opacity:1}
.feat .fi{width:34px;height:34px;border-radius:10px;background:var(--accent-soft);border:1px solid var(--accent-line);display:grid;place-items:center;margin-bottom:11px}
.feat .fi svg{width:16px;height:16px;color:var(--accent)}
.feat h4{font-size:.93rem;font-weight:800;margin-bottom:6px;color:var(--text)}
.feat p{font-size:.82rem;color:var(--dim);line-height:1.7}

.demo-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px}
.demo-window{border:1px solid var(--line);border-radius:var(--r-md);overflow:hidden;background:var(--card);transition:transform .25s var(--ease),border-color .25s,box-shadow .25s}
.demo-window:hover{transform:translateY(-3px);border-color:var(--accent-line);box-shadow:var(--shadow)}
.demo-window .dw-bar{display:flex;align-items:center;gap:6px;padding:8px 12px;background:var(--card-2);border-bottom:1px solid var(--line-soft)}
.demo-window .dw-bar i{width:8px;height:8px;border-radius:50%;background:var(--line)}
.demo-window .dw-bar i:first-child{background:#f87171}
.demo-window .dw-bar i:nth-child(2){background:#fbbf24}
.demo-window .dw-bar i:nth-child(3){background:#34d399}
.demo-window .dw-bar span{font-size:.68rem;color:var(--faint);margin-left:6px;font-family:ui-monospace,monospace}
.demo-window .dw-body{padding:14px}
.demo-window.chat .msg{display:flex;gap:8px;margin-bottom:9px;align-items:flex-start}
.demo-window.chat .msg .av{width:22px;height:22px;border-radius:7px;background:var(--accent-soft);border:1px solid var(--accent-line);display:grid;place-items:center;flex-shrink:0;font-size:.6rem;color:var(--accent);font-weight:800}
.demo-window.chat .msg .bubble{background:var(--card-2);border:1px solid var(--line-soft);border-radius:10px 10px 10px 3px;padding:7px 10px;font-size:.72rem;color:var(--dim);line-height:1.6}
.demo-window.chat .msg.user{flex-direction:row-reverse}
.demo-window.chat .msg.user .bubble{border-radius:10px 10px 3px 10px;background:var(--accent-soft);border-color:var(--accent-line);color:var(--text)}
.demo-window.chat .msg .bubble .tag{color:var(--accent);font-weight:700}
.demo-window.console .cmd{font-family:ui-monospace,monospace;font-size:.72rem;color:var(--dim);line-height:1.9;white-space:pre-wrap}
.demo-window.console .cmd .p{color:var(--ok)}
.demo-window.console .cmd .c{color:var(--accent)}
.demo-window.console .cmd .err{color:#f87171}
.demo-window.card .dw-body{display:grid;gap:9px}
.demo-window.card .tile{background:var(--card-2);border:1px solid var(--line-soft);border-radius:9px;padding:9px 12px;display:flex;justify-content:space-between;align-items:center}
.demo-window.card .tile .t-name{font-size:.72rem;color:var(--dim)}
.demo-window.card .tile .t-val{font-size:.72rem;font-weight:800;color:var(--accent);font-variant-numeric:tabular-nums}
.demo-window.card .tile .t-st{font-size:.64rem;color:var(--ok)}

.rel-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px}
.rel-card{background:linear-gradient(165deg,var(--card),var(--card-2));border:1px solid var(--line);border-radius:var(--r-md);padding:17px;text-decoration:none;color:var(--text);display:flex;flex-direction:column;transition:transform .25s var(--ease),border-color .25s,box-shadow .25s;position:relative;overflow:hidden}
.rel-card::before{content:"";position:absolute;inset:0;border-radius:var(--r-md);background:radial-gradient(220px 130px at var(--mx,70%) var(--my,0%),var(--accent-soft),transparent 65%);opacity:0;transition:opacity .3s;pointer-events:none}
.rel-card:hover{transform:translateY(-3px);border-color:var(--accent-line);box-shadow:var(--shadow)}
.rel-card:hover::before{opacity:1}
.rel-card .rc-top{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.rel-card .rc-top h4{font-size:.95rem;font-weight:800}
.rel-card .rc-cat{font-size:.62rem;color:var(--accent);background:var(--accent-soft);border:1px solid var(--accent-line);padding:2px 8px;border-radius:999px;margin-left:auto;white-space:nowrap}
.rel-card p{font-size:.8rem;color:var(--dim);line-height:1.65;flex:1}
.rel-card .rc-go{font-size:.75rem;color:var(--accent);font-weight:700;display:inline-flex;align-items:center;gap:5px;margin-top:10px}
.rel-card .rc-go svg{width:11px;height:11px}

.pj-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:8px 0 6px}
@media (max-width:900px){
  .proj-hero{grid-template-columns:1fr;gap:28px}
  .pj-stats{grid-template-columns:repeat(2,1fr)}
}
@media (max-width:680px){
  .pj-stats{grid-template-columns:repeat(2,1fr)}
}
`;
fs.appendFileSync(file, block, 'utf8');
console.log('appended project-page css, total bytes: ' + fs.statSync(file).size);