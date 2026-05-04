// ============== 30 DAYS ==============
function getCurrentDay(){for(let i=1;i<=30;i++){if(!r30Done.includes(i))return i;}return 30;}

function renderReset(){
  if(!window.PROGRAM){return;}
  const done=r30Done.length;
  document.getElementById('r30-progress-text').textContent=`${done} из 30 дней`;
  document.getElementById('r30-progress-fill').style.width=(done/30*100)+'%';
  const c=document.getElementById('r30-content');
  let html='';
  if(done===0)html+=`<div class="r30-empty-cta"><div class="r30-empty-cta-t">«готова начать путь?»</div><div class="r30-empty-cta-d">30 дней мягкой работы. С первого дня станет легче.</div><button class="r30-empty-cta-btn" onclick="openDay(1)">Начать день 1</button></div>`;
  const todayNum=getCurrentDay();
  window.PROGRAM.weeks.forEach(w=>{
    const daysInWeek=window.PROGRAM.days.filter(d=>d.week===w.num);
    html+=`<div class="r30-week"><div class="r30-week-h"><div class="r30-week-num">Неделя ${w.num}</div><div class="r30-week-name">${w.name}</div></div><div class="r30-week-sub">${w.sub}</div><div class="r30-days">`;
    daysInWeek.forEach(d=>{
      const isDone=r30Done.includes(d.d);
      const isToday=d.d===todayNum && !isDone;
      const cls=`r30-day ${isDone?'done':''} ${isToday?'today':''}`;
      const total=d.morning.length+1+d.tips.length+d.evening.length;
      html+=`<div class="${cls}" onclick="openDay(${d.d})"><div class="r30-d-num">${d.d}</div><div class="r30-d-title">${d.name}</div><div class="r30-d-meta">${total} пунктов</div><div class="r30-d-icon"></div></div>`;
    });
    html+=`</div></div>`;
  });
  document.getElementById('r30-content').innerHTML=html;
  enhanceInteractiveElements(document.getElementById('r30-content'));
}

function openDay(num){curDay=num;renderDay(num);goScr('day');}

