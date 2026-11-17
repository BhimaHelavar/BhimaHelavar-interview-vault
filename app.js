const PAGES=[
["angular-lessons.html","Angular lessons (full course)","Components, signals, RxJS, routing, forms, security","Lesson courses"],
["csharp-lessons.html","C# and .NET lessons (full course)","Runtime, memory, async, LINQ, modern C#","Lesson courses"],
["csharp-modern.html","Modern C# (C# 9 to 14)","Records, primary constructors, collection expressions, field keyword, patterns, nullable","Lesson courses"],
["csharp-best-practices.html","C# best practices","Standards, clean code, pitfalls, performance, logging, testing, analyzers, debugging","Lesson courses"],
["webapi-lessons.html","Web API lessons (full course)","Pipeline, REST, validation, versioning, idempotency, security","Lesson courses"],
["sql-lessons.html","SQL lessons (full course)","Joins, NULL, window functions, indexes, plans, procedures","Lesson courses"],
["ng-testing-lessons.html","Angular testing lessons (full course)","TestBed, mocks, HTTP, async, signals, forms, Playwright","Lesson courses"],
["ent-dotnet.html","Enterprise .NET lessons","Auth, caching, queues, EF Core, logging, CI/CD","Enterprise daily lessons"],
["ent-angular.html","Enterprise Angular lessons","HTTP layer, grids, state, micro frontends, forms, real-time","Enterprise daily lessons"],
["ent-database.html","Enterprise database lessons","Transactions, concurrency, indexing, schema, migrations, scaling","Enterprise daily lessons"],
["system-design-concepts.html","30 system design concepts","DNS to CAP, caching, sharding, queues, rate limiting, idempotency (20 lessons)","System design, DSA and Azure"],
["dsa-patterns.html","15 coding patterns in C#","Two pointers, sliding window, heaps, BFS/DFS, backtracking, dynamic programming","System design, DSA and Azure"],
["design-study/index.html","System design with a real app","HLD, LLD, database, API, NFRs, security, patterns, interview kit","System design, DSA and Azure"],
["azure-study/index.html","Azure for .NET developers","App Service, SQL, secrets, CI/CD, Bicep, monitoring, cost, interview Q&A","System design, DSA and Azure"],
["angular.html","Angular","Core concepts, signals, DI, RxJS, performance","Quick revision Q&A"],
["angular-testing.html","Angular unit testing","Vitest/Jasmine, TestBed, mocks, async, signals","Quick revision Q&A"],
["dotnet-core.html",".NET Core and C#","Runtime, async, memory, language features","Quick revision Q&A"],
["dotnet-webapi.html",".NET Web API","REST design, validation, auth, versioning, errors","Quick revision Q&A"],
["dotnet-enterprise.html",".NET in enterprise apps","Layers, logging, config, resilience, background work","Quick revision Q&A"],
["sql-basics.html","SQL fundamentals","Joins, grouping, keys, constraints, NULL","Quick revision Q&A"],
["sql-practice.html","SQL query practice","Real problems with solutions and reasoning","Quick revision Q&A"],
["db-concepts.html","Database interview concepts","Indexes, transactions, isolation, scaling","Quick revision Q&A"],
["claude-code-interview.html","Claude Code interview questions","What interviewers ask and how to answer","Quick revision Q&A"],
["claude-code-concepts.html","Claude Code concepts","How the agent, memory, tools and safety work","Quick revision Q&A"],
["claude-code-daily.html","Claude Code daily use","Workflows, prompts, review, team habits","Quick revision Q&A"]
];
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const inl=s=>esc(s).replace(/`([^`]+)`/g,'<code>$1</code>').replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>');
function blocks(lines){let h='',i=0;
 while(i<lines.length){const l=lines[i];
  if(/^```/.test(l)){let c=[];i++;while(i<lines.length&&!/^```/.test(lines[i])){c.push(lines[i]);i++}i++;h+='<pre><code>'+esc(c.join('\n'))+'</code></pre>';continue}
  if(/^\|/.test(l)){let t=[];while(i<lines.length&&/^\|/.test(lines[i])){t.push(lines[i]);i++}
   const row=r=>r.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim());
   h+='<table><thead><tr>'+row(t[0]).map(x=>'<th>'+inl(x)+'</th>').join('')+'</tr></thead><tbody>'+t.slice(2).map(r=>'<tr>'+row(r).map(x=>'<td>'+inl(x)+'</td>').join('')+'</tr>').join('')+'</tbody></table>';continue}
  if(/^(- |\d+\. )/.test(l)){const ord=/^\d/.test(l);let it=[];while(i<lines.length&&/^(- |\d+\. )/.test(lines[i])){it.push(lines[i].replace(/^(- |\d+\. )/,''));i++}
   h+=(ord?'<ol>':'<ul>')+it.map(x=>'<li>'+inl(x)+'</li>').join('')+(ord?'</ol>':'</ul>');continue}
  if(/^#### /.test(l)){h+='<h4>'+inl(l.slice(5))+'</h4>';i++;continue}
  if(/^> /.test(l)){let t=[];while(i<lines.length&&/^> /.test(lines[i])){t.push(lines[i].slice(2));i++}
   let s=t.join(' '),c='';const m=s.match(/^(say|warn|tip):\s*/);if(m){c=m[1];s=s.slice(m[0].length)}
   h+='<div class="co '+c+'">'+inl(s)+'</div>';continue}
  if(!l.trim()){i++;continue}
  let p=[];while(i<lines.length&&lines[i].trim()&&!/^(```|\||- |\d+\. |#### |> )/.test(lines[i])){p.push(lines[i]);i++}
  h+='<p>'+inl(p.join(' '))+'</p>'}
 return h}
