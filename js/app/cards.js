const CARD_TYPE_LABEL = { breath: 'вдох', journal: 'строки', timer: 'таймер', anchor: 'вокруг', clouds: 'улетает', letter: 'письмо', heart: 'ладонь', affirmations: 'слова', simple: 'по шагам', three: 'три строки', bodyscan: 'по телу', pmr: 'напрячь-отпустить', colorbreath: 'свет' };

const RESULT_WHISPER_LABELS = ['ещё несколько слов', 'тихо, по сути', 'если совсем просто', 'ни к чему не обязывает', 'можно просто услышать'];

function cardMicroHtml(inter) {
  switch (inter) {
    case 'breath':
      return '<div class="cd-micro cd-micro-breath" aria-hidden="true"><span></span><span></span><span></span><span></span></div>';
    case 'timer':
      return '<div class="cd-micro cd-micro-timer" aria-hidden="true"><span class="cmt-ring"></span></div>';
    case 'journal':
    case 'letter':
      return '<div class="cd-micro cd-micro-paper" aria-hidden="true"><i></i><i></i><i></i></div>';
    case 'anchor':
      return '<div class="cd-micro cd-micro-anchor" aria-hidden="true"><b>5</b><b>4</b><b>3</b><b>2</b><b>1</b></div>';
    case 'heart':
      return '<div class="cd-micro cd-micro-heartpulse" aria-hidden="true"><span class="cmh">♥</span></div>';
    case 'affirmations':
      return '<div class="cd-micro cd-micro-glimmer" aria-hidden="true"><span></span><span></span></div>';
    case 'clouds':
      return '<div class="cd-micro cd-micro-cloudmini" aria-hidden="true"><span></span><span></span></div>';
    case 'three':
      return '<div class="cd-micro cd-micro-three" aria-hidden="true"><span></span><span></span><span></span></div>';
    case 'bodyscan':
    case 'pmr':
      return '<div class="cd-micro cd-micro-bodywave" aria-hidden="true"><span></span><span></span><span></span></div>';
    case 'colorbreath':
      return '<div class="cd-micro cd-micro-orb" aria-hidden="true"></div>';
    case 'choices':
      return '<div class="cd-micro cd-micro-dashes" aria-hidden="true"><span></span><span></span><span></span></div>';
    case 'checklist':
      return '<div class="cd-micro cd-micro-three" aria-hidden="true"><span></span><span></span><span></span></div>';
    case 'slider':
      return '<div class="cd-micro cd-micro-timer" aria-hidden="true"><span class="cmt-ring"></span></div>';
    case 'release':
      return '<div class="cd-micro cd-micro-cloudmini" aria-hidden="true"><span></span><span></span></div>';
    case 'sequence':
      return '<div class="cd-micro cd-micro-paper" aria-hidden="true"><i></i><i></i><i></i></div>';
    default:
      return '<div class="cd-micro cd-micro-dashes" aria-hidden="true"><span></span><span></span><span></span></div>';
  }
}

function whisperLabelForCard(sid, idx) {
  const n = RESULT_WHISPER_LABELS.length;
  const code = sid.split('').reduce((a, ch) => a + ch.charCodeAt(0), 0);
  return RESULT_WHISPER_LABELS[(code + idx) % n];
}

function renderTechShuffle() {
  const slot = document.getElementById('tech-shuffle-slot');
  if (!slot) return;
  slot.innerHTML = '';
  if (!curSec || curSec === 'day' || !CARDS[curSec]) return;
  const arr = CARDS[curSec];
  if (arr.length < 2) return;
  const others = arr.map((_, i) => i).filter((i) => i !== curCardIdx);
  const pick = others[Math.floor(Math.random() * others.length)];
  slot.innerHTML = `<button type="button" class="t-shuffle" onclick="openCard('${curSec}',${pick})">Хочется другого — покажи ещё одну</button>`;
}

