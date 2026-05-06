
function renderHome(){
  updateStreak();
  const hr=new Date().getHours();
  let greet='Привет',ico='🌿',icoCls='day';
  let headerTag='', headerTitle='', headerSub='';
  if(hr<6){
    headerTag='тихая ночь';
    headerTitle='Тихое завершение<br><em>этого дня</em>';
    headerSub='Всё, что было сегодня — уже позади. Нужно отдохнуть.';
  } else if(hr<12){
    headerTag='доброе утро';
    headerTitle='Мягкий старт<br><em>нового дня</em>';
    headerSub='Дай себе немного времени до начала дня.';
  } else if(hr<18){
    headerTag='добрый день';
    headerTitle='Время побыть<br><em>с собой</em>';
    headerSub='Можно остановиться на минуту. Просто побыть с собой.';
  } else if(hr<23){
    headerTag='добрый вечер';
    headerTitle='Этот момент<br><em>для тебя</em>';
    headerSub='День позади. Можно замедлиться и выдохнуть.';
  } else {
    headerTag='тихая ночь';
    headerTitle='Тихое завершение<br><em>этого дня</em>';
    headerSub='Всё, что было сегодня — уже позади. Нужно отдохнуть.';
  }
  const tagEl=document.getElementById('home-header-tag');
  const titleEl=document.getElementById('home-header-title');
  const subEl=document.getElementById('home-header-sub');
  if(tagEl)tagEl.textContent=headerTag;
  if(titleEl)titleEl.innerHTML=headerTitle;
  if(subEl)subEl.textContent=headerSub;
  const done=r30Done.length;
  renderHomeSections();
  initFanCard();
  enhanceInteractiveElements(document.querySelector('.scr[data-s="home"]'));
  document.getElementById('h30-fill').style.width=(done/30*100)+'%';
  document.getElementById('h30-day').textContent=`${done} / 30`;
  if(done===0){document.getElementById('h30-title').innerHTML='Перезагрузка <em style="font-style:normal">за</em> 30 дней';document.getElementById('h30-desc').textContent='путь к себе — мягкий, постепенный, со структурой';document.getElementById('h30-tag').textContent='программа · 30 дней';}
  else if(done>=30){document.getElementById('h30-title').innerHTML='Ты <em>прошла</em> путь';document.getElementById('h30-desc').textContent='30 дней позади. начни заново или просто загляни.';document.getElementById('h30-tag').textContent='программа завершена ✓';}
  else {const next=getCurrentDay();document.getElementById('h30-title').innerHTML=`День ${next} <em style="font-style:normal">из 30</em>`;document.getElementById('h30-desc').textContent=window.PROGRAM.days[next-1].name.toLowerCase();document.getElementById('h30-tag').textContent='продолжить программу';}
}

function openSec(id){
  curSec=id;
  const sec=getDisplaySection(id)||{n:id,d:''};
  closeCardDetail();
  document.getElementById('ct').textContent=sec.n;
  document.getElementById('cg-h').textContent=sec.n;
  document.getElementById('cg-s').textContent=id==='anxiety'?'маленькая практика, чтобы стало тише внутри':sec.d;
  const lead=document.getElementById('cg-lead');
  if(lead){
    lead.textContent=id==='anxiety'?'Начни с той, к которой потянется взгляд.':'';
    lead.classList.toggle('on',id==='anxiety');
  }
  const cards=getSectionCards(id);
  const grid=document.getElementById('grid');
  grid.classList.toggle('anxiety-final',sectionUsesDetailCard(id));
  grid.innerHTML=renderCardGridHTML(cards,id);
  prevScreen='cards';
  goScr('cards');
}

