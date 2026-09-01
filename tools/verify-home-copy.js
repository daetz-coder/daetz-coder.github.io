// verify-home-copy.js — validate the mirrored homepage/ tree links resolve
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = 'D:\\2026AppDev\\daetz-coder.github.io\\homepage';
let errs = 0;
const fail = m => { errs++; console.error('FAIL: '+m); };

// index.html asset refs and project links
const home = fs.readFileSync(path.join(ROOT,'index.html'),'utf8');
for (const m of home.matchAll(/(?:href|src)="([^"]+)"/g)){
  const ref = m[1];
  if(!ref || ref.startsWith('http') || ref.startsWith('#') || ref.startsWith('data:') || ref.startsWith('mailto:')) continue;
  const target = path.resolve(ROOT, ref);
  if(!target.startsWith(ROOT)) continue;
  const exists = fs.existsSync(target) || fs.existsSync(target.replace(/\/$/,'')) || fs.existsSync(path.join(target,'index.html'));
  if(!exists) fail('home copy broken ref: '+ref);
}
// each project page: relative ../ and ../../ resolve within homepage/
const slugs = fs.readdirSync(path.join(ROOT,'projects')).filter(d=>fs.statSync(path.join(ROOT,'projects',d)).isDirectory());
for (const s of slugs){
  const file = path.join(ROOT,'projects',s,'index.html');
  const html = fs.readFileSync(file,'utf8');
  for (const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){
    const ref = m[1];
    if(!ref || ref.startsWith('http') || ref.startsWith('#') || ref.startsWith('data:') || ref.startsWith('mailto:') || ref.includes('#')) continue;
  const target = path.resolve(path.dirname(file), ref);
    if(!target.startsWith(ROOT)){ /* going above homepage/ -> that's intended for git? no: project pages should stay inside */ fail(s+': escapes homepage root: '+ref); continue; }
    const exists = fs.existsSync(target) || fs.existsSync(path.join(target,'index.html'));
    if(!exists) fail(s+': broken ref '+ref);
  }
}
console.log(errs===0 ? 'HOMEPAGE MIRROR OK ('+slugs.length+' projects)' : errs+' FAILURES');