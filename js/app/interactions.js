function buildInteractive(c, ia, btn){
  switch(c.inter){
    case 'breath':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">Вдох и пауза</div><div class="b-area"><div class="b-ring"></div></div></div>`;
      btn.textContent='Начать дыхание';btn.onclick=()=>startBreath(c);break;
    case 'anchor':
      const items=[{n:5,q:'5 вещей которые видишь',ph:'окно, чашка...'},{n:4,q:'4 вещи которые трогаешь',ph:'ткань...'},{n:3,q:'3 звука',ph:'тишина...'},{n:2,q:'2 запаха',ph:'чай...'},{n:1,q:'1 вкус',ph:''}];
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">Пять вещей рядом</div>${items.map((it)=>`<div class="anchor-step"><div class="anchor-step-h"><div class="anchor-num">${it.n}</div><div class="anchor-q">${it.q}</div></div><input class="anchor-input" placeholder="${it.ph||'...'}"/></div>`).join('')}</div>`;
      btn.textContent='Готово';btn.onclick=()=>{recordHistory();showFeedback();};break;
    case 'timer':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">${c.timerText}</div><div class="timer-wrap"><div class="timer-circle"><div class="timer-num" id="tm-n">${c.timer}</div></div><div class="timer-bar"><div class="timer-fill" id="tm-f" style="width:0%"></div></div><div class="timer-status" id="tm-s">нажми старт</div></div></div>`;
      btn.textContent='Старт';btn.onclick=()=>startTimer(c.timer,btn);break;
    case 'journal':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">Строки для себя</div>${(c.prompts||[]).map(p=>`<div class="journal-prompt">${p}</div>`).join('')}<textarea class="journal-input" id="j-text" placeholder="пиши..."></textarea></div>`;
      btn.textContent='Сохранить';btn.onclick=()=>{const text=ia.querySelector('#j-text').value.trim();if(text){notes.unshift({date:Date.now(),title:c.n,text});writeStored('notes',notes);}recordHistory();showFeedback();};break;
    case 'three':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">Три тёплых момента</div><div class="three-num">первый</div><input class="three-input" id="th1" placeholder="..."/><div class="three-num" style="margin-top:8px">второй</div><input class="three-input" id="th2" placeholder="..."/><div class="three-num" style="margin-top:8px">третий</div><input class="three-input" id="th3" placeholder="..."/></div>`;
      btn.textContent='Сохранить';btn.onclick=()=>{const t1=ia.querySelector('#th1').value.trim(),t2=ia.querySelector('#th2').value.trim(),t3=ia.querySelector('#th3').value.trim();if(t1||t2||t3){notes.unshift({date:Date.now(),title:c.n,text:[t1,t2,t3].filter(Boolean).map((x,i)=>`${i+1}. ${x}`).join('\n')});writeStored('notes',notes);}recordHistory();showFeedback();};break;
    case 'bodyscan':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">Медленно по телу</div><div class="body-scan"><svg class="body-svg" viewBox="0 0 110 200"><circle class="body-part" data-part="head" cx="55" cy="22" r="18"/><rect class="body-part" data-part="neck" x="48" y="38" width="14" height="12" rx="3"/><rect class="body-part" data-part="shoulders" x="22" y="50" width="66" height="14" rx="6"/><rect class="body-part" data-part="chest" x="30" y="62" width="50" height="38" rx="8"/><rect class="body-part" data-part="arms" x="10" y="64" width="14" height="50" rx="6"/><rect class="body-part" data-part="arms2" x="86" y="64" width="14" height="50" rx="6"/><rect class="body-part" data-part="belly" x="32" y="98" width="46" height="30" rx="6"/><rect class="body-part" data-part="legs" x="34" y="128" width="18" height="60" rx="6"/><rect class="body-part" data-part="legs2" x="58" y="128" width="18" height="60" rx="6"/></svg></div><div class="body-status" id="bs-status">нажми старт</div></div>`;
      btn.textContent='Начать';btn.onclick=()=>startBodyScan(ia,btn);break;
    case 'clouds':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">Мысль — и в небо</div><input class="cloud-input" id="cl-in" placeholder="что в голове? (Enter)"/><div class="cloud-area" id="cl-area"><div class="cloud-empty" id="cl-empty">мысли улетят сюда...</div></div></div>`;
      const inp=ia.querySelector('#cl-in');const area=ia.querySelector('#cl-area');
      inp.onkeypress=(e)=>{if(e.key==='Enter'&&inp.value.trim()){area.querySelector('#cl-empty')?.remove();const cl=document.createElement('div');cl.className='cloud-item';cl.textContent=inp.value;cl.style.left=Math.random()*40+'%';area.appendChild(cl);setTimeout(()=>cl.remove(),4000);inp.value='';}};
      btn.textContent='Готово';btn.onclick=()=>{recordHistory();showFeedback();};break;
    case 'letter':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">Письмо без адреса</div><div class="letter-paper"><div class="letter-greet">${c.greet||'Дорогая,'}</div><textarea class="letter-input" id="lt-text" placeholder="пиши..."></textarea></div></div>`;
      btn.textContent='Сохранить';btn.onclick=()=>{const text=ia.querySelector('#lt-text').value.trim();if(text){notes.unshift({date:Date.now(),title:c.n,text:c.greet+'\n\n'+text});writeStored('notes',notes);}recordHistory();showFeedback();};break;
    case 'heart':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">Положи руку на сердце</div><div class="heart-wrap"><div class="heart">❤️</div><div class="heart-text" id="ht-t">«я здесь»</div></div></div>`;
      const phrases=['«я здесь»','«мне сейчас тяжело»','«это нормально»','«я не одна»','«я добра к себе»'];
      let pi=0;const ht=ia.querySelector('#ht-t');
      phraseInt=setInterval(()=>{pi=(pi+1)%phrases.length;ht.style.opacity='0';setTimeout(()=>{ht.textContent=phrases[pi];ht.style.opacity='1';},300);},3500);
      btn.textContent='Готово';btn.onclick=()=>{if(phraseInt){clearInterval(phraseInt);phraseInt=null;}recordHistory();showFeedback();};break;
    case 'affirmations':
      let ai=0;const affs=c.affs||[];
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">Тихие слова</div><div class="aff-card"><div class="aff-text" id="aff-t">${affs[0]}</div></div><div class="aff-nav">${affs.map((_,i)=>`<div class="aff-dot ${i===0?'active':''}"></div>`).join('')}</div><button class="t-btn-secondary" id="aff-next">Следующая →</button></div>`;
      ia.querySelector('#aff-next').onclick=()=>{ai=(ai+1)%affs.length;ia.querySelector('#aff-t').textContent=affs[ai];ia.querySelectorAll('.aff-dot').forEach((d,i)=>d.classList.toggle('active',i===ai));};
      btn.textContent='Готово';btn.onclick=()=>{recordHistory();showFeedback();};break;
    case 'colorbreath':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">Круг и дыхание</div><div style="display:flex;flex-direction:column;align-items:center"><div id="cb-c" style="width:130px;height:130px;border-radius:50%;background:#d4bfa0;transition:all 4s"></div><div id="cb-i" style="font-family:'Playfair Display',serif;font-style:italic;font-size:16px;color:#5c4735;text-align:center;margin-top:16px;min-height:50px">нажми старт</div></div></div>`;
      btn.textContent='Начать';btn.onclick=()=>{const c2=ia.querySelector('#cb-c');const inst=ia.querySelector('#cb-i');const phases=[{color:'#d4bfa0',size:'180px',text:'вдох — наполняйся теплом',dur:4000},{color:'#b89b7a',size:'180px',text:'задержи',dur:2000},{color:'#f9f3ea',size:'80px',text:'выдох — отпусти',dur:6000}];let cyc=0,ph=0;function step(){if(cyc>=4){inst.textContent='✓ хорошо';c2.style.width='130px';c2.style.height='130px';c2.style.background='#d4bfa0';recordHistory();showFeedback();return;}const p=phases[ph];inst.textContent=p.text;c2.style.transition=`all ${p.dur}ms ease-in-out`;c2.style.background=p.color;c2.style.width=p.size;c2.style.height=p.size;setTimeout(()=>{ph=(ph+1)%phases.length;if(ph===0)cyc++;step();},p.dur);}step();};break;
    case 'pmr':
      const pmrSteps=[{n:'Кулаки',a:'Сожми крепко',d:5},{n:'Плечи',a:'Подними к ушам',d:5},{n:'Лицо',a:'Зажмурься',d:5},{n:'Живот',a:'Напряги пресс',d:5},{n:'Ноги',a:'Сожми бёдра',d:5}];
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">Напрячь и отпустить</div><div style="padding:16px;background:#fdf8f2;border-radius:14px;border:1.5px solid #e8d9c4;text-align:center"><div id="pmr-n" style="font-family:'Playfair Display',serif;font-size:18px;color:#5c4735;margin-bottom:8px">${pmrSteps[0].n}</div><div id="pmr-a" style="font-size:14px;color:#7a6050;margin-bottom:12px;font-weight:600">${pmrSteps[0].a}</div><div id="pmr-t" style="font-family:'Playfair Display',serif;font-size:32px;color:#8a6e52">5</div></div></div>`;
      btn.textContent='Начать';btn.onclick=()=>{let i=0;const nE=ia.querySelector('#pmr-n');const aE=ia.querySelector('#pmr-a');const tE=ia.querySelector('#pmr-t');if(tInt){clearInterval(tInt);tInt=null;}function tense(){if(i>=pmrSteps.length){nE.textContent='✓ Готово';aE.textContent='тело расслаблено';tE.textContent='';recordHistory();showFeedback();return;}const s=pmrSteps[i];nE.textContent=s.n;aE.textContent=s.a;let n=s.d;tE.textContent=n;tInt=setInterval(()=>{n--;tE.textContent=n;if(n<=0){clearInterval(tInt);tInt=null;aE.textContent='отпусти. почувствуй разницу.';tE.textContent='3';let r=3;tInt=setInterval(()=>{r--;tE.textContent=r;if(r<=0){clearInterval(tInt);tInt=null;i++;tense();}},1000);}},1000);}tense();};break;
    case 'choices':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">${c.prompt||'Выбери то, что ближе'}</div><div id="choice-wrap" style="display:flex;flex-wrap:wrap;gap:10px">${(c.options||[]).map((opt,idx)=>`<button type="button" class="t-btn-secondary choice-opt" data-idx="${idx}" style="margin:0">${opt}</button>`).join('')}</div><div id="choice-note" style="margin-top:14px;font-size:14px;color:#7a6050;min-height:22px"></div></div>`;
      btn.textContent='Готово';
      btn.disabled=true;
      btn.style.opacity='0.45';
      const choiceMap=c.responses||{};
      ia.querySelectorAll('.choice-opt').forEach((opt)=>{
        opt.onclick=()=>{
          ia.querySelectorAll('.choice-opt').forEach((b)=>b.classList.remove('on'));
          opt.classList.add('on');
          const idx=opt.dataset.idx;
          ia.querySelector('#choice-note').textContent=choiceMap[idx]||'пусть это будет твоей точкой на сейчас';
          btn.disabled=false;
          btn.style.opacity='1';
        };
      });
      btn.onclick=()=>{recordHistory();showFeedback();};
      break;
    case 'checklist':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">${c.prompt||'Отмечай по ходу'}</div><div id="checklist-wrap" style="display:flex;flex-direction:column;gap:10px">${(c.steps||[]).map((step,idx)=>`<button type="button" class="choice-opt" data-idx="${idx}" style="display:flex;align-items:center;gap:10px;justify-content:flex-start;padding:12px 14px;border:1.5px solid #e8d9c4;border-radius:14px;background:#fffaf4;color:#5c4735"><span style="width:20px;height:20px;border-radius:50%;border:1.5px solid #ccb392;display:inline-flex;align-items:center;justify-content:center;font-size:12px">○</span><span>${step}</span></button>`).join('')}</div><div id="checklist-note" style="margin-top:14px;font-size:14px;color:#7a6050">собери все пункты в своём темпе</div></div>`;
      btn.textContent='Готово';
      btn.disabled=true;
      btn.style.opacity='0.45';
      {
        const doneSet=new Set();
        ia.querySelectorAll('#checklist-wrap .choice-opt').forEach((item)=>{
          item.onclick=()=>{
            const idx=item.dataset.idx;
            if(doneSet.has(idx)){doneSet.delete(idx);item.classList.remove('on');item.querySelector('span').textContent='○';}
            else {doneSet.add(idx);item.classList.add('on');item.querySelector('span').textContent='✓';}
            const all=ia.querySelectorAll('#checklist-wrap .choice-opt').length;
            ia.querySelector('#checklist-note').textContent=`готово ${doneSet.size} из ${all}`;
            btn.disabled=doneSet.size!==all;
            btn.style.opacity=doneSet.size===all?'1':'0.45';
          };
        });
      }
      btn.onclick=()=>{recordHistory();showFeedback();};
      break;
    case 'slider':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">${c.prompt||'Отметь, как сейчас'}</div><div style="padding:10px 6px"><input id="soft-slider" type="range" min="${c.min||0}" max="${c.max||10}" value="${c.start||5}" style="width:100%"/><div style="display:flex;justify-content:space-between;font-size:12px;color:#8b7361;margin-top:8px"><span>${c.left||'меньше'}</span><span>${c.right||'больше'}</span></div><div id="slider-text" style="margin-top:14px;font-size:14px;color:#5c4735;text-align:center">${c.messages?.[c.start||5]||c.sliderHint||'заметь, как это ощущается'}</div></div></div>`;
      btn.textContent='Готово';
      {
        const input=ia.querySelector('#soft-slider');
        const out=ia.querySelector('#slider-text');
        input.oninput=()=>{out.textContent=(c.messages&&c.messages[input.value])||`${c.sliderHint||'сейчас так'} ${input.value}`;};
      }
      btn.onclick=()=>{recordHistory();showFeedback();};
      break;
    case 'release':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">${c.prompt||'Отпускай по одному касанию'}</div><div style="font-size:14px;color:#7a6050;margin-bottom:12px">${c.sup||'нажимай на круги, пока не станет пусто'}</div><div id="release-wrap" style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">${Array.from({length:c.count||6},(_,idx)=>`<button type="button" class="choice-opt rel-dot" data-idx="${idx}" style="aspect-ratio:1;border-radius:18px;border:1.5px solid #e3d4bf;background:radial-gradient(circle at 30% 30%, #fff7ef, #ead7c0);font-size:24px;color:#8a6e52">•</button>`).join('')}</div><div id="release-note" style="margin-top:14px;font-size:14px;color:#7a6050">нажми на все круги</div></div>`;
      btn.textContent='Готово';
      btn.disabled=true;
      btn.style.opacity='0.45';
      {
        let left=(c.count||6);
        ia.querySelectorAll('.rel-dot').forEach((dot)=>{
          dot.onclick=()=>{
            if(dot.disabled)return;
            dot.disabled=true;
            dot.textContent=' ';
            dot.style.opacity='0.35';
            left-=1;
            ia.querySelector('#release-note').textContent=left>0?`осталось ${left}`:'✓ можно выдохнуть';
            if(left===0){btn.disabled=false;btn.style.opacity='1';}
          };
        });
      }
      btn.onclick=()=>{recordHistory();showFeedback();};
      break;
    case 'sequence':
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">${c.prompt||'Идём шаг за шагом'}</div><div id="sequence-card" style="padding:18px;background:#fffaf4;border:1.5px solid #e8d9c4;border-radius:16px;text-align:center"><div id="sequence-step" style="font-family:'Playfair Display',serif;font-size:22px;color:#5c4735;margin-bottom:10px">1</div><div id="sequence-text" style="font-size:15px;color:#5c4735;line-height:1.5">${(c.steps||[])[0]||''}</div></div><button type="button" id="sequence-next" class="t-btn-secondary" style="margin-top:12px">Дальше</button></div>`;
      btn.textContent='Готово';
      btn.disabled=true;
      btn.style.opacity='0.45';
      {
        const steps=c.steps||[];
        let cur=0;
        const stepEl=ia.querySelector('#sequence-step');
        const textEl=ia.querySelector('#sequence-text');
        const nextEl=ia.querySelector('#sequence-next');
        nextEl.onclick=()=>{
          cur+=1;
          if(cur>=steps.length){
            stepEl.textContent='✓';
            textEl.textContent='всё, можно оставить это с собой';
            nextEl.disabled=true;
            nextEl.style.opacity='0.45';
            btn.disabled=false;
            btn.style.opacity='1';
            return;
          }
          stepEl.textContent=String(cur+1);
          textEl.textContent=steps[cur];
        };
      }
      btn.onclick=()=>{recordHistory();showFeedback();};
      break;
    case 'simple':
    default:
      ia.innerHTML=`<div class="inter-box"><div class="inter-label">По шагам, без спешки</div>${(c.steps||[c.d||c.result]).map((s,i)=>`<div style="display:flex;gap:12px;margin-bottom:10px;align-items:flex-start;"><div style="width:24px;height:24px;border-radius:50%;background:#d4bfa0;color:#5c4735;font-size:12px;font-weight:600;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:2px;">${i+1}</div><div style="font-size:14px;color:#3d2f22;line-height:1.5;flex:1">${s}</div></div>`).join('')}</div>`;
      btn.textContent='Готово';btn.onclick=()=>{recordHistory();showFeedback();};
  }
}

