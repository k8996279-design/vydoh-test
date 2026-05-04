const QUIZ_RECOMMENDATIONS={
  calm:{
    quick:{sec:'fast',cardIdx:0,greet:'быстро вернуть дыхание',msg:'«начнём с одной минуты»'},
    soft:{sec:'anxious',cardIdx:0,greet:'сначала успокоим мысли',msg:'«вернуться в комнату — уже помощь»'},
    deep:{sec:'anxious',cardIdx:2,greet:'голове нужно место',msg:'«выгрузить наружу, чтобы не тащить внутри»'}
  },
  sleep:{
    quick:{sec:'sleep',cardIdx:6,greet:'к сну без рывка',msg:'«тело может начать отпускать день»'},
    soft:{sec:'sleep',cardIdx:0,greet:'вечеру нужно тише',msg:'«медленный счёт как тёплая дверь ко сну»'},
    deep:{sec:'sleep',cardIdx:2,greet:'перед сном — через тело',msg:'«от пяток к макушке, без спешки»'}
  },
  energy:{
    quick:{sec:'fast',cardIdx:2,greet:'собраться за минуту',msg:'«комната рядом, пол под ногами»'},
    soft:{sec:'morning',cardIdx:0,greet:'мягко собраться',msg:'«не рывок, а первый спокойный шаг»'},
    deep:{sec:'reset',cardIdx:4,greet:'проветрить голову',msg:'«десять минут без шума — уже возвращение»'}
  },
  support:{
    quick:{sec:'sad',cardIdx:0,greet:'нужно немного тепла',msg:'«ладонь на сердце — маленькая опора»'},
    soft:{sec:'self',cardIdx:4,greet:'поддержка к себе',msg:'«одна минута тишины не обязана быть идеальной»'},
    deep:{sec:'sad',cardIdx:1,greet:'слово от себя к себе',msg:'«как письмо от близкой подруги»'}
  }
};

const FEEL_RECOMMENDATIONS={
  hard:{sec:'heavy',cardIdx:0,greet:'тяжело — начнём мягко',msg:'«маленький шаг: просто выдохни»'},
  anxious:{sec:'anxious',cardIdx:0,greet:'крутится в голове',msg:'«сегодня не нужно всё решать»'},
  tired:{sec:'self',cardIdx:7,greet:'устала — можно не тянуться вверх',msg:'«достаточно быть живой, не идеальной»'},
  angry:{sec:'angry',cardIdx:0,greet:'злость есть — и с ней можно',msg:'«дай ей дорогу через тело»'},
  sad:{sec:'sad',cardIdx:0,greet:'грустно — побудь с собой',msg:'«не нужно срочно веселиться»'},
  ok:{sec:'fast',cardIdx:0,greet:'просто пауза',msg:'«маленький шаг лучше ожиданий»'}
};

function getQuizRecommendation(answer){
  const byNeed=QUIZ_RECOMMENDATIONS[answer.need]?.[answer.time];
  if(byNeed)return {...byNeed,mood:answer.feel};
  const byFeel=FEEL_RECOMMENDATIONS[answer.feel]||FEEL_RECOMMENDATIONS.ok;
  return {...byFeel,mood:answer.feel};
}

function setQuizAnswer(group,value,el){
  moodQuiz[group]=value;
  const step=el.closest('.mood-step');
  if(step)step.querySelectorAll('.mood-choice').forEach((btn)=>btn.classList.toggle('selected',btn===el));
  const next=document.getElementById('mood-next');
  if(next)next.disabled=!(moodQuiz.feel&&moodQuiz.need&&moodQuiz.time);
}

function completeMoodQuiz(){
  if(!(moodQuiz.feel&&moodQuiz.need&&moodQuiz.time))return;
  const rec=getQuizRecommendation(moodQuiz);
  curMood=rec.mood||moodQuiz.feel||'ok';
  setStoredText('lastMood',curMood);
  setStoredText('lastNeed',moodQuiz.need);
  setStoredText('lastTime',moodQuiz.time);
  writeStored('lastQuizRec',rec);
  openCard(rec.sec,rec.cardIdx);
  toast('Подобрала практику под ответы');
}
