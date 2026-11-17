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
async function open(key){const html=await dec(key,E);ls.set('vaultkey',norm(key));document.open();document.write(html);document.close();}
window.vaultUnlock={dec,norm};
if(!E)return;
function ui(msg){
  const buy=(S.paymentLink||S.razorpayButtonId)?'<a class="btn" href="index.html#buy" id="buy">Buy access</a>':'';
  document.body.innerHTML='<div class="lockbox"><h1>'+(E.t||'Locked page')+'</h1><p>This page is part of the paid library. Enter the access key from your purchase email or payment confirmation.</p><input id="k" placeholder="XXXXX-XXXXX-XXXXX-XXXXX" autocomplete="off"><button class="btn" id="go">Unlock</button> '+buy+'<p class="err" id="err">'+(msg||'')+'</p><p class="sm"><a href="index.html">Overview</a> &middot; <a href="sample.html">Free sample</a></p></div>';
  const go=async()=>{try{await open(document.getElementById('k').value)}catch(e){document.getElementById('err').textContent='That key did not work. Check for typos.'}};
  document.getElementById('go').onclick=go;document.getElementById('k').addEventListener('keydown',e=>{if(e.key==='Enter')go()});
}
const m=location.hash.match(/key=([A-Za-z0-9-]+)/);
const saved=m?m[1]:ls.get('vaultkey');
if(m)history.replaceState(null,'',location.pathname+location.search);
if(saved&&crypto&&crypto.subtle){open(saved).catch(()=>{ls.del('vaultkey');ui('Saved key is no longer valid. Enter the current key.')})}
else if(!(crypto&&crypto.subtle)){document.body.innerHTML='<p style="padding:2rem">Open this site over https to unlock pages.</p>'}
else ui();
})();