function startBreath(c){if(!c.br)return;document.getElementById('bov').classList.add('on');runBreath(c.br);}
function runBreath(b){if(tInt){clearTimeout(tInt);tInt=null;}let cyc=0;const ring=document.getElementById('bigring');const stat=document.getElementById('bst'),cnt=document.getElementById('bcnt'),phEl=document.getElementById('bph'),cyclEl=document.getElementById('bcyc');function phase(p,dur,next){let n=dur;if(p==='in'){stat.textContent='Вдох';ring.style.transition=`transform ${dur}s ease-in-out`;ring.style.transform='scale(1.4)';}else if(p==='hold'){stat.textContent='Задержи';}else{stat.textContent='Выдох';ring.style.transition=`transform ${dur}s ease-in-out`;ring.style.transform='scale(1)';}cnt.textContent=n;phEl.textContent='секунды';const tick=()=>{n--;if(n<=0){next();return;}cnt.textContent=n;tInt=setTimeout(tick,1000);};tInt=setTimeout(tick,1000);}function cycle(){if(cyc>=b.c){done();return;}cyc++;cyclEl.textContent=`Цикл ${cyc} из ${b.c}`;phase('in',b.i,()=>{if(b.h>0)phase('hold',b.h,()=>phase('out',b.o,cycle));else phase('out',b.o,cycle);});}function done(){stat.textContent='✓ Готово';cnt.textContent='';phEl.textContent='';setTimeout(()=>{document.getElementById('bov').classList.remove('on');if(curRitualCb){curRitualCb();curRitualCb=null;}else{recordHistory();showFeedback();}},1500);}cycle();}
function stopBreath(){if(tInt){clearTimeout(tInt);tInt=null;}document.getElementById('bov').classList.remove('on');curRitualCb=null;}
function startTimer(seconds,btn){
  const n=document.getElementById('tm-n');
  const f=document.getElementById('tm-f');
  const s=document.getElementById('tm-s');
  if(!n||!f||!s){
    console.warn('Timer UI is missing');
    return;
  }
  let left=seconds;
  s.textContent='идёт...';
  if(btn)btn.disabled=true;
  if(tInt){clearInterval(tInt);tInt=null;}
  tInt=setInterval(()=>{
    left--;
    n.textContent=left>0?left:'✓';
    f.style.width=((seconds-left)/seconds*100)+'%';
    if(left<=0){
      clearInterval(tInt);tInt=null;
      s.textContent='готово';
      if(btn)btn.disabled=false;
      recordHistory();
      showFeedback();
    }
  },1000);
}
function startBodyScan(ia,btn){const parts=['head','neck','shoulders','chest','arms','arms2','belly','legs','legs2'];const labels={head:'голову',neck:'шею',shoulders:'плечи',chest:'грудь',arms:'руки',arms2:'руки',belly:'живот',legs:'ноги',legs2:'ноги'};const status=ia.querySelector('#bs-status');let i=0;if(tInt){clearInterval(tInt);tInt=null;}function step(){ia.querySelectorAll('.body-part').forEach(p=>p.classList.remove('active'));if(i>=parts.length){status.textContent='✓ всё тело расслаблено';clearInterval(tInt);tInt=null;recordHistory();showFeedback();return;}const part=parts[i];ia.querySelectorAll(`.body-part[data-part="${part}"]`).forEach(p=>p.classList.add('active'));if(part.endsWith('2'))ia.querySelectorAll(`.body-part[data-part="${part.slice(0,-1)}"]`).forEach(p=>p.classList.add('active'));status.textContent=`почувствуй ${labels[part]}`;i++;}step();tInt=setInterval(step,4500);}

