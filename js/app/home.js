function renderHome(){
  updateStreak();
  const hr=new Date().getHours();
  let greet='Привет',ico='🌿',icoCls='day';
  if(hr<6){greet='Тихой ночи';ico='🌙';icoCls='night';}
  else if(hr<12){greet='Доброе утро';ico='☀️';icoCls='sunrise';}
  else if(hr<18){greet='Привет';ico='🌿';icoCls='day';}
  else if(hr<23){greet='Добрый вечер';ico='✨';icoCls='evening';}
  else {greet='Тихой ночи';ico='🌙';icoCls='night';}
  document.getElementById('home-greet-title').textContent=greet;
  const greetIco=document.getElementById('home-greet-ico');
  greetIco.textContent=ico;
  greetIco.className=`tb-greet-ico ${icoCls}`;
  renderHomeSections();
  enhanceInteractiveElements(document.querySelector('.scr[data-s="home"]'));
  // 30 days hero
  const done=r30Done.length;
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
  goScr('cards');
}

function openCard(sid,idx,fromDay,fromDetail=false,tone=''){
  const c=CARDS[sid][idx];
  curCard=c;curCardKey=`${sid}-${idx}`;curSec=sid;curCardIdx=idx;
  if(fromDay)prevScreen='day';else prevScreen='cards';
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
  goScr('tech');
}

function goBackFromTech(){
  if(prevScreen==='day'&&curDay){renderDay(curDay);goScr('day');}
  else goScr(prevScreen);
}
