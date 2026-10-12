'use strict';
const el = id => document.getElementById(id);
const STORAGE_KEY = 'yugioh-deck-probability-settings-v1';
const defaults = {total:40,hand:5,pre:12,post:16};
function restore(){
 try {
  const obj=JSON.parse(localStorage.getItem(STORAGE_KEY));
  if(!obj || !Number.isInteger(obj.total) || obj.total<40 || obj.total>60 ||
    ![5,6].includes(obj.hand) || !Number.isInteger(obj.pre) ||
    !Number.isInteger(obj.post) || obj.pre<0 || obj.post<0 ||
    obj.pre>obj.total || obj.post>obj.total) return {...defaults};
  return {total:obj.total,hand:obj.hand,pre:obj.pre,post:obj.post};
 }catch(_){return {...defaults};}
}
const state = restore();
function persist(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(_){}}

const clamp = (x,min,max) => Math.max(min,Math.min(max,x));
function choose(n,k){if(k<0 || k>n)return 0;k=Math.min(k,n-k);let acc=1;for(let i=1;i<=k;i++)acc=acc*(n-k+i)/i;return Math.round(acc);}
function probability(n,total,hand){if(n<2 || hand<2)return 0;const eng=total-n;const p0=choose(eng,hand);const p1=n*choose(eng,hand-1);return clamp(1-(p0+p1)/choose(total,hand),0,1);}
const formatPct=x=>(x*100).toLocaleString('it-IT',{minimumFractionDigits:2,maximumFractionDigits:2})+'%';
function render(){
 persist();
 el('total').value=state.total;el('hand5').setAttribute('aria-pressed',state.hand===5?'true':'false');el('hand6').setAttribute('aria-pressed',state.hand===6?'true':'false');
 for(const key of ['pre','post']){
  const n=state[key],t=state.total,e=t-n,p=probability(n,t,state.hand);el(key+'-e').value=e;el(key+'-n').value=n;
  el(key+'-e').max=t;el(key+'-n').max=t;el(key+'-slider').max=t;el(key+'-slider').value=n;
  el(key+'-slabel').textContent=n+' / '+t;el(key+'-tag').textContent=t+' carte';
  el(key+'-e-label').textContent=e;el(key+'-n-label').textContent=n;
  el(key+'-engine-bar').style.width=(e/t*100)+'%';el(key+'-non-bar').style.width=(n/t*100)+'%';
  el(key+'-p').textContent=formatPct(p);el(key+'-fill').style.width=(p*100)+'%';
 }
 const change=(probability(state.post,state.total,state.hand)-probability(state.pre,state.total,state.hand))*100;
 const neDiff=state.post-state.pre;
 el('delta').textContent=(change>0.000001?'+':change<-.000001?'−':'')+Math.abs(change).toLocaleString('it-IT',{minimumFractionDigits:2,maximumFractionDigits:2})+' pp';
 el('delta').className='delta'+(change<-.000001?' negative':Math.abs(change)<.000001?' neutral':'');
 const t=neDiff===0?'La quantità di Non-Engine non cambia':neDiff>0?'Aggiungendo '+neDiff+' Non-Engine':'Togliendo '+Math.abs(neDiff)+' Non-Engine';
 const d=change>.000001?'aumenta':change<-.000001?'diminuisce':'resta invariata';
 el('comparison').textContent=t+', la probabilità di vederne almeno 2 '+d+'.';
}
function editCount(key,origin,input){if(input.trim()==='')return;const num=Number(input);if(!Number.isInteger(num)||num<0||num>state.total){render();return;}state[key]=origin==='engine'?state.total-num:num;render();}
for(const key of ['pre','post']){
 el(key+'-slider').addEventListener('input',ev=>{state[key]=Number(ev.target.value);render();});
 for(const [id,origin] of [['-e','engine'],['-n','nonengine']]){
  const node=el(key+id);node.addEventListener('input',ev=>editCount(key,origin,ev.target.value));node.addEventListener('blur',render);
 }
}
function setTotal(value){if(!Number.isInteger(value)||value<40||value>60){render();return;}state.total=value;state.pre=clamp(state.pre,0,value);state.post=clamp(state.post,0,value);render();}
el('total').addEventListener('change',ev=>setTotal(Number(ev.target.value)));
el('more').addEventListener('click',()=>setTotal(state.total+1));
el('less').addEventListener('click',()=>setTotal(state.total-1));
el('hand5').addEventListener('click',()=>{state.hand=5;render()});
el('hand6').addEventListener('click',()=>{state.hand=6;render()});
el('reset').addEventListener('click',()=>{Object.assign(state,defaults);render()});
render();
function showToast(msg){
 const elToast=el('toast');elToast.textContent=msg;elToast.hidden=false;
 clearTimeout(showToast.timeout);
 showToast.timeout=setTimeout(()=>{elToast.hidden=true;},3200);
}
const setConnectivity=()=>{
 el('connectivity').textContent=navigator.onLine?'Online':'Offline · il calcolatore funziona';
 el('connectivity-dot').classList.toggle('offline',!navigator.onLine);
};
window.addEventListener('online',setConnectivity);
window.addEventListener('offline',setConnectivity);
setConnectivity();
let installPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;el('install-action').hidden=false;});
el('install-action').addEventListener('click',async()=>{
 if(!installPrompt){el('install-help').open=true;return;}
 const prompt=installPrompt;installPrompt=null;
 try{await prompt.prompt();await prompt.userChoice;}catch(_){/* install not supported */}
 el('install-action').hidden=true;
});
el('share').addEventListener('click',async()=>{
 if(location.protocol==='file:'){
  showToast('Pubblica la PWA online per ottenere un link da condividere.');return;
 }
 const link=location.href.split('#')[0].split('?')[0];
 if(navigator.share){
  try {await navigator.share({title:'Yu-Gi-Oh! Deck Probability',url:link});return;}
  catch(e){if(e.name==='AbortError')return;}
 }
 try{await navigator.clipboard.writeText(link);showToast('Link copiato! Invialo ai tuoi amici.');}
 catch(_){showToast('Copia il link dalla barra degli indirizzi per condividerlo.');}
});
if('serviceWorker' in navigator && (location.protocol==='https:' || location.hostname==='localhost' || location.hostname==='127.0.0.1')){
 window.addEventListener('load',()=>{
  navigator.serviceWorker.register('./service-worker.js',{scope:'./'})
   .then(()=>navigator.serviceWorker.ready)
   .then(()=>{el('offline-status').textContent='Disponibile offline dopo il primo caricamento';})
   .catch(()=>{el('offline-status').textContent='Offline non attivo su questo dispositivo';});
 });
}
