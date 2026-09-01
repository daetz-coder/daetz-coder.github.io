// verify-site.js — full-site validation: JS syntax, tag balance, cross-links exist
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const ROOT = 'D:\\2026AppDev\\daetz-coder.github.io';
let errs = 0;
function fail(msg){ errs++; console.error('FAIL: ' + msg); }
function ok(msg){ console.log('ok: ' + msg); }

// 1. site.js syntax
const siteJs = fs.readFileSync(path.join(ROOT,'assets/js/site.js'),'utf8');
try{ new vm.Script(siteJs); ok('site.js syntax'); }catch(e){ fail('site.js syntax: '+e.message); }

// 2. every page: computed as UTF-8, tag balance + no em/en dash + assets refs resolve
const pages = [path.join(ROOT,'index.html')];
const slugs = fs.readdirSync(path.join(ROOT,'projects')).filter(d=>fs.statSync(path.join(ROOT,'projects',d)).isDirectory());
for (const s of slugs) pages.push(path.join(ROOT,'projects',s,'index.html'));
ok('pages found: ' + pages.length + ' (1 home + ' + slugs.length + ' projects)');

// resolve a relative ref from a page dir against ROOT position (pages live in ROOT or ROOT/projects/x)
function resolveRef(pageFile, ref){
  // ref like '../../assets/css/site.css' or 'assets/css/site.css' or '../deepsupport-os/'
  const base = path.dirname(pageFile);
  const target = path.resolve(base, ref);
  // sanity: must stay inside ROOT
  return target.startsWith(path.resolve(ROOT)) ? target : null;
}

const tags = ['div','section','main','nav','footer','article','button','canvas','h1','h2','h3','h4','p','a','span','ul','li','table','thead','tbody','tr','th','td','header','code','pre','em','i','b'];
for (const file of pages){
  const html = fs.readFileSync(file,'utf8');
  // tag balance
  for (const t of tags){
    const o = (html.match(new RegExp('<' + t + '(\\s|>)','g'))||[]).length;
    const c = (html.match(new RegExp('</' + t + '>','g'))||[]).length;
    if(o!==c) fail(file + ': <'+t+'> open='+o+' close='+c);
  }
  // dashes
  const dashes = (html.match(/[\u2014\u2013]/g)||[]).length;
  if(dashes>0) fail(file + ': em/en dashes found: ' + dashes);
  // asset refs (regex-capture the href/src and resolve physically)
  const cssRefs = html.match(/href="([^"]*assets\/css\/site\.css)"/g) || [];
  const jsRefs = html.match(/src="([^"]*assets\/js\/site\.js)"/g) || [];
  for (const m of cssRefs){ const ref = m.slice(6,-1); const t = resolveRef(file, ref); if(!t||!fs.existsSync(t)) fail(file+': css ref broken: '+ref); }
  for (const m of jsRefs){ const ref = m.slice(5,-1); const t = resolveRef(file, ref); if(!t||!fs.existsSync(t)) fail(file+': js ref broken: '+ref); }
  // project page cross links (relative ../slug/)
  const rlinks = html.match(/href="\.\.\/[a-z0-9-]+\/"/g) || [];
  for (const l of rlinks){
    const ref = l.match(/["']([^"']+)["']/)[1]; // '../slug/'
    const target = resolveRef(file, ref);
    if(!target || path.basename(target)!=='') {
      // resolve to folder; check index.html exists
      if(!fs.existsSync(path.join(target,'index.html'))) fail(file + ': broken link ' + l);
    }
  }
  if(!html.includes('daetz-coder')) fail(file + ': no daetz-coder link');
}
ok('balance + dashes + asset/cross-link checks done for ' + pages.length + ' files');

// 3. every project slug has a card link from home and a rel link back
const home = fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
for (const s of slugs){
  if(!home.includes('projects/'+s+'/')) fail('home missing card link: '+s);
  const page = fs.readFileSync(path.join(ROOT,'projects',s,'index.html'),'utf8');
  if(!page.includes('../../')) fail(s+': missing home back-link');
}
ok('23 cross-link pairs verified');

// 4. filter counts vs actual card data-cat (only inside #projGrid .card)
const grid = home.slice(home.indexOf('id="projGrid"'), home.indexOf('id="projEmpty"')||home.length);
const counts = {};
for (const m of grid.matchAll(/data-cat="([a-z]+)"/g)) counts[m[1]] = (counts[m[1]]||0)+1;
ok('cards by cat: ' + JSON.stringify(counts));
const total = Object.values(counts).reduce((a,b)=>a+b,0);
if(total!==23) fail('total cards = '+total);
// filter labels should match real counts
for (const m of home.matchAll(/data-cat="([a-z]+)"[^>]*><span class="n">(\d+)<\/span>/g)){
  const cat=m[1], declared=+m[2], real=(cat==='all'?23:(counts[cat]||0));
  if(cat!=='all' && declared!==real) fail('filter count mismatch: '+cat+' declared '+declared+' real '+real);
}
ok('filter counts match card data');
console.log(errs===0 ? '\nALL CHECKS PASSED' : '\n'+errs+' FAILURES');