function renderDay(num){
  const day=window.PROGRAM.days[num-1];
  if(!day)return;
  const st=getDayState(num);
  const total=day.morning.length+1+day.tips.length+day.evening.length;
  let done=(st.checked.morning?.length||0)+(st.checked.evening?.length||0)+(st.checked.tips?.length||0)+(st.practiceDone?1:0);
  const pct=Math.round(done/total*100);

  let html=`<div class="day-hero">
    <div class="day-topbar"><div class="back" onclick="goScr('reset30')">‹</div><div class="day-progress-text">${done} / ${total} выполнено</div></div>
    <div class="day-tag">День ${num} · Неделя ${day.week}</div>
    <div class="day-title">${day.name}</div>
    <div class="day-tagline">${day.tagline}</div>
    <div class="day-pb"><div class="day-pb-fill" style="width:${pct}%"></div></div>
    </div><div class="day-content">`;

  // Morning mood
  html+=`<div class="day-section"><div class="day-section-h"><span class="day-section-em">😊</span><div class="day-section-name">Как ты с утра?</div></div><div class="day-mood-row">`;
  ['🌧️','😐','🙂','😊','✨'].forEach((em,i)=>{
    const labels=['тяжело','так себе','норм','хорошо','отлично'];
    const isSelected=st.moodM===em;
    html+=`<div class="day-mood-c ${isSelected?'selected':''}" onclick="setDayMood(${num},'M','${em}')"><div class="day-mood-em">${em}</div><div class="day-mood-l">${labels[i]}</div></div>`;
  });
  html+=`</div></div>`;

  // Water
  const water=st.water||0;
  const maxWater=8;
  let glassesHtml='';
  for(let i=0;i<maxWater;i++)glassesHtml+=`<div class="day-glass ${i<water?'full':''}"></div>`;
  html+=`<div class="day-water"><div class="day-water-info"><div class="day-water-label">вода сегодня</div><div class="day-water-count">${water} / ${maxWater} стаканов</div></div><div class="day-water-glasses" onclick="addWater(${num})">${glassesHtml}</div></div>`;

  // Morning rituals
  const mDone=(st.checked.morning||[]).length;
  html+=`<div class="day-section"><div class="day-section-h"><span class="day-section-em">🌅</span><div class="day-section-name">Утренние ритуалы</div><div class="day-section-count">${mDone} / ${day.morning.length}</div></div>`;
  day.morning.forEach((r,i)=>{
    const isDone=(st.checked.morning||[]).includes(i);
    const inputVal=st.inputs?.['M'+i];
    html+=`<div class="day-card ${isDone?'done':''}" onclick="doRitualItem(${num},'morning',${i})"><div class="day-check">${isDone?'✓':''}</div><div class="day-card-em">${r.em}</div><div class="day-card-text"><div class="day-card-name">${r.name}</div>${r.tip?`<div class="day-card-tip">${r.tip}</div>`:''}${inputVal?`<div class="day-card-input-val">«${escHtml(inputVal)}»</div>`:''}</div>${!isDone?'<div class="day-card-arr">›</div>':''}</div>`;
  });
  html+=`</div>`;

  // Main practice
  const pDone=st.practiceDone;
  html+=`<div class="day-practice ${pDone?'done':''}" onclick="doMainPractice(${num})"><div class="day-prac-tag">${pDone?'✓ выполнено':'★ практика дня'}</div><div class="day-prac-em">${day.practice.em}</div><div class="day-prac-name">${day.practice.name}</div><div class="day-prac-desc">${day.practice.d}</div><div class="day-prac-meta"><div class="day-prac-time">⏱ ${day.practice.time}</div><div class="day-prac-cta">${pDone?'повторить ›':'начать ›'}</div></div></div>`;

  // Day tips
  const tDone=(st.checked.tips||[]).length;
  html+=`<div class="day-section"><div class="day-section-h"><span class="day-section-em">☀️</span><div class="day-section-name">Советы на сегодня</div><div class="day-section-count">${tDone} / ${day.tips.length}</div></div>`;
  day.tips.forEach((t,i)=>{
    const isDone=(st.checked.tips||[]).includes(i);
    html+=`<div class="day-card ${isDone?'done':''}" onclick="toggleCheck(${num},'tips',${i})"><div class="day-check">${isDone?'✓':''}</div><div class="day-card-em">${t.em}</div><div class="day-card-text"><div class="day-card-name">${t.name}</div></div></div>`;
  });
  html+=`</div>`;

  // Evening rituals
  const eDone=(st.checked.evening||[]).length;
  html+=`<div class="day-section"><div class="day-section-h"><span class="day-section-em">🌙</span><div class="day-section-name">Вечерние ритуалы</div><div class="day-section-count">${eDone} / ${day.evening.length}</div></div>`;
  day.evening.forEach((r,i)=>{
    const isDone=(st.checked.evening||[]).includes(i);
    const inputVal=st.inputs?.['E'+i];
    html+=`<div class="day-card ${isDone?'done':''}" onclick="doRitualItem(${num},'evening',${i})"><div class="day-check">${isDone?'✓':''}</div><div class="day-card-em">${r.em}</div><div class="day-card-text"><div class="day-card-name">${r.name}</div>${r.tip?`<div class="day-card-tip">${r.tip}</div>`:''}${inputVal?`<div class="day-card-input-val">«${escHtml(inputVal)}»</div>`:''}</div>${!isDone?'<div class="day-card-arr">›</div>':''}</div>`;
  });
  html+=`</div>`;

  // Evening mood
  html+=`<div class="day-section"><div class="day-section-h"><span class="day-section-em">🌙</span><div class="day-section-name">Как ты к концу дня?</div></div><div class="day-mood-row">`;
  ['🌧️','😐','🙂','😊','✨'].forEach((em,i)=>{
    const labels=['тяжело','так себе','норм','хорошо','отлично'];
    const isSelected=st.moodE===em;
    html+=`<div class="day-mood-c ${isSelected?'selected':''}" onclick="setDayMood(${num},'E','${em}')"><div class="day-mood-em">${em}</div><div class="day-mood-l">${labels[i]}</div></div>`;
  });
  html+=`</div></div>`;

  // Quote + finish
  html+=`<div class="day-quote"><div class="day-quote-t">${day.quote}</div></div>`;
  const isFinished=r30Done.includes(num);
  html+=`<button class="day-finish ${isFinished?'done':''}" onclick="finishDay(${num})">${isFinished?'✓ День завершён':'Завершить день'}</button>`;
  html+=`</div>`;

  document.getElementById('day-wrap').innerHTML=html;
  enhanceInteractiveElements(document.getElementById('day-wrap'));
}

