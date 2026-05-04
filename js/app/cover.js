const COVER_VARIANTS = {
  viral: {
    kicker: 'Когда тревога, бессонница или просто новый день',
    tag: 'Открой и выбери карточку',
    desc: 'Это красивое пространство с короткими ритуалами, которые хочется сохранить себе и отправить подруге.',
    foot: 'Я больше не жду'
  },
  premium: {
    kicker: 'Каждое утро — шанс начать заново',
    tag: 'Место, где можно услышать себя',
    desc: 'Когда тревога, бессонница или просто новый день, открой и выбери карточку.',
    foot: 'Я больше не жду'
  },
  selling: {
    kicker: 'Карточки для тревоги, сна и мягкого старта дня',
    tag: 'Ритуалы, которые помогают сразу',
    desc: 'Открой карточку под своё состояние и за пару минут найди тише, опору или новый ритм.',
    foot: 'Начать с одной карточки'
  }
};

function renderCoverVariant(){
  const data=COVER_VARIANTS[coverVariant]||COVER_VARIANTS.premium;
  const kicker=document.querySelector('.cv-kicker');
  const tag=document.querySelector('.cv-tag');
  const desc=document.querySelector('.cv-desc');
  const foot=document.querySelector('.cv-foot');
  if(kicker)kicker.textContent=data.kicker;
  if(tag)tag.textContent=data.tag;
  if(desc)desc.textContent=data.desc;
  if(foot)foot.textContent=data.foot;
  document.querySelectorAll('.cv-switch-btn').forEach((btn)=>{
    btn.classList.toggle('on',btn.dataset.coverVariant===coverVariant);
  });
}

function setCoverVariant(id){
  if(!COVER_VARIANTS[id])return;
  coverVariant=id;
  setStoredText('coverVariant',id);
  renderCoverVariant();
}