function showFeedback(){
  const sh=document.getElementById('tech-shuffle-slot');if(sh)sh.innerHTML='';
  document.getElementById('feedback-area').innerHTML=`<div class="feedback-card"><div class="feedback-q">Как ты себя чувствуешь после?</div><div class="feedback-buttons"><button class="feedback-b" onclick="rateFeedback(1)">Полегче</button><button class="feedback-b" onclick="rateFeedback(0)">Чуть-чуть</button><button class="feedback-b" onclick="rateFeedback(-1)">Пока нет</button></div></div>`;
  document.getElementById('bs').style.display='none';document.getElementById('br').style.display='block';document.getElementById('br').onclick=()=>openCard(curSec, curCardIdx, prevScreen==='day');
}
function rateFeedback(r){if(history.length>0)history[0].rating=r;writeStored('hist',history);document.getElementById('feedback-area').innerHTML='';toast(r>0?'Рада за тебя 🌸':r===0?'Хорошо что попробовала':'Попробуй ещё одну');}
function recordHistory(){if(!curCard)return;history.unshift({date:Date.now(),title:curCard.n,emoji:curCard.i,key:curCardKey,rating:null});if(history.length>50)history=history.slice(0,50);writeStored('hist',history);}
function toggleFav(){if(!curCardKey)return;if(favs.includes(curCardKey)){favs=favs.filter(k=>k!==curCardKey);document.getElementById('fav-btn').textContent='♡';toast('Убрано');}else{favs.push(curCardKey);document.getElementById('fav-btn').textContent='♥';toast('В ♥ любимые');}writeStored('favs',favs);}

