// Decrypts a locked page in the browser using the buyer's access key (AES-GCM, PBKDF2-SHA256).
(function(){
const S=window.SHOP||{};const E=window.__ENC;
const norm=k=>(k||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
const b64=s=>Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const ls={get(k){try{return localStorage.getItem(k)}catch(e){return null}},set(k,v){try{localStorage.setItem(k,v)}catch(e){}},del(k){try{localStorage.removeItem(k)}catch(e){}}};
async function dec(key,e){
  const km=await crypto.subtle.importKey('raw',new TextEncoder().encode(norm(key)),'PBKDF2',false,['deriveKey']);
  const k=await crypto.subtle.deriveKey({name:'PBKDF2',salt:b64(e.s),iterations:e.n,hash:'SHA-256'},km,{name:'AES-GCM',length:256},false,['decrypt']);
  const p=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(e.i)},k,b64(e.c));
  return new TextDecoder().decode(p);
}
const API=(S.api||'').replace(/\/$/,'');
function device(){let d=ls.get('vaultdev');if(!d){d=Array.from(crypto.getRandomValues(new Uint8Array(16)),x=>x.toString(16).padStart(2,'0')).join('');ls.set('vaultdev',d)}return d}
async function post(path,body){const r=await fetch(API+path,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)});let j={};try{j=await r.json()}catch(e){}if(!r.ok)throw new Error(j.error||'network');return j}
const MSG={invalid:'That key did not work. Check for typos.',revoked:'This key has been disabled. Contact support.',limit:'This key is already used on 2 devices. Contact support to reset it.',network:'Could not reach the server. Check your connection and try again.'};
const msgOf=e=>MSG[e.message]||MSG.network;
async function secret(key){return API?(await post('/unlock',{key:norm(key),device:device()})).ck:key}
async function login(key){await secret(key);ls.set('vaultkey',norm(key))}
async function claim(pid){return (await post('/claim',{payment_id:pid})).key}
function noPrint(){try{var st=document.createElement('style');st.textContent='@media print{body>*{display:none!important}body::before{content:"Printing and PDF export are disabled for the paid library. Please read it online.";display:block;font:18px system-ui;padding:40px}}';document.head.appendChild(st);
window.addEventListener('keydown',function(e){var k=(e.key||'').toLowerCase();if((e.ctrlKey||e.metaKey)&&(k==='p'||k==='s')){e.preventDefault()}},true)}catch(e){}}
async function open(key){const html=await dec(await secret(key),E);ls.set('vaultkey',norm(key));document.open();document.write(html);document.close();noPrint();}
window.vaultUnlock={dec,norm,login,claim,msgOf};
if(!E)return;
function ui(msg){
  const buy=(S.paymentLink||S.razorpayButtonId)?'<a class="btn" href="index.html#buy" id="buy">Buy access</a>':'';
  document.body.innerHTML='<div class="lockbox"><h1>'+(E.t||'Locked page')+'</h1><p>This page is part of the paid library. Enter your personal access key. <a href="unlock.html">Lost it? Get it from your payment ID</a>.</p><input id="k" placeholder="XXXXX-XXXXX-XXXXX-XXXXX" autocomplete="off"><button class="btn" id="go">Unlock</button> '+buy+'<p class="err" id="err">'+(msg||'')+'</p><p class="sm"><a href="index.html">Overview</a> &middot; <a href="sample.html">Free sample</a></p></div>';
  const go=async()=>{try{await open(document.getElementById('k').value)}catch(e){document.getElementById('err').textContent=msgOf(e)}};
  document.getElementById('go').onclick=go;document.getElementById('k').addEventListener('keydown',e=>{if(e.key==='Enter')go()});
}
const m=location.hash.match(/key=([A-Za-z0-9-]+)/);
const saved=m?m[1]:ls.get('vaultkey');
if(m)history.replaceState(null,'',location.pathname+location.search);
if(saved&&crypto&&crypto.subtle){open(saved).catch(e=>{if(e.message!=='network')ls.del('vaultkey');ui(e.message==='network'?msgOf(e):'Saved key is no longer valid. '+msgOf(e))})}
else if(!(crypto&&crypto.subtle)){document.body.innerHTML='<p style="padding:2rem">Open this site over https to unlock pages.</p>'}
else ui();
})();
