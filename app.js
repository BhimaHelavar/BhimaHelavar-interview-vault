const PAGES=[
["angular-lessons.html","Angular lessons (full course)","Components, signals, RxJS, routing, forms, security","Lesson courses"],
["csharp-lessons.html","C# and .NET lessons (full course)","Runtime, memory, async, LINQ, modern C#","Lesson courses"],
["webapi-lessons.html","Web API lessons (full course)","Pipeline, REST, validation, versioning, idempotency, security","Lesson courses"],
["sql-lessons.html","SQL lessons (full course)","Joins, NULL, window functions, indexes, plans, procedures","Lesson courses"],
["ng-testing-lessons.html","Angular testing lessons (full course)","TestBed, mocks, HTTP, async, signals, forms, Playwright","Lesson courses"],
["ent-dotnet.html","Enterprise .NET lessons","Auth, caching, queues, EF Core, logging, CI/CD","Enterprise daily lessons"],
["ent-angular.html","Enterprise Angular lessons","HTTP layer, grids, state, micro frontends, forms, real-time","Enterprise daily lessons"],
["ent-database.html","Enterprise database lessons","Transactions, concurrency, indexing, schema, migrations, scaling","Enterprise daily lessons"],
["design-study/index.html","System design with a real app","HLD, LLD, database, API, NFRs, security, patterns, interview kit","System design and Azure"],
["azure-study/index.html","Azure for .NET developers","App Service, SQL, secrets, CI/CD, Bicep, monitoring, cost, interview Q&A","System design and Azure"],
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
})();
