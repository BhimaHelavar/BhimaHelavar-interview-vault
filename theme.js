(function(){var K='vtheme',d=document.documentElement,sv=null;try{sv=localStorage.getItem(K)}catch(e){}
var mq=window.matchMedia&&matchMedia('(prefers-color-scheme: dark)');
var cur=function(){return d.getAttribute('data-theme')||(mq&&mq.matches?'dark':'light')};
if(sv==='dark'||sv==='light')d.setAttribute('data-theme',sv);
function add(){if(document.getElementById('thm'))return;var b=document.createElement('button');b.id='thm';b.className='thm';b.type='button';
b.innerHTML='<svg class="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg><svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
var lab=function(){b.setAttribute('aria-label',cur()==='dark'?'Switch to light mode':'Switch to dark mode')};lab();
b.onclick=function(){var n=cur()==='dark'?'light':'dark';d.setAttribute('data-theme',n);try{localStorage.setItem(K,n)}catch(e){}lab()};
document.body.appendChild(b)}
if(document.body)add();else document.addEventListener('DOMContentLoaded',add)})();
