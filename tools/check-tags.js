const fs = require('fs');
const h = fs.readFileSync('D:/2026AppDev/daetz-coder.github.io/index.html','utf8');
const tags = ['div','section','main','nav','footer','article','button','canvas','h1','h2','h3','h4','p','a','span','ul','li','header','aside'];
let bad = 0;
for (const t of tags){
  const o = (h.match(new RegExp('<' + t + '(\\s|>)','g'))||[]).length;
  const c = (h.match(new RegExp('</' + t + '>','g'))||[]).length;
  if(o!==c){ bad++; console.log('MISMATCH <'+t+'> open='+o+' close='+c); }
}
console.log(bad===0 ? 'TAG BALANCE OK' : bad+' mismatches');
console.log('home-layout:', (h.match(/home-layout/g)||[]).length, 'home-content:', (h.match(/home-content/g)||[]).length, 'sidebar:', (h.match(/class="sidebar"/g)||[]).length, 'crumb-nav:', (h.match(/crumb-nav/g)||[]).length);