let curTab='fav';
function switchTab(el,tab){document.querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));el.classList.add('on');curTab=tab;renderJournal();}
function renderJournal(){
  document.getElementById('j-streak').textContent=streak;
  const c=document.getElementById('j-content');
  if(curTab==='fav'){if(favs.length===0){c.innerHTML='<div class="j-empty">пока пусто. открой карточку и нажми ♡</div>';return;}c.innerHTML=favs.map(k=>{const [sid,idx]=k.split('-');const idxNum=parseInt(idx,10);if(!/^[a-z0-9_]+$/i.test(sid)||Number.isNaN(idxNum))return '';const card=CARDS[sid]?.[idxNum];if(!card)return '';return `<div class="j-entry" onclick="openCard('${sid}',${idxNum})" style="cursor:pointer"><div class="j-entry-t">${escHtml(card.i)} ${escHtml(card.n)}</div><div class="j-entry-x">${escHtml(card.result)}</div></div>`;}).join('');}
  else if(curTab==='history'){if(history.length===0){c.innerHTML='<div class="j-empty">история появится</div>';return;}c.innerHTML=history.slice(0,20).map(h=>{const d=new Date(h.date);const dt=d.toLocaleDateString('ru',{day:'numeric',month:'short'})+' · '+d.toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'});const r=h.rating===1?' · легче 🌿':h.rating===0?' · чуть-чуть':'';return `<div class="j-entry"><div class="j-entry-d">${escHtml(dt+r)}</div><div class="j-entry-t">${escHtml(h.emoji)} ${escHtml(h.title)}</div></div>`;}).join('');}
  else {if(notes.length===0){c.innerHTML='<div class="j-empty">записи появятся</div>';return;}c.innerHTML=notes.slice(0,20).map(n=>{const d=new Date(n.date);const dt=d.toLocaleDateString('ru',{day:'numeric',month:'short'});return `<div class="j-entry"><div class="j-entry-d">${escHtml(dt)}</div><div class="j-entry-t">${escHtml(n.title)}</div><div class="j-entry-x" style="white-space:pre-wrap;margin-top:6px">${escHtml(n.text)}</div></div>`;}).join('');}
  enhanceInteractiveElements(c);
}

function toggleSound(el,name){
  document.querySelectorAll('.sound-c').forEach(c=>c.classList.remove('playing'));
  if(curSound===name){stopSound();curSound=null;toast('Звук выключен');return;}
  stopSound();
  try{curSoundNodes=playSound(name);curSound=name;el.classList.add('playing');toast(`играет: ${el.querySelector('.sound-l').textContent.toLowerCase()} 🌿`);}
  catch(e){toast('звук не запустился');}
}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('on');setTimeout(()=>t.classList.remove('on'),2500);}