function setDayMood(d,when,em){const st=getDayState(d);st['mood'+when]=em;saveR30();renderDay(d);}
function addWater(d){const st=getDayState(d);st.water=(st.water||0)+1;if(st.water>8)st.water=0;saveR30();renderDay(d);}
function toggleCheck(d,section,idx){const st=getDayState(d);if(!st.checked[section])st.checked[section]=[];const i=st.checked[section].indexOf(idx);if(i>=0)st.checked[section].splice(i,1);else st.checked[section].push(idx);saveR30();renderDay(d);}

let curRitualCb=null;
function doRitualItem(d,section,idx){
  const day=window.PROGRAM.days[d-1];
  const item=day[section][idx];
  const st=getDayState(d);
  // already done? toggle off
  if((st.checked[section]||[]).includes(idx)){toggleCheck(d,section,idx);return;}

  switch(item.type){
    case 'check':
    case 'water':
      toggleCheck(d,section,idx);
      if(item.type==='water')addWater(d);
      break;
    case 'breath':
      curRitualCb=()=>{toggleCheck(d,section,idx);renderDay(d);};
      document.getElementById('bov').classList.add('on');
      runBreath(item.br);
      break;
    case 'timer':
      startRitualTimer(item.seconds||60,item.name,item.tip||'',()=>{toggleCheck(d,section,idx);});
      break;
    case 'input':
      openInputModal(item.name,item.tip||'',item.placeholder||'',(val)=>{
        st.inputs=st.inputs||{};
        st.inputs[(section==='morning'?'M':'E')+idx]=val;
        if(!st.checked[section])st.checked[section]=[];
        if(!st.checked[section].includes(idx))st.checked[section].push(idx);
        saveR30();renderDay(d);
      });
      break;
    case 'journal':
      // open journal as if it's a card
      curCard={i:item.em,n:item.name,result:item.tip||item.name,sup:'',inter:'journal',prompts:item.prompts||[item.name],time:'5 мин'};
      curCardKey=`day${d}-${section}-${idx}`;
      curSec='day';curCardIdx=idx;prevScreen='day';
      // mark as done after closing
      curRitualCb=()=>{toggleCheck(d,section,idx);};
      document.getElementById('te').textContent=item.em;
      document.getElementById('tt').textContent=item.name;
      document.getElementById('tresult').textContent=item.tip||'запиши свои мысли';
      document.getElementById('tres-label').textContent=whisperLabelForCard('rj'+d+section+idx, 0);
      document.getElementById('tsup').textContent='';
      document.getElementById('fav-btn').textContent='♡';
      const ia=document.getElementById('interactive-area');
      ia.innerHTML='';
      document.getElementById('feedback-area').innerHTML='';
      const bs=document.getElementById('bs');const br=document.getElementById('br');
      bs.style.display='block';br.style.display='none';
      buildInteractive(curCard, ia, bs);
      // override save handler to mark ritual done
      bs.onclick=()=>{
        const text=ia.querySelector('#j-text').value.trim();
        if(text){notes.unshift({date:Date.now(),title:item.name,text});writeStored('notes',notes);}
        toggleCheck(d,section,idx);
        goScr('day');
        renderDay(d);
        toast('Ритуал выполнен ✓');
      };
      const ss1=document.getElementById('tech-shuffle-slot');if(ss1)ss1.innerHTML='';
      goScr('tech');
      break;
    default:
      toggleCheck(d,section,idx);
  }
}

