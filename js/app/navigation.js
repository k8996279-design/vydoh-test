function getDayState(d){
  if(!r30State[d])r30State[d]={checked:{morning:[],evening:[],tips:[]},inputs:{},water:0,moodM:'',moodE:'',practiceDone:false};
  return r30State[d];
}
function saveR30(){writeStored('r30State',r30State);writeStored('r30Done',r30Done);}

function updateStreak(){const today=new Date().toDateString();if(lastDay!==today){const y=new Date();y.setDate(y.getDate()-1);if(lastDay===y.toDateString())streak++;else streak=Math.max(streak,1);lastDay=today;setStoredText('streak',String(streak));setStoredText('lastDay',today);}}

function goScr(s){
  if(s!=='cards')closeCardDetail();
  const el=document.querySelector(`.scr[data-s="${s}"]`);
  if(!el){
    console.warn(`Screen not found: ${s}`);
    return;
  }
  document.querySelectorAll('.scr').forEach(e=>e.classList.remove('on'));
  el.classList.add('on');el.scrollTop=0;
  const showNav=['home','sections','journal','cards','reset30'].includes(s);
  document.getElementById('bn').classList.toggle('on',showNav);
  document.querySelectorAll('.bn-i').forEach(b=>b.classList.toggle('on',b.dataset.nav===s));
  if(s==='journal')renderJournal();
  if(s==='home')renderHome();
  if(s==='reset30')renderReset();
  if(s==='sections'){const sl=document.getElementById('sec-list');if(sl)sl.innerHTML=renderSectionsListHTML();}
  enhanceInteractiveElements(el);
}
function goMood(){goScr('mood')}
function goHome(){renderHome();goScr('home');}