function parse(src){const out={title:'',intro:'',secs:[]};let cur=null,q=null;
 let fence=false;src.split('\n').forEach(l=>{
  if(/^```/.test(l)){fence=!fence;if(q)q.lines.push(l);return}
  if(fence){if(q)q.lines.push(l);return}
  if(/^# /.test(l))out.title=l.slice(2);
  else if(/^> /.test(l)&&!cur)out.intro+=l.slice(2)+' ';
  else if(/^## /.test(l)){cur={h:l.slice(3),qs:[]};out.secs.push(cur);q=null}
  else if(/^### /.test(l)){let t=l.slice(4),lv='M';const m=t.match(/^\[([JMS])\]\s*/);if(m){lv=m[1];t=t.slice(m[0].length)}q={t:t,lv:lv,lines:[]};if(!cur){cur={h:'',qs:[]};out.secs.push(cur)}cur.qs.push(q)}
  else if(q)q.lines.push(l)});
 return out}
(function(){
 const here=location.pathname.split('/').pop()||'library.html';
 const app=document.getElementById('app');
 // theme toggle: shared key 'vtheme' ('light'|'dark'); no value = follow the system
 (function(){const de=document.documentElement,mq=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):{matches:false};
  const rd=()=>{try{const t=localStorage.getItem('vtheme');return t==='dark'||t==='light'?t:null}catch(e){return null}};
  const eff=()=>de.getAttribute('data-theme')||(mq.matches?'dark':'light');
  const b=document.createElement('button');b.type='button';b.className='themebtn';
  b.innerHTML='<svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  const lab=()=>{const d=eff()==='dark';b.setAttribute('aria-label',d?'Switch to light mode':'Switch to dark mode');b.title=b.getAttribute('aria-label')};
  const t0=rd();if(t0)de.setAttribute('data-theme',t0);
  b.onclick=()=>{const n=eff()==='dark'?'light':'dark';de.setAttribute('data-theme',n);try{localStorage.setItem('vtheme',n)}catch(e){}lab()};
  window.addEventListener('storage',e=>{if(e.key==='vtheme'){const t=rd();if(t)de.setAttribute('data-theme',t);else de.removeAttribute('data-theme');lab()}});
  if(mq.addEventListener)mq.addEventListener('change',lab);
  lab();document.body.appendChild(b);
 })();
 const nav='<div class="bar"><a href="library.html"'+(here==='library.html'?' class="on"':'')+'>Library</a>'+PAGES.map(p=>'<a href="'+p[0]+'"'+(p[0]===here?' class="on"':'')+'>'+p[1]+'</a>').join('')+'</div>';
 const srcEl=document.getElementById('src');
 if(!srcEl){ // index page
  let g='',last='';PAGES.forEach(p=>{if(p[3]!==last){g+=(last?'</div>':'')+'<div class="grp">'+p[3]+'</div><div class="cards">';last=p[3]}g+='<a class="card" href="'+p[0]+'"><b>'+p[1]+'</b><span>'+p[2]+'</span></a>'});g+='</div>';
  app.innerHTML='<div class="top"><h1>Interview Vault: library</h1><p>Lesson courses for senior .NET and Angular interviews. Each lesson explains the idea, the reasoning, an example, the traps, and how to say it in an interview. Tick each question when you can explain it aloud without notes.</p></div>'+nav+'<div class="wrap">'+g+'</div>';return}
 const d=parse(srcEl.textContent);document.title=d.title;
 let n=0,total=0;d.secs.forEach(s=>total+=s.qs.length);
 let saved={};const key='done:'+here;try{saved=JSON.parse(localStorage.getItem(key)||'{}')}catch(e){}
 const LV={J:'Junior',M:'Mid',S:'Senior'};
 let toc='<div class="toc"><b>Contents</b>';d.secs.forEach((s,i)=>{if(s.h)toc+='<a href="#s'+i+'" data-s="'+i+'">'+esc(s.h)+' <span>'+s.qs.length+'</span></a>'});toc+='</div>';
 let h='<div class="top"><h1>'+esc(d.title)+'</h1><p>'+inl(d.intro)+'</p></div>'+nav+'<div class="wrap">'+toc+'<div class="tools"><input id="f" placeholder="Search this page..."><button id="eo">Expand all</button><button id="co">Collapse all</button><span class="prog" id="pg"></span></div><div class="lvl" id="lvl"><span>Level:</span><button data-l="" class="on">All ('+total+')</button>'+['J','M','S'].map(k=>{const c=d.secs.reduce((a,s)=>a+s.qs.filter(q=>q.lv===k).length,0);return c?'<button data-l="'+k+'">'+LV[k]+' ('+c+')</button>':''}).join('')+'</div>';
 d.secs.forEach((s,i)=>{if(s.h)h+='<h2 class="sec" id="s'+i+'">'+inl(s.h)+'</h2>';
  s.qs.forEach(q=>{n++;h+='<details class="q'+(saved[n]?' done':'')+'" data-n="'+n+'" data-lv="'+q.lv+'"><summary><span class="num">'+n+'</span><span class="qt">'+inl(q.t)+'</span><span class="lv lv'+q.lv+'">'+LV[q.lv]+'</span><label class="dn"><input type="checkbox"'+(saved[n]?' checked':'')+'> understood</label></summary><div class="body">'+blocks(q.lines)+'</div></details>'})});
 app.innerHTML=h+'</div>';
 const upd=()=>{const c=Object.values(saved).filter(Boolean).length;document.getElementById('pg').textContent=c+' of '+total+' understood'};upd();
 document.querySelectorAll('.dn').forEach(l=>l.addEventListener('click',e=>e.stopPropagation()));
 document.querySelectorAll('.dn input').forEach(cb=>cb.addEventListener('change',()=>{const dt=cb.closest('details');saved[dt.dataset.n]=cb.checked;dt.classList.toggle('done',cb.checked);try{localStorage.setItem(key,JSON.stringify(saved))}catch(e){}upd()}));
 document.getElementById('eo').onclick=()=>document.querySelectorAll('details.q').forEach(x=>x.open=true);
 document.getElementById('co').onclick=()=>document.querySelectorAll('details.q').forEach(x=>x.open=false);
 document.querySelectorAll('#lvl button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#lvl button').forEach(x=>x.classList.toggle('on',x===b));const l=b.dataset.l;document.querySelectorAll('details.q').forEach(x=>{x.style.display=(!l||x.dataset.lv===l)?'':'none'})});
 document.getElementById('f').oninput=e=>{const v=e.target.value.toLowerCase();document.querySelectorAll('details.q').forEach(x=>{const m=!v||x.textContent.toLowerCase().includes(v);x.style.display=m?'':'none';if(v&&m)x.open=true})};
 function fx(d){
  document.body.classList.add('fx');
  const RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ICON={1:'🔥',2:'💡',3:'⚙️',4:'💻',5:'⚠️',6:'🏢',7:'🎤'};
  const AREA=[['Angular','🅰️'],['C#/.NET','🔷'],['Modern C#','✨'],['Best practices','✅'],['SQL','🗄️'],['System design','🏗️'],['DSA','🧩']];
  const areaOf=t=>{for(const a of AREA)if(t.indexOf(a[0])===0)return a;return['Lesson','📘']};
  const total=()=>(window.STATS&&window.STATS.lessons)||135;
  // progress bar
  const pb=document.createElement('div');pb.className='rd';document.body.appendChild(pb);
  const onScroll=()=>{const h=document.documentElement;const m=h.scrollHeight-h.clientHeight;pb.style.transform='scaleX('+(m>0?Math.min(1,h.scrollTop/m):0)+')';fab.classList.toggle('show',h.scrollTop>600)};
  // hero extras
  const top=document.querySelector('.top');if(top){top.insertAdjacentHTML('beforeend','<div class="chips"><span>7 full lessons</span><span>Story + analogy + code</span><span>Interview one-liners</span></div><i class="orb o1"></i><i class="orb o2"></i><i class="orb o3"></i>')}
  // lessons
  const lessons=[...document.querySelectorAll('details.q')];
  const mini=document.createElement('nav');mini.className='mini';
  lessons.forEach((dt,i)=>{
   const t=dt.querySelector('.qt').textContent,a=areaOf(t);dt.id='L'+(i+1);dt.classList.add('rv','lesson','c'+(i%7));
   dt.querySelector('summary').insertAdjacentHTML('afterbegin','<span class="ico">'+a[1]+'</span>');
   mini.insertAdjacentHTML('beforeend','<a href="#L'+(i+1)+'" data-i="'+(i+1)+'"><span>'+a[1]+'</span> '+esc(a[0])+'</a>');
   const body=dt.querySelector('.body'),out=document.createElement('div');out.className='parts';let cur=null;
   [...body.childNodes].forEach(k=>{
    if(k.nodeType===1&&k.tagName==='H4'){const mm=k.textContent.match(/^(\d)\./);const no=mm?+mm[1]:0;
     cur=document.createElement('section');cur.className='part rv p'+no;
     const ttl=k.textContent.replace(/^\d+\.\s*/,'');
     cur.innerHTML='<div class="ph"><span class="pi">'+(ICON[no]||'•')+'</span><h4><small>Part '+no+'</small>'+esc(ttl)+'</h4>'+(no===7?'<button class="ft" type="button" aria-expanded="false">Show</button>':'')+'</div><div class="pb"></div>';
     if(no===7){const f=document.createElement('div');f.className='fold';f.appendChild(cur.querySelector('.pb'));cur.appendChild(f);
      const b=cur.querySelector('.ft'),ph=cur.querySelector('.ph');const tg=()=>{const o=f.classList.toggle('open');b.textContent=o?'Hide':'Show';b.setAttribute('aria-expanded',o)};ph.addEventListener('click',tg);cur.tg=tg;cur.fold=f;cur.btn=b;cur.pbx=f.firstChild;cur.dataset.fold='1';}
     out.appendChild(cur)}
    else if(cur)(cur.pbx||cur.querySelector('.pb')).appendChild(k);else out.appendChild(k)});
   body.innerHTML='';body.appendChild(out);
   body.querySelectorAll('.co.say').forEach(c=>c.insertAdjacentHTML('afterbegin','<span class="sl">🎙️ Say it like this</span>'));
   body.querySelectorAll('pre').forEach(p=>{const b=document.createElement('button');b.className='cp';b.type='button';b.textContent='Copy';b.onclick=()=>{const tx=p.querySelector('code').textContent;const ok=()=>{b.textContent='Copied!';setTimeout(()=>b.textContent='Copy',1400)};try{navigator.clipboard.writeText(tx).then(ok,()=>{})}catch(e){}};p.appendChild(b)});
   if(i===0){dt.open=true;const q=dt.querySelector('.part.p7');if(q&&q.tg)q.tg()}
  });
  // sticky mini nav, replaces default toc and level filter
  const wrap=document.querySelector('.wrap');const tools=wrap.querySelector('.tools');wrap.insertBefore(mini,tools);
  mini.querySelectorAll('a').forEach(a=>a.addEventListener('click',e=>{const t=document.getElementById('L'+a.dataset.i);if(t){t.open=true}}));
  // CTA after lessons
  const cta=document.createElement('section');cta.className='cta rv';
  cta.innerHTML='<h2>Liked these 7? There are <span class="cn">'+total()+'</span> more.</h2><p>Angular, C# and .NET, Web API, SQL, system design, DSA patterns and Azure, all in the same story, analogy, code and one-liner format.</p><div class="pr"></div><a class="go" href="index.html#buy">Unlock all lessons <span>→</span></a>';
  wrap.appendChild(cta);
  const fab=document.createElement('a');fab.className='fab';fab.href='index.html#buy';fab.innerHTML='🔓 Unlock all lessons';document.body.appendChild(fab);
  const sc=document.createElement('script');sc.src='stats.js';sc.onload=()=>{const n=cta.querySelector('.cn');if(n&&window.STATS)n.textContent=window.STATS.lessons};document.head.appendChild(sc);
  // price follows shop/config.js (launch offer with real deadline)
  const cf=document.createElement('script');cf.src='config.js';cf.onload=()=>{const S=window.SHOP||{},end=S.offerEndsAt?Date.parse(S.offerEndsAt):0,live=!end||Date.now()<end,f=v=>'₹'+Number(v).toLocaleString('en-IN'),pr=cta.querySelector('.pr');
    if(live&&S.regularPrice>S.price){pr.innerHTML='<s>'+f(S.regularPrice)+'</s><b>'+f(S.price)+'</b><em>'+(S.offerLabel||'Launch offer')+'</em>';fab.innerHTML='🔓 Unlock all lessons · <b>'+f(S.price)+'</b>'}
    else{const p=live?S.price:(S.regularPrice||S.price);pr.innerHTML='<b>'+f(p)+'</b>';fab.innerHTML='🔓 Unlock all lessons · <b>'+f(p)+'</b>'}};document.head.appendChild(cf);
  // reveal on scroll
  const all=[...document.querySelectorAll('.rv')];
  if('IntersectionObserver' in window&&!RM){const io=new IntersectionObserver((es,o)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');o.unobserve(e.target)}})},{threshold:.08});all.forEach((e,i)=>{e.style.transitionDelay=(e.classList.contains('part')?(i%4)*60:0)+'ms';io.observe(e)});
   const so=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){mini.querySelectorAll('a').forEach(a=>a.classList.toggle('on','#'+e.target.id===a.getAttribute('href')))}})},{rootMargin:'-30% 0px -60% 0px'});lessons.forEach(l=>so.observe(l))}
  else all.forEach(e=>e.classList.add('in'));
  // opening a lesson reveals its parts
  lessons.forEach(l=>l.addEventListener('toggle',()=>{if(l.open)l.querySelectorAll('.rv').forEach(e=>{if(RM||!('IntersectionObserver' in window))e.classList.add('in')})}));
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();
 }
 if(here==='sample.html')fx(d);
})();
