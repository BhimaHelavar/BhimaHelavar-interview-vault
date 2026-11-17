(function(){
const S=window.SHOP||{},T=window.STATS||{},B=S.business||{};
const $=id=>document.getElementById(id);
const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const num=v=>Number(v)||0;
const price=S.price!=null?'₹'+num(S.price).toLocaleString('en-IN'):'';
const total=num(T.lessons)+num(T.qa)+num(T.designPages)+num(T.azurePages);
const vals={name:S.name,price:price,days:S.refundDays,email:B.email,total:total||''};
document.title=S.name||document.title;
document.querySelectorAll('[data-s]').forEach(n=>{const k=n.dataset.s;const v=vals[k]!==undefined?vals[k]:T[k];n.textContent=v!==undefined&&v!==null?v:''});
document.querySelectorAll('[data-mail]').forEach(a=>{if(B.email)a.href='mailto:'+B.email});

/* offer label and optional crossed-out regular price */
const off=$('offer');
if(off){const old=num(S.regularPrice);let t='';if(S.offerLabel)t+='<span class="tag">'+S.offerLabel+'</span>';if(old>num(S.price))t+=' <s>\u20B9'+old.toLocaleString('en-IN')+'</s>';off.innerHTML=t}
/* real reviews (shown only when config.reviews has entries) */
const rv=$('reviews'),R=(S.reviews||[]).filter(r=>r&&r.name&&r.text);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
if(rv&&R.length){rv.innerHTML='<h2 class="rv in">What readers say</h2><div class="grid revs">'+R.map(r=>'<figure class="c"><blockquote>'+esc(r.text)+'</blockquote><figcaption><b>'+esc(r.name)+'</b><span>'+esc([r.role,r.company].filter(Boolean).join(', '))+'</span></figcaption></figure>').join('')+'</div>'}

/* payment (unchanged behaviour) */
const pay=$('pay');
if(pay){
  if(S.razorpayButtonId){const f=document.createElement('form');const s=document.createElement('script');s.src='https://checkout.razorpay.com/v1/payment-button.js';s.async=true;s.dataset.payment_button_id=S.razorpayButtonId;f.appendChild(s);pay.appendChild(f)}
  else if(S.paymentLink){pay.innerHTML='<a class="btn" href="'+S.paymentLink+'" rel="noopener">Pay '+price+' securely with Razorpay</a>'}
  else pay.innerHTML='<span class="note">Payments are being set up. Please check back soon, or write to '+(B.email||'us')+'.</span>';
}

/* topic marquee */
const topics=['Modern C# features','async/await','LINQ','EF Core','ASP.NET Core Web API','JWT auth','Caching','Outbox pattern','Angular signals','Zoneless change detection','RxJS','Reactive forms','Angular testing','SQL window functions','Indexes and plans','Transactions','System design','CAP theorem','Message queues','Rate limiting','Idempotency','15 DSA patterns','Dynamic programming','Azure App Service','Bicep','Claude Code'];
const mq=$('marq');
if(mq){const dot='<svg class="ic" aria-hidden="true"><use href="#i-code"/></svg>';const html=topics.map(t=>'<span>'+dot+t+'</span>').join('');mq.innerHTML=reduce?html:html+html}

/* reveal on scroll */
const hasIO='IntersectionObserver' in window;
function watch(sel,cb,opt){const els=document.querySelectorAll(sel);if(!hasIO||reduce){els.forEach(e=>cb(e,true));return}
  const io=new IntersectionObserver((es,o)=>es.forEach(e=>{if(e.isIntersecting){cb(e.target,true);o.unobserve(e.target)}}),opt||{threshold:.15});els.forEach(e=>io.observe(e))}
document.querySelectorAll('.grid').forEach(g=>g.querySelectorAll(':scope > .rv').forEach((el,i)=>el.style.setProperty('--d',(i*0.08)+'s')));
watch('.rv',e=>{e.classList.add('in');if(e.style.getPropertyValue('--d'))setTimeout(()=>e.style.removeProperty('--d'),1400)});
watch('#tl',e=>e.classList.add('in'),{threshold:.2});

/* count-up stats */
function countUp(el){const target=num(el.textContent);if(!target||reduce){return}
  const dur=1400,t0=performance.now();el.textContent='0';
  (function step(t){const p=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=Math.round(target*e);if(p<1)requestAnimationFrame(step)})(t0)}
if(hasIO&&!reduce){document.querySelectorAll('[data-count]').forEach(el=>{const final=el.textContent;el.dataset.final=final;el.textContent='0'});
  watch('[data-count]',el=>{el.textContent=el.dataset.final;countUp(el)},{threshold:.6})}

/* typing code card */
const snippets=[
 {lang:'C#',code:'public record Order(int Id, decimal Total);\n\nvar paid = orders\n  .Where(o => o.Total > 1000)\n  .OrderByDescending(o => o.Total)\n  .Take(5);\n\n// records give value equality,\n// `with` copies, no boilerplate'},
 {lang:'Angular',code:'count = signal(0);\ndouble = computed(() => this.count() * 2);\n\nconstructor() {\n  effect(() => save(this.count()));\n}\n\n// signals: state, derived values,\n// and side effects in one model'}
];
const out=$('typed'),lang=$('lang');
if(out){
  if(reduce){out.textContent=snippets[0].code}
  else{let si=0,ci=0,dir=1,wait=0;
    (function tick(){
      const s=snippets[si];lang.textContent=s.lang;
      if(wait>0){wait--;return setTimeout(tick,60)}
      ci+=dir*2;
      if(ci>=s.code.length){ci=s.code.length;dir=-1;wait=40}
      else if(ci<=0){ci=0;dir=1;si=(si+1)%snippets.length;wait=6}
      out.textContent=s.code.slice(0,ci);
      setTimeout(tick,dir>0?28:8);
    })();
  }
}

/* sticky CTA on small screens: after hero, hidden while pricing is on screen */
const st=$('sticky'),hero=document.querySelector('.hero'),buy=$('buy');
if(st&&hero){
  const upd=()=>{const h=hero.getBoundingClientRect().bottom<0;const b=buy?buy.getBoundingClientRect():null;const inBuy=b&&b.top<window.innerHeight*.8&&b.bottom>0;st.classList.toggle('show',h&&!inBuy)};
  window.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd);upd();
}

/* parallax tilt on the hero code card (fine pointers only) */
const tilt=$('tilt'),stage=tilt&&tilt.parentElement;
if(tilt&&!reduce&&window.matchMedia&&window.matchMedia('(pointer:fine)').matches){
  stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    tilt.style.setProperty('--ry',(x*8).toFixed(2)+'deg');tilt.style.setProperty('--rx',(-y*8).toFixed(2)+'deg')});
  stage.addEventListener('pointerleave',()=>{tilt.style.setProperty('--rx','0deg');tilt.style.setProperty('--ry','0deg')});
}

/* active section highlight in the header nav */
const links=[...document.querySelectorAll('header.t a[href^="#"]')];
if(links.length&&hasIO){
  const mark=id=>links.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+id));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.target.id)mark(e.target.id)}),{rootMargin:'-12% 0px -78% 0px'});
  links.forEach(a=>{const t=document.querySelector(a.getAttribute('href'));if(t)io.observe(t)});
  window.addEventListener('scroll',()=>{if(window.scrollY<260)links.forEach(a=>a.classList.remove('on'))},{passive:true});
}
})();