function openCard(sid,idx,fromDay,fromDetail=false,tone=''){
  const c=CARDS[sid][idx];
  curCard=c;curCardKey=`${sid}-${idx}`;curSec=sid;curCardIdx=idx;
  if(fromDay)prevScreen='day';else if(prevScreen!=='home')prevScreen='cards';
  if(phraseInt){clearInterval(phraseInt);phraseInt=null;}
  if(tInt){clearTimeout(tInt);clearInterval(tInt);tInt=null;}
  const teEl=document.getElementById('te');
  const ttEl=document.getElementById('tt');
  const resultCard=document.querySelector('.t-result-card');
  const supEl=document.getElementById('tsup');
  if(teEl){teEl.style.display='none';teEl.textContent='';}
  if(ttEl){ttEl.style.display='';ttEl.textContent=c.n;}
  if(resultCard)resultCard.style.display='none';
  document.getElementById('tresult').textContent='';
  document.getElementById('tres-label').textContent='';
  if(supEl){supEl.style.display='';supEl.textContent=c.sup;}
  const techScr=document.querySelector('.scr[data-s="tech"]');
  if(techScr){
    techScr.classList.remove('anxiety-tech','tone-sage','tone-lavender','tone-honey','tone-peach','tone-rose','tone-butter');
    if(tone)techScr.classList.add(tone);
  }
  document.getElementById('fav-btn').textContent=favs.includes(curCardKey)?'♥':'♡';
  const ia=document.getElementById('interactive-area');
  ia.innerHTML='';
  document.getElementById('feedback-area').innerHTML='';
  const bs=document.getElementById('bs');const br=document.getElementById('br');
  bs.style.display='block';br.style.display='none';bs.disabled=false;bs.style.opacity='1';
  buildInteractive(c, ia, bs);
  const shuffleSlot=document.getElementById('tech-shuffle-slot');if(shuffleSlot)shuffleSlot.innerHTML='';
  renderTechShuffle();
  goScr('tech');
}

function goBackFromTech(){
  if(prevScreen==='day'&&curDay){renderDay(curDay);goScr('day');}
  else goScr(prevScreen);
}

function goHomeToFan(){
  goScr('home');
  setTimeout(()=>{
    const scr=document.querySelector('.scr[data-s="home"]');
    const fan=document.querySelector('.home-band-fan');
    if(scr&&fan){
      const top=fan.offsetTop - scr.offsetTop - 20;
      scr.scrollTo({top:Math.max(0,top),behavior:'smooth'});
    }
  },80);
}

let curFanSid='',curFanIdx=0;

function getRandomFanCard(){
  const sids=Object.keys(CARDS).filter(k=>CARDS[k]&&CARDS[k].length>0);
  const sid=sids[Math.floor(Math.random()*sids.length)];
  const idx=Math.floor(Math.random()*CARDS[sid].length);
  return {sid,idx,card:CARDS[sid][idx]};
}

function initFanCard(){
  const r=getRandomFanCard();
  curFanSid=r.sid;curFanIdx=r.idx;
  _updateFanUI(r.card);
}

function _updateFanUI(c){
  const ico=document.getElementById('fan-ico');
  const name=document.getElementById('fan-name');
  const time=document.getElementById('fan-time');
  if(ico)ico.textContent=c.i||'🌿';
  if(name)name.textContent=c.n;
  if(time)time.textContent=c.time||'';
}

function shuffleFanCard(){
  const deck=document.getElementById('fan-deck');
  const main=document.getElementById('fan-card-main');
  if(!deck||!main)return;
  deck.classList.add('fan-shuffling');
  main.classList.add('fan-card-flipping');
  setTimeout(()=>{
    const r=getRandomFanCard();
    curFanSid=r.sid;curFanIdx=r.idx;
    _updateFanUI(r.card);
  },210);
  setTimeout(()=>{
    deck.classList.remove('fan-shuffling');
    main.classList.remove('fan-card-flipping');
  },440);
}

function openFanCard(){
  if(curFanSid&&CARDS[curFanSid]&&CARDS[curFanSid][curFanIdx]){
    prevScreen='home';
    openCard(curFanSid,curFanIdx,false,false,'');
  }
}