function escHtml(t) {
  if (!t) return '';
  return String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const ANXIETY_ICON_SVG = {
  eye: '<svg viewBox="0 0 32 32"><path d="M2.5 16s5-8 13.5-8 13.5 8 13.5 8-5 8-13.5 8S2.5 16 2.5 16Z"/><circle cx="16" cy="16" r="4.3"/></svg>',
  breath: '<svg viewBox="0 0 32 32"><path d="M15.5 7.5a8.5 8.5 0 1 1-8 11.4"/><path d="M15.8 12.2a3.9 3.9 0 1 1-3.7 5.3"/><path d="M16 2.5a13.5 13.5 0 1 1-12.8 18"/></svg>',
  pen: '<svg viewBox="0 0 32 32"><path d="M7 25h18"/><path d="M8 21 23.5 5.5a3.2 3.2 0 0 1 4.5 4.5L12.5 25H8v-4Z"/><path d="M20.5 8.5l3 3"/></svg>',
  lines: '<svg viewBox="0 0 32 32"><path d="M6 9h18"/><path d="M6 15h14"/><path d="M6 21h9"/></svg>',
  cloud: '<svg viewBox="0 0 32 32"><path d="M9.5 21.5h13a5 5 0 0 0 .2-10 7 7 0 0 0-13.3-1.8 6 6 0 0 0 .1 11.8Z"/></svg>',
  clock: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="10"/><path d="M16 9v7l4.5 3"/><path d="M8 4.5 5 7.5"/><path d="M24 4.5l3 3"/></svg>',
  square: '<svg viewBox="0 0 32 32"><rect x="7" y="7" width="18" height="18" rx="3"/><rect x="12" y="12" width="8" height="8" rx="1.5"/></svg>',
  box: '<svg viewBox="0 0 32 32"><path d="M16 4 6 9.5v12L16 27l10-5.5v-12L16 4Z"/><path d="M6 9.5 16 15l10-5.5"/><path d="M16 15v12"/></svg>',
  sun: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="3"/><path d="M16 3v4"/><path d="M16 25v4"/><path d="M3 16h4"/><path d="M25 16h4"/><path d="m6.8 6.8 2.8 2.8"/><path d="m22.4 22.4 2.8 2.8"/><path d="m25.2 6.8-2.8 2.8"/><path d="m9.6 22.4-2.8 2.8"/></svg>',
  count: '<svg viewBox="0 0 32 32"><path d="M8 6h16v20H8z"/><path d="M12 10h2"/><path d="M18 10h2"/><path d="M12 15h2"/><path d="M18 15h2"/><path d="M12 20h2"/><path d="M18 20h2"/></svg>',
  hand: '<svg viewBox="0 0 32 32"><path d="M10 17V9.5a2 2 0 0 1 4 0V16"/><path d="M14 16V7.5a2 2 0 0 1 4 0V16"/><path d="M18 16V9.5a2 2 0 0 1 4 0V17"/><path d="M10 17c-2.4-2.2-4-2.1-4.8-.9-.8 1.3.5 3 2.5 5.2 2.3 2.6 4.8 4.7 9 4.7 5.4 0 8.3-3.5 8.3-8.8V13a2 2 0 0 0-4 0"/></svg>',
  body: '<svg viewBox="0 0 32 32"><circle cx="16" cy="5" r="2"/><path d="M16 7v19"/><path d="M11 12h10"/><path d="M12 26h8"/><path d="M13 17l-3 4"/><path d="M19 17l3 4"/></svg>',
  hourglass: '<svg viewBox="0 0 32 32"><path d="M9 5h14"/><path d="M11 5c0 4 2 6.5 5 8.5 3-2 5-4.5 5-8.5"/><path d="M11 27h10"/><path d="M11 27c0-4 2-6.5 5-8.5 3 2 5 4.5 5 8.5"/><path d="M16 13.5v5"/></svg>',
  arrow: '<svg viewBox="0 0 32 32"><path d="M6 16h19"/><path d="m18 9 7 7-7 7"/></svg>',
  pause: '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="10"/><path d="M12 12v8"/><path d="M20 12v8"/></svg>',
  wave: '<svg viewBox="0 0 32 32"><path d="M4 18c3-5 6-5 9 0s6 5 9 0 4-5 6 0"/><path d="M4 23c3-5 6-5 9 0s6 5 9 0 4-5 6 0"/></svg>',
  heart: '<svg viewBox="0 0 32 32"><path d="M16 27s-10-6.1-10-14a5.6 5.6 0 0 1 10-3.5A5.6 5.6 0 0 1 26 13c0 7.9-10 14-10 14Z"/></svg>',
  drop: '<svg viewBox="0 0 32 32"><path d="M16 4s8 9.2 8 15.2A8 8 0 0 1 8 19.2C8 13.2 16 4 16 4Z"/></svg>'
};

const ANXIETY_FINAL_ITEMS = [
  {sid:'anxious',idx:0,tone:'tone-sage',icon:'eye',title:'Пять вещей вокруг',sub:'снова здесь, в этой комнате',desc:'Без анализа — только то, что видишь и чувствуешь пальцами. Самый быстрый способ вернуться в тело.',kind:'заземление',steps:['Назови 5 вещей, которые видишь','Потрогай 4 предмета рядом','Услышь 3 звука вокруг','Почувствуй 2 запаха','Ощути 1 вкус']},
  {sid:'anxious',idx:1,tone:'tone-lavender',icon:'breath',badge:'мягкий старт',title:'Дыхание 4–7–8',sub:'дыхание станет длиннее',desc:'Мягкий ритм для момента, когда внутри слишком много движения. Счёт помогает телу вспомнить выдох.',kind:'дыхание',steps:['Вдохни на 4 счёта','Задержи дыхание на 7','Выдохни на 8','Повтори 4 спокойных круга']},
  {sid:'anxious',idx:2,tone:'tone-honey',icon:'pen',title:'Выгрузить на бумагу',sub:'вынести мысли из головы',desc:'Не для отчёта — просто вынести наружу. Мысли в голове весят больше, чем мысли на бумаге.',kind:'письмо',steps:['Что крутится в голове одной строкой?','Что хочется выговорить вслух, но молча?','Одна вещь, которую не обязана тащить дальше']},
  {sid:'anxious',idx:3,tone:'tone-peach',icon:'lines',title:'Три строки правды',sub:'стать честнее внутри',desc:'Не спорить с тревогой, а мягко назвать то, что уже есть. Честность часто возвращает опору.',kind:'письмо',steps:['Сейчас меня пугает...','Мне хочется, чтобы...','Маленький шаг на сегодня — ...']},
  {sid:'anxious',idx:4,tone:'tone-rose',icon:'cloud',title:'Облако мыслей',sub:'мысль может пройти',desc:'Мысль не обязательно разбирать до конца. Иногда её достаточно заметить и дать ей пройти.',kind:'пауза',steps:['Назови одну мысль','Представь её облаком','Позволь ей медленно уплыть','Верни взгляд в комнату']},
  {sid:'anxious',idx:5,tone:'tone-butter',icon:'clock',title:'Отложенная тревога',sub:'не всё нужно решать сейчас',desc:'Тревоге можно назначить время. Это не избегание — это способ вернуть себе сегодняшний день.',kind:'пауза',steps:['Выбери 15 минут позже','Скажи мыслям: встретимся тогда','Запиши время одной строкой','До этого возвращайся к делам']},
  {sid:'anxious',idx:6,tone:'tone-lavender',icon:'square',title:'Квадратное дыхание',sub:'вернуть дыханию ритм',desc:'Четыре стороны, четыре спокойных действия. Когда есть ритм, телу легче опереться.',kind:'дыхание',steps:['Вдох на 4 счёта','Пауза на 4','Выдох на 4','Пауза на 4','Повтори несколько кругов']},
  {sid:'anxious',idx:7,tone:'tone-honey',icon:'box',title:'Коробка на полку',sub:'мысли можно отложить',desc:'Образ помогает мозгу отложить то, что сейчас невозможно решить. Мысли могут подождать.',kind:'образ',steps:['Представь красивую коробку','Положи туда то, что крутится','Закрой крышку','Поставь коробку на полку']},
  {sid:'anxious',idx:8,tone:'tone-sage',icon:'sun',title:'Свет и дыхание',sub:'глаза и грудь — один ритм',desc:'Глаза, грудь и дыхание могут идти в одном ритме. Это мягкий способ замедлиться.',kind:'дыхание',steps:['Найди мягкий источник света','Смотри на него спокойно','Вдыхай, пока взгляд отдыхает','Выдыхай чуть длиннее']},
  {sid:'anxious',idx:9,tone:'tone-honey',icon:'count',title:'5–4–3–2–1',sub:'внимание вернётся к комнате',desc:'Короткий якорь для внимания. Он возвращает не в мысли, а в комнату, где ты сейчас.',kind:'заземление',steps:['5 вещей, которые видишь','4 ощущения телом','3 звука вокруг','2 запаха','1 вкус или один выдох']},
  {sid:'anxious',idx:12,tone:'tone-peach',icon:'hand',title:'Сожми и отпусти',sub:'напряжение станет мягче',desc:'Тело часто держит тревогу раньше, чем мы успеваем это заметить. Напряжение можно отпустить через движение.',kind:'тело',steps:['Сожми ладони на вдохе','Подержи 3 секунды','Отпусти на длинном выдохе','Повтори с плечами и стопами']},
  {sid:'anxious',idx:13,tone:'tone-rose',icon:'body',title:'Сканирование тела',sub:'мысли станут тише через тело',desc:'Когда внимание проходит через тело, мысли теряют громкость. Идём медленно, без оценки.',kind:'тело',steps:['Заметь макушку и лицо','Опусти внимание в плечи','Почувствуй грудь и живот','Дойди до стоп','Сделай длинный выдох']},
  {sid:'anxious',idx:15,tone:'tone-honey',icon:'hourglass',title:'Не сейчас',sub:'тревога перестанет тянуть прямо сейчас',desc:'Не каждую мысль нужно решать в моменте. Иногда самый бережный ответ — отложить.',kind:'пауза',steps:['Заметь тревожную мысль','Скажи себе: не сейчас','Выбери время вернуться к ней','Сделай один медленный выдох']},
  {sid:'anxious',idx:17,tone:'tone-sage',icon:'arrow',title:'Один шаг',sub:'станет яснее, что делать дальше',desc:'Тревога часто требует весь план сразу. Здесь нужен только один следующий шаг.',kind:'ясность',steps:['Назови, что именно тревожит','Отдели то, на что можешь повлиять','Выбери один маленький шаг','Запиши его коротко']},
  {sid:'anxious',idx:18,tone:'tone-lavender',icon:'pause',title:'Ничего не решать',sub:'пауза снимет напор',desc:'Пауза тоже действие. На пару минут можно не чинить жизнь, а просто быть рядом с собой.',kind:'пауза',steps:['Поставь обе стопы на пол','Опусти плечи','Скажи: сейчас ничего не решаю','Побудь так одну минуту']},
  {sid:'heavy',idx:7,tone:'tone-lavender',icon:'wave',title:'Волновое дыхание',sub:'как прибой — вдох, выдох',desc:'Вдох и выдох как прибой: пришло, ушло. Без усилия, только повторение.',kind:'дыхание',steps:['Вдохни мягко на 5','Выдохни медленнее на 7','Представь волну','Повтори 6 раз']},
  {sid:'anxious',idx:19,tone:'tone-peach',icon:'heart',title:'Три добрых слова',sub:'станет теплее к себе',desc:'Когда внутри тревожно, голос к себе может стать жестче. Вернём ему тепло.',kind:'поддержка',steps:['Положи руку на грудь','Назови себя по имени','Скажи три добрых слова','Повтори тише ещё раз']},
  {sid:'heavy',idx:2,tone:'tone-rose',icon:'drop',title:'Холодная вода',sub:'оживить и выстроить опору',desc:'Небольшой холод помогает телу переключиться. Это не наказание, а быстрый якорь.',kind:'тело',steps:['Подойди к воде','Намочи запястья','Почувствуй холод 20 секунд','Выдохни и оглянись вокруг']}
];

function sectionUsesDetailCard(sectionId) {
  return LIBRARY_SECTIONS.some((section) => section.id === sectionId);
}

function toneForLibraryCard(sectionId, visualIdx) {
  const tonesBySection = {
    anxiety: ['tone-sage', 'tone-lavender', 'tone-honey', 'tone-peach', 'tone-rose', 'tone-butter'],
    sadness: ['tone-honey', 'tone-peach', 'tone-rose', 'tone-butter'],
    anger: ['tone-peach', 'tone-rose', 'tone-honey', 'tone-lavender'],
    burnout: ['tone-butter', 'tone-sage', 'tone-honey', 'tone-lavender'],
    'morning-soft': ['tone-butter', 'tone-honey', 'tone-sage', 'tone-peach'],
    day: ['tone-sage', 'tone-honey', 'tone-lavender', 'tone-butter'],
    'sleep-soft': ['tone-lavender', 'tone-rose', 'tone-butter', 'tone-sage']
  };
  const tones = tonesBySection[sectionId] || tonesBySection.day;
  return tones[visualIdx % tones.length];
}

function detailKickerForSection(sectionId, sid) {
  return getDisplaySection(sectionId)?.n || getDisplaySection(sid)?.n || 'практика';
}

function detailIconHtml(card, customIconKey) {
  if (customIconKey && ANXIETY_ICON_SVG[customIconKey]) {
    return ANXIETY_ICON_SVG[customIconKey];
  }
  if (card.i) {
    return `<span class="card-detail-emoji">${escHtml(card.i)}</span>`;
  }
  return '';
}

function detailKindForCard(card) {
  return CARD_TYPE_LABEL[card.inter] || 'пауза';
}

function cardPreviewLine(card) {
  return card.result || card.sup || 'маленькая практика, чтобы стало чуть легче';
}

function detailDescForCard(card) {
  if (card.sup) return card.sup;
  const result = card.result ? `${card.result}. ` : '';
  const byInter = {
    breath: 'Здесь поможет спокойный ритм дыхания и чуть более длинный выдох.',
    timer: 'Нужно только немного времени и разрешение побыть в этом моменте.',
    journal: 'Пара честных строк уже снимает лишнее давление внутри.',
    letter: 'Без формы и правил, просто словами к себе.',
    anchor: 'Возвращаем внимание из мыслей в комнату и в тело.',
    clouds: 'Не удерживать, а заметить и дать пройти.',
    affirmations: 'Мягкие слова к себе иногда работают лучше любых объяснений.',
    bodyscan: 'Тело поможет замедлиться и снова почувствовать опору.',
    pmr: 'Через напряжение и отпускание телу проще сбросить лишний жар.',
    checklist: 'Один маленький выбор уже делает состояние понятнее.',
    choices: 'Не нужно искать идеальный ответ, достаточно самого честного.',
    slider: 'Отметь, сколько сил есть сейчас, и подстрой шаг под себя.',
    simple: 'Здесь всё устроено по-человечески: один шаг, потом следующий.'
  };
  return `${result}${byInter[card.inter] || byInter.simple}`.trim();
}

function detailStepsForCard(card) {
  if (Array.isArray(card.prompts) && card.prompts.length) return card.prompts.slice(0, 4);
  if (Array.isArray(card.steps) && card.steps.length) return card.steps.slice(0, 5);
  if (Array.isArray(card.affs) && card.affs.length) return card.affs.slice(0, 4);
  if (Array.isArray(card.options) && card.options.length) {
    const steps = [];
    if (card.prompt) steps.push(card.prompt);
    return steps.concat(card.options.slice(0, 4));
  }

  if (card.inter === 'breath' && card.br) {
    const steps = [];
    if (card.br.i) steps.push(`Вдохни на ${card.br.i} счёта`);
    if (card.br.h) steps.push(`Подержи дыхание на ${card.br.h}`);
    if (card.br.o) steps.push(`Выдохни на ${card.br.o}`);
    steps.push(`Повтори ${card.br.c || 4} спокойных круга`);
    return steps;
  }

  if (card.inter === 'timer') {
    const steps = [];
    if (card.timerText) steps.push(card.timerText);
    if (card.timer) steps.push(`Побудь в этом ${Math.max(1, Math.round(card.timer / 60))} мин.`);
    steps.push('Не торопись и не оценивай, просто побудь рядом с собой');
    return steps;
  }

  if (card.inter === 'anchor') {
    return [
      'Оглянись вокруг и найди 5 вещей глазами',
      'Потрогай 4 предмета рядом',
      'Услышь 3 звука вокруг',
      'Сделай 2 спокойных выдоха'
    ];
  }

  if (card.inter === 'clouds' || card.inter === 'release') {
    return [
      'Назови одну мысль, которая не отпускает',
      'Представь её образом: облаком, листом или дымом',
      'Позволь ей отплыть чуть дальше',
      'Верни внимание в комнату'
    ];
  }

  if (card.inter === 'letter') {
    return [
      card.greet || 'Начни с первой честной строки',
      'Пиши без цензуры несколько минут',
      'Не исправляй себя по ходу',
      'Заверши письмо одной тёплой фразой'
    ];
  }

  if (card.inter === 'bodyscan') {
    return [
      'Заметь лицо и челюсть',
      'Опусти внимание в плечи',
      'Почувствуй грудь и живот',
      'Дойди вниманием до стоп'
    ];
  }

  if (card.inter === 'pmr') {
    return [
      'Сожми ладони или плечи на вдохе',
      'Подержи пару секунд',
      'Отпусти на выдохе',
      'Повтори ещё несколько раз'
    ];
  }

  return [
    'Останься с собой на эту пару минут',
    'Иди по экрану шаг за шагом',
    'Не нужно делать идеально',
    'Достаточно просто начать'
  ];
}

function openLibraryCardDetail(sid, idx, el, sectionId, tone='') {
  const card = CARDS[sid]?.[idx];
  if (!card) return;
  openAnyCardDetail(
    {
      sid,
      idx,
      tone,
      title: card.n,
      sub: card.result || card.sup || 'маленькая практика, чтобы стало чуть легче',
      desc: detailDescForCard(card),
      kind: detailKindForCard(card),
      steps: detailStepsForCard(card),
      time: card.time,
      kicker: detailKickerForSection(sectionId, sid),
      iconHtml: detailIconHtml(card)
    },
    el
  );
}

function openAnyCardDetail(item, el) {
  const detail = document.getElementById('card-detail');
  const sheet = detail?.querySelector('.card-detail-sheet');
  if (!detail || !sheet) return openCard(item.sid, item.idx);
  const st = getComputedStyle(el);
  const cardBg = st.getPropertyValue('--card-bg').trim();
  const solid = (cardBg.match(/#[0-9a-fA-F]{3,8}/g) || []).at(-1) || '#f7f0e4';
  sheet.style.setProperty('--sheet-bg', cardBg);
  sheet.style.setProperty('--sheet-solid', solid);
  sheet.style.setProperty('--sheet-wash', st.getPropertyValue('--wash').trim());
  sheet.style.setProperty('--sheet-ink', st.getPropertyValue('--ink').trim());
  sheet.style.setProperty('--sheet-accent', st.getPropertyValue('--accent').trim());
  sheet.style.setProperty('--sheet-pill', st.getPropertyValue('--pill').trim());
  sheet.style.setProperty('--sheet-pill-ink', st.getPropertyValue('--pill-ink').trim());
  document.getElementById('card-detail-kicker').textContent = item.kicker || 'практика';
  document.getElementById('card-detail-icon').innerHTML = item.iconHtml || '';
  document.getElementById('card-detail-title').textContent = item.title;
  document.getElementById('card-detail-sub').textContent = item.sub;
  document.getElementById('card-detail-desc').textContent = item.desc;
  document.getElementById('card-detail-time').textContent = item.time || '';
  document.getElementById('card-detail-kind').textContent = item.kind || 'пауза';
  document.getElementById('card-detail-steps').innerHTML = (item.steps || []).map((step, i) => `<div class="card-detail-step"><span class="card-detail-num">${i + 1}</span><span>${escHtml(step)}</span></div>`).join('');
  const key = `${item.sid}-${item.idx}`;
  curDetailFavKey = key;
  const favBtn = document.getElementById('card-detail-fav');
  if (favBtn) {
    const active = favs.includes(key);
    favBtn.textContent = active ? '♥' : '♡';
    favBtn.classList.toggle('active', active);
  }
  const start = document.getElementById('card-detail-start');
  start.onclick = () => {
    closeCardDetail();
    openCard(item.sid, item.idx, false, true, item.tone || '');
  };
  detail.classList.add('on');
  document.querySelector('.phone-frame')?.classList.add('detail-card-open');
  document.querySelector('.scr[data-s="cards"]')?.classList.add('detail-locked');
  detail.setAttribute('aria-hidden', 'false');
}

function enhanceInteractiveElements(root=document){
  root.querySelectorAll('[onclick]:not(button):not(input):not(textarea):not(select), .home-rec-card').forEach((el)=>{
    if(!el.hasAttribute('role'))el.setAttribute('role','button');
    if(!el.hasAttribute('tabindex'))el.tabIndex=0;
  });
}

document.addEventListener('keydown',(e)=>{
  if(e.key!=='Enter'&&e.key!==' ')return;
  const target=e.target;
  if(target.matches('button,input,textarea,select,a'))return;
  const el=target.closest('[role="button"],[onclick]');
  if(!el)return;
  e.preventDefault();
  el.click();
});

function sectionsForPracticeTab(tabId){
  if(tabId==='all')return SECTIONS.slice();
  const ids=SECTION_IDS_BY_TAB[tabId];
  if(!ids||!ids.length)return [];
  return SECTIONS.filter((s)=>ids.includes(s.id));
}

function getDisplaySection(id){
  return LIBRARY_SECTIONS.find((s)=>s.id===id) || SECTIONS.find((s)=>s.id===id) || null;
}

function getSectionCards(id){
  const curated=LIBRARY_SECTIONS.find((s)=>s.id===id);
  if(curated){
    if(curated.sources?.length){
      return curated.sources.flatMap((sid)=>
        (CARDS[sid]||[]).map((card, idx)=>({ sid, idx, card }))
      );
    }
    return curated.items
      .map(([sid, idx])=>{
        const card=CARDS[sid]?.[idx];
        return card ? { sid, idx, card } : null;
      })
      .filter(Boolean);
  }
  return (CARDS[id]||[]).map((card, idx)=>({ sid:id, idx, card }));
}

function renderCardGridHTML(entries, seedId){
  if(seedId==='anxiety')return renderAnxietyUnifiedGridHTML();
  if(sectionUsesDetailCard(seedId))return renderLibraryStyledGridHTML(entries, seedId);
  return entries.map(({sid, idx, card}, visualIdx)=>{
    const cls=COLORS[(visualIdx*3+seedId.charCodeAt(0))%COLORS.length];
    const k=`${sid}-${idx}`;
    const fav=favs.includes(k);
    const chip=CARD_TYPE_LABEL[card.inter]||'пауза';
    const v=visualIdx%3;
    const line=card.sup?`<p class="cd-line">${escHtml(card.sup)}</p>`:'';
    const kind=(card.inter||'simple').replace(/[^a-z]/g,'')||'simple';
    const micro=cardMicroHtml(card.inter);
    const action=sectionUsesDetailCard(seedId)?`openLibraryCardDetail('${sid}',${idx},this,'${seedId}')`:`openCard('${sid}',${idx})`;
    return `<div class="cd cd-row ${cls} cd-var-${v} cd-kind-${kind}" style="--cd-i:${visualIdx}" onclick="${action}" role="button" tabindex="0"><div class="cd-accent"></div><div class="cd-row-inner"><div class="cd-icon-stack"><div class="cd-icon-wrap"><span class="cd-em">${card.i}</span></div>${micro}</div><div class="cd-body"><div class="cd-n">${card.n}</div><p class="cd-whisper">${card.result}</p>${line}<div class="cd-meta"><span class="cd-chip">${chip}</span><span class="cd-time">${card.time}</span></div></div><span class="cd-go" aria-hidden="true">›</span></div>${fav?'<div class="cd-fav active">♥</div>':''}<div class="cd-bg"></div></div>`;
  }).join('');
}

function renderAnxietyUnifiedGridHTML(){
  return ANXIETY_FINAL_ITEMS.map((item, visualIdx)=>{
    const card=CARDS[item.sid]?.[item.idx];
    if(!card)return '';
    const time=item.time||card.time||'2 мин';
    const kind=item.kind||detailKindForCard(card);
    const badge=item.badge||whisperLabelForCard(item.sid,item.idx);
    return `<div class="anxiety-card ${item.tone}" style="--cd-i:${visualIdx}" onclick="openCardDetail(${visualIdx},this)" role="button" tabindex="0"><div class="anxiety-icon anxiety-icon-emoji"><span>${escHtml(card.i||'◌')}</span></div><div class="anxiety-badge">${escHtml(badge)}</div><div class="anxiety-name">${escHtml(item.title)}</div><div class="anxiety-whisper">${escHtml(item.sub)}</div><div class="anxiety-foot"><span class="anxiety-time">${escHtml(time)}</span><span class="anxiety-time">${escHtml(kind)}</span><span class="anxiety-arr">›</span></div></div>`;
  }).join('');
}

function renderLibraryStyledGridHTML(entries, seedId){
  return entries.map(({sid, idx, card}, visualIdx)=>{
    const tone=toneForLibraryCard(seedId,visualIdx);
    const time=card.time||'2 мин';
    const kind=detailKindForCard(card);
    const badge=whisperLabelForCard(sid,idx);
    return `<div class="anxiety-card ${tone}" style="--cd-i:${visualIdx}" onclick="openLibraryCardDetail('${sid}',${idx},this,'${seedId}','${tone}')" role="button" tabindex="0"><div class="anxiety-icon anxiety-icon-emoji"><span>${escHtml(card.i||'◌')}</span></div><div class="anxiety-badge">${escHtml(badge)}</div><div class="anxiety-name">${escHtml(card.n)}</div><div class="anxiety-whisper">${escHtml(cardPreviewLine(card))}</div><div class="anxiety-foot"><span class="anxiety-time">${escHtml(time)}</span><span class="anxiety-time">${escHtml(kind)}</span><span class="anxiety-arr">›</span></div></div>`;
  }).join('');
}

function openCardDetail(itemIdx,el){
  const item=ANXIETY_FINAL_ITEMS[itemIdx];
  if(!item)return;
  const card=CARDS[item.sid]?.[item.idx];
  if(!card)return;
  openAnyCardDetail({
    sid:item.sid,
    idx:item.idx,
    tone:item.tone,
    title:item.title,
    sub:item.sub,
    desc:item.desc,
    kind:item.kind||CARD_TYPE_LABEL[card.inter]||'пауза',
    steps:item.steps||[],
    time:item.time||card.time,
    kicker:'Тревожно',
    iconHtml:detailIconHtml(card,item.icon)
  },el);
}

function toggleCardDetailFav(key,btn){
  if(!key)return;
  if(favs.includes(key)){
    favs=favs.filter(k=>k!==key);
    btn.textContent='♡';
    btn.classList.remove('active');
    toast('Убрано');
  }else{
    favs.push(key);
    btn.textContent='♥';
    btn.classList.add('active');
    toast('В ♥ любимые');
  }
  writeStored('favs',favs);
}

function closeCardDetail(){
  const detail=document.getElementById('card-detail');
  if(!detail)return;
  detail.classList.remove('on');
  document.querySelector('.phone-frame')?.classList.remove('detail-card-open');
  document.querySelector('.scr[data-s="cards"]')?.classList.remove('detail-locked');
  detail.setAttribute('aria-hidden','true');
  curDetailFavKey=null;
}

function renderSectionsListHTML(){
  const row=(s)=>`<div class="sc" onclick="openSec('${s.id}')"><div class="sc-i">${s.i}</div><div class="sc-info"><div class="sc-n">${s.n}</div><div class="sc-d">${s.d}</div></div><div class="sc-arr">›</div></div>`;
  const rows=LIBRARY_SECTIONS.map(row).join('');
  return `<div class="sec-panel practice-panel"><div class="sec-panel-rows practice-rows">${rows}</div></div>`;
}

function setPracticeTab(id){
  practiceTab=id;
  const secList=document.getElementById('sec-list');
  if(secList)secList.innerHTML=renderSectionsListHTML();
  const homeList=document.getElementById('home-sec-list');
  if(homeList)homeList.innerHTML=renderSectionsListHTML();
}

function renderHomeSections(){
  const panel=document.getElementById('home-sections-panel');
  const list=document.getElementById('home-sec-list');
  const toggle=document.getElementById('home-sections-toggle');
  if(list && homeSectionsOpen)list.innerHTML=renderSectionsListHTML();
  if(panel)panel.classList.toggle('open',homeSectionsOpen);
  if(toggle){
    toggle.classList.toggle('open',homeSectionsOpen);
    toggle.setAttribute('aria-expanded',homeSectionsOpen?'true':'false');
  }
}

function toggleHomeSections(){
  homeSectionsOpen=!homeSectionsOpen;
  renderHomeSections();
}

function goSec(){
  document.getElementById('sec-list').innerHTML=renderSectionsListHTML();
  goScr('sections');
}
function goReset(){renderReset();goScr('reset30');}
function setMood(m){curMood=m;clearStored('lastQuizRec');setStoredText('lastMood',m);goHome();}

function clearStored(key){
  try{localStorage.removeItem(key);}catch(e){}
}
