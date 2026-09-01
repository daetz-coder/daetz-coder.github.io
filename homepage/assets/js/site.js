
(function(){
  "use strict";
  var root=document.documentElement;
  var prefersReduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var prefersDark=matchMedia('(prefers-color-scheme: dark)').matches;

  /* ===== 主题 ===== */
  var stored=null;
  try{stored=localStorage.getItem('daetz-theme');}catch(e){}
  var theme=stored||(prefersDark?'dark':'light');
  root.setAttribute('data-theme',theme);
  syncIcons(theme);
  function syncIcons(t){
    var sun=document.getElementById('iconSun'),moon=document.getElementById('iconMoon');
    if(t==='dark'){sun.style.display='';moon.style.display='none';}
    else{sun.style.display='none';moon.style.display='';}
    var mc=document.querySelector('meta[name="theme-color"]');
    if(mc)mc.setAttribute('content',t==='dark'?'#0b1017':'#f6f8fb');
  }
  var themeBtn=document.getElementById('themeBtn');
  if(themeBtn)themeBtn.addEventListener('click',function(){
    var t=root.getAttribute('data-theme')==='dark'?'light':'dark';
    root.setAttribute('data-theme',t);
    syncIcons(t);
    try{localStorage.setItem('daetz-theme',t);}catch(e){}
    if(net&&net.themeColor)net.themeColor=t;
  });

  /* ===== 移动菜单 ===== */
  var menu=document.getElementById('mobileMenu');
  var menuBtn=document.getElementById('menuBtn');
  var mmClose=document.getElementById('mmClose');
  function openMenu(){menu.classList.add('open');menuBtn.setAttribute('aria-label','关闭菜单');}
  function closeMenu(){menu.classList.remove('open');menuBtn.setAttribute('aria-label','打开菜单');}
  if(menuBtn)menuBtn.addEventListener('click',function(){menu.classList.contains('open')?closeMenu():openMenu();});
  if(mmClose)mmClose.addEventListener('click',closeMenu);
  if(menu)menu.addEventListener('click',function(e){if(e.target.tagName==='A')closeMenu();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeMenu();});
  window.addEventListener('resize',function(){if(innerWidth>680)closeMenu();});

  /* ===== Reveal 动画 ===== */
  var revealEls=document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window&&!prefersReduced){
    var ro=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){en.target.classList.add('in');ro.unobserve(en.target);}
      });
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    revealEls.forEach(function(el){ro.observe(el);});
  }else{
    revealEls.forEach(function(el){el.classList.add('in');});
  }

  /* ===== 数字计数动画 ===== */
  var counters=document.querySelectorAll('[data-count]');
  function animateCount(el){
    var raw=el.getAttribute('data-count');
    var target=parseFloat(raw.replace(/,/g,''));
    var hasComma=raw.indexOf(',')>-1;
    var dur=1100,t0=null;
    function ease(t){return 1-Math.pow(1-t,3);}
    function fmt(n){
      var v=Math.round(n);
      return hasComma?v.toLocaleString('en-US'):String(v);
    }
    function step(ts){
      if(!t0)t0=ts;
      var p=Math.min((ts-t0)/dur,1);
      el.textContent=fmt(target*ease(p));
      if(p<1)requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if(!prefersReduced&&'IntersectionObserver' in window){
    var co=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){animateCount(en.target);co.unobserve(en.target);}
      });
    },{threshold:.6});
    counters.forEach(function(el){co.observe(el);});
  }else{
    counters.forEach(function(el){el.textContent=el.getAttribute('data-count');});
  }

  /* ===== 打字机效果 ===== */
  var typedEl=document.getElementById('typed');
  if(typedEl){
    var roles=['Agent 系统工程','Hybrid RAG 工具链','LLM-as-Judge 评估','DSH 生态插件','Few-Shot 与信号识别'];
    if(prefersReduced){typedEl.textContent=roles[0];}
    else{
      var ri=0,ci=0,del=false;
      function tick(){
        var word=roles[ri];
        ci=del?ci-1:ci+1;
        typedEl.textContent=word.slice(0,ci);
        var delay=del?38:78;
        if(!del&&ci===word.length){del=true;delay=1900;}
        else if(del&&ci===0){del=false;ri=(ri+1)%roles.length;delay=420;}
        setTimeout(tick,delay);
      }
      setTimeout(tick,900);
    }
  }

  /* ===== Hero 粒子背景 ===== */
  var canvas=document.getElementById('net');
  var net=null;
  if(canvas&&!prefersReduced){
    var ctx=canvas.getContext('2d');
    var W,H,parts=[],themeColor=theme;
    var DPR=Math.min(devicePixelRatio||1,2);
    function resize(){
      W=canvas.clientWidth;H=canvas.clientHeight;
      canvas.width=W*DPR;canvas.height=H*DPR;
      ctx.setTransform(DPR,0,0,DPR,0,0);
      var n=Math.min(72,Math.floor(W/16));
      parts=[];
      for(var i=0;i<n;i++){
        parts.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.28,vy:(Math.random()-.5)*.28,r:Math.random()*1.6+.8});
      }
    }
    function draw(){
      ctx.clearRect(0,0,W,H);
      var c=themeColor==='dark'?'34,211,238':'14,116,144';
      for(var i=0;i<parts.length;i++){
        var p=parts[i];
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<0||p.x>W)p.vx*=-1;
        if(p.y<0||p.y>H)p.vy*=-1;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle='rgba('+c+',.5)';ctx.fill();
        for(var j=i+1;j<parts.length;j++){
          var q=parts[j],dx=p.x-q.x,dy=p.y-q.y,d=dx*dx+dy*dy;
          if(d<110*110){
            ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(q.x,q.y);
            ctx.strokeStyle='rgba('+c+','+(0.10*(1-d/(12100)))+')';ctx.lineWidth=1;ctx.stroke();
          }
        }
      }
    }
    var visible=true;
    if('IntersectionObserver' in window){
      visible=false;
      var io=new IntersectionObserver(function(en){visible=en[0].isIntersecting;},{threshold:0});
      io.observe(canvas);
    }
    function loop(){
      if(visible)draw();
      requestAnimationFrame(loop);
    }
    resize();
    window.addEventListener('resize',resize,{passive:true});
    loop();
    net={themeColor:themeColor,resize:resize};
  }

  /* ===== 卡片光斑跟随 ===== */
  var spotEls=document.querySelectorAll('.card, .feat, .rel-card');
  spotEls.forEach(function(card){
    card.addEventListener('pointermove',function(e){
      var r=card.getBoundingClientRect();
      card.style.setProperty('--mx',(e.clientX-r.left)+'px');
      card.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
  });
  var idCard=document.getElementById('idCard');
  if(idCard){
    idCard.addEventListener('pointermove',function(e){
      var r=idCard.getBoundingClientRect();
      idCard.style.setProperty('--mx',(e.clientX-r.left)+'px');
      idCard.style.setProperty('--my',(e.clientY-r.top)+'px');
    });
  }

  /* ===== 项目筛选 ===== */
  var filters=document.querySelectorAll('.filter');
  var cards=document.querySelectorAll('#projGrid .card');
  var projEmpty=document.getElementById('projEmpty');
  filters.forEach(function(btn){
    btn.addEventListener('click',function(){
      filters.forEach(function(b){b.classList.remove('active');b.setAttribute('aria-selected','false');});
      btn.classList.add('active');btn.setAttribute('aria-selected','true');
      var cat=btn.getAttribute('data-cat');
      var visible=0;
      cards.forEach(function(card){
        var show=cat==='all'||card.getAttribute('data-cat')===cat;
        card.classList.toggle('hide',!show);
        if(show){visible++;card.classList.remove('in');void card.offsetWidth;card.classList.add('in');}
      });
      if(projEmpty)projEmpty.classList.toggle('show',visible===0);
    });
  });

  /* ===== 进度条 / 回到顶部 ===== */
  var progressBar=document.querySelector('#progress i');
  var toTop=document.getElementById('toTop');
  var ring=toTop?toTop.querySelector('.ring circle'):null;
  var CIRC=2*Math.PI*24;
  if(ring)ring.style.strokeDasharray=CIRC;
  var ticking=false;
  function onScroll(){
    var st=scrollY,
        max=document.documentElement.scrollHeight-innerHeight,
        p=max>0?Math.min(st/max,1):0;
    if(progressBar)progressBar.style.width=(p*100)+'%';
    if(ring)ring.style.strokeDashoffset=CIRC*(1-p);
    if(toTop)toTop.classList.toggle('show',st>520);
    ticking=false;
  }
  window.addEventListener('scroll',function(){
    if(!ticking){requestAnimationFrame(onScroll);ticking=true;}
  },{passive:true});
  if(toTop)toTop.addEventListener('click',function(){scrollTo({top:0,behavior:prefersReduced?'auto':'smooth'});});
  onScroll();

  /* ===== 导航高亮 + 侧边栏导航 + 面包屑 ===== */
  var navLinks=document.querySelectorAll('.nav a[href^="#"]:not(.brand), .mobile-menu a, .sb-nav a');
  var crumbNow=document.getElementById('crumbNow');
  var crumbMap={focus:'简介',projects:'项目精选 · 23 个作品',blog:'技术博客',platforms:'全平台足迹',now:'最近在做',stack:'技术栈',contact:'联系'};
  if('IntersectionObserver' in window){
    var ids=['focus','projects','blog','platforms','now','stack','contact'];
    var secs=ids.map(function(id){return document.getElementById(id);}).filter(Boolean);
    var io2=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){
          navLinks.forEach(function(a){
            a.classList.toggle('active',a.getAttribute('href')==='#'+en.target.id);
          });
          if(crumbNow&&crumbMap[en.target.id])crumbNow.textContent=crumbMap[en.target.id];
        }
      });
    },{rootMargin:'-40% 0px -55% 0px'});
    secs.forEach(function(s){io2.observe(s);});
  }

  /* ===== 复制 ===== */
  var toast=document.getElementById('toast');
  var toastTimer=null;
  function showToast(msg){
    if(!toast)return;
    toast.querySelector('span').textContent=msg||'已复制到剪贴板';
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer=setTimeout(function(){toast.classList.remove('show');},1800);
  }
  function copyText(txt){
    if(navigator.clipboard&&navigator.clipboard.writeText){
      return navigator.clipboard.writeText(txt).then(function(){return true;}).catch(function(){return false;});
    }
    var ta=document.createElement('textarea');
    ta.value=txt;ta.style.position='fixed';ta.style.opacity='0';
    document.body.appendChild(ta);ta.select();
    var ok=false;
    try{ok=document.execCommand('copy');}catch(e){}
    document.body.removeChild(ta);
    return Promise.resolve(ok);
  }
  var copyEls=document.querySelectorAll('[data-copy]');
  copyEls.forEach(function(el){
    el.addEventListener('click',function(e){
      e.preventDefault();e.stopPropagation();
      var txt=el.getAttribute('data-copy');
      copyText(txt).then(function(ok){showToast(ok?'已复制：'+txt:'复制失败');});
    });
  });

  /* ===== 实时 GitHub / npm 数据（仅主页含数据元素时执行） ===== */
  var hasGhLive=document.getElementById('ghRepos')||document.getElementById('chRepos');
  function fmtN(n){return (n==null)?'0':n.toLocaleString('en-US');}
  function applyGithub(u,repos){
    var stars=repos.reduce(function(s,r){return s+(r.stargazers_count||0);},0);
    var followers=u?u.followers:null;
    var reposN=Array.isArray(repos)?repos.length:(u?u.public_repos:null);
    var map={
      ghRepos:reposN,ghStars:stars,ghFollowers:followers,
      chRepos:reposN,chStars:stars,chFollowers:followers,
      sbRepos:reposN,sbStars:stars,sbFollowers:followers
    };
    Object.keys(map).forEach(function(id){
      var el=document.getElementById(id);
      if(el&&map[id]!=null)el.textContent=fmtN(map[id]);
    });
    if(u&&u.bio){var bio=document.getElementById('ghBio');if(bio)bio.textContent=u.bio;}
    if(u&&u.public_repos){var rm=document.getElementById('ghRepoMeta');if(rm)rm.innerHTML='<b>'+u.public_repos+'</b> 公开仓库';}
    var av=document.getElementById('ghAvatar');
    if(av&&u&&u.avatar_url)av.src=u.avatar_url+'?s=160';
    var av2=document.querySelector('.sb-avatar img');
    if(av2&&u&&u.avatar_url)av2.src=u.avatar_url+'?s=96';
  }
  function loadGithub(){
    var cache=null;
    try{cache=JSON.parse(localStorage.getItem('daetz-gh'));}catch(e){}
    if(cache&&Date.now()-cache.t<15*60*1000){
      applyGithub(cache.u,cache.repos);
      return;
    }
    Promise.all([
      fetch('https://api.github.com/users/daetz-coder').then(function(r){return r.ok?r.json():null;}).catch(function(){return null;}),
      fetch('https://api.github.com/users/daetz-coder/repos?per_page=100&sort=updated').then(function(r){return r.ok?r.json():null;}).catch(function(){return null;})
    ]).then(function(res){
      var u=res[0],repos=res[1];
      if(u||repos){
        applyGithub(u,repos);
        try{localStorage.setItem('daetz-gh',JSON.stringify({t:Date.now(),u:u,repos:repos}));}catch(e){}
      }
    });
  }
  if(hasGhLive)loadGithub();

  /* npm 实时版本 */
  if(document.getElementById('npmVer')||document.getElementById('chNpmVer')){
    fetch('https://registry.npmjs.org/dsh-multi-chat/latest').then(function(r){return r.ok?r.json():null;}).then(function(d){
      if(d&&d.version){
        ['npmVer','chNpmVer'].forEach(function(id){
          var el=document.getElementById(id);
          if(el)el.textContent=d.version;
        });
      }
    }).catch(function(){});
  }
})();
