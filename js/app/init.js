document.getElementById('card-detail')?.addEventListener('click',(e)=>{if(e.target.id==='card-detail')closeCardDetail();});
document.getElementById('card-detail-fav')?.addEventListener('click',(e)=>{
  e.preventDefault();
  e.stopPropagation();
  toggleCardDetailFav(curDetailFavKey,e.currentTarget);
});
document.addEventListener('keydown',(e)=>{if(e.key==='Escape')closeCardDetail();});

updateStreak();
renderCoverVariant();
enhanceInteractiveElements();