function doMainPractice(d){
  const day=window.PROGRAM.days[d-1];
  const p=day.practice;
  const st=getDayState(d);
  // build pseudo-card from practice
  curCard={i:p.em,n:p.name,result:p.d,sup:p.d,inter:p.type,br:p.br,timer:p.seconds||60,timerText:p.name,prompts:p.prompts,affs:p.affs,greet:p.greet,steps:p.steps,time:p.time};
  curCardKey=`day${d}-practice`;
  curSec='day';curCardIdx=0;prevScreen='day';
  document.getElementById('te').textContent=p.em;
  document.getElementById('tt').textContent=p.name;
  document.getElementById('tresult').textContent=p.d;
  document.getElementById('tres-label').textContent=whisperLabelForCard('pd'+d, 0);
  document.getElementById('tsup').textContent='';
  document.getElementById('fav-btn').textContent='♡';
  const ia=document.getElementById('interactive-area');
  ia.innerHTML='';
  document.getElementById('feedback-area').innerHTML='';
  const bs=document.getElementById('bs');const br=document.getElementById('br');
  bs.style.display='block';br.style.display='none';
  buildInteractive(curCard, ia, bs);
  // wrap onclick to mark practice done
  const origClick=bs.onclick;
  bs.onclick=(e)=>{
    if(origClick)origClick(e);
    st.practiceDone=true;
    saveR30();
  };
  const ss2=document.getElementById('tech-shuffle-slot');if(ss2)ss2.innerHTML='';
  goScr('tech');
}

// Ritual timer modal
function startRitualTimer(seconds,name,tip,onDone){
  document.getElementById('tm-name').textContent=name;
  document.getElementById('tm-tip').textContent=tip;
  document.getElementById('tm-num').textContent=seconds;
  document.getElementById('timer-modal').classList.add('on');
  let left=seconds;
  if(ritualTimerInt){clearInterval(ritualTimerInt);}
  ritualTimerInt=setInterval(()=>{
    left--;
    document.getElementById('tm-num').textContent=left>0?left:'✓';
    if(left<=0){
      clearInterval(ritualTimerInt);ritualTimerInt=null;
      setTimeout(()=>{
        document.getElementById('timer-modal').classList.remove('on');
        onDone&&onDone();
        renderDay(curDay);
      },1500);
    }
  },1000);
}
function stopRitualTimer(){if(ritualTimerInt){clearInterval(ritualTimerInt);ritualTimerInt=null;}document.getElementById('timer-modal').classList.remove('on');}

// Input modal
function openInputModal(title,desc,ph,callback){
  document.getElementById('mi-title').textContent=title;
  document.getElementById('mi-desc').textContent=desc;
  const inp=document.getElementById('mi-input');
  inp.placeholder=ph;
  inp.value='';
  curInputCallback=callback;
  document.getElementById('input-modal').classList.add('on');
  setTimeout(()=>inp.focus(),300);
}
function closeInputModal(){document.getElementById('input-modal').classList.remove('on');curInputCallback=null;}
function saveInputModal(){const val=document.getElementById('mi-input').value.trim();if(val&&curInputCallback){curInputCallback(val);}closeInputModal();}

function finishDay(num){
  if(r30Done.includes(num)){toast('День уже завершён');return;}
  r30Done.push(num);saveR30();
  const isFinish=num===30;
  const isWeekEnd=[7,14,21].includes(num);
  const em=document.getElementById('celeb-em');
  const t=document.getElementById('celeb-t');
  const d=document.getElementById('celeb-d');
  if(isFinish){em.textContent='🌟';t.textContent='Ты прошла путь';d.textContent='30 дней. Ты стала ближе к себе. Это навсегда твоё.';}
  else if(isWeekEnd){const wn=window.PROGRAM.days[num-1].week;em.textContent='✨';t.textContent=`Неделя ${wn} завершена`;d.textContent='ты прошла большой кусок пути. отдохни и продолжай.';}
  else {em.textContent='🌸';t.textContent='День завершён';d.textContent='ты прошла ещё один шаг к себе. это много.';}
  document.getElementById('celeb').classList.add('on');
}
function closeCeleb(){document.getElementById('celeb').classList.remove('on');goScr('reset30');}
