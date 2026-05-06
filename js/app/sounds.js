// SOUNDS
let curSoundNodes=null;
let curAudio=null;
function stopSound(){if(curSoundNodes){try{curSoundNodes.forEach(n=>{if(n.stop)n.stop();if(n.disconnect)n.disconnect();});}catch(e){}curSoundNodes=null;}curAudio=null;}
function playLoopFile(src,volume=0.35){
  const audio=new Audio(src);
  audio.loop=true;
  audio.preload='auto';
  audio.volume=volume;
  curAudio=audio;
  const p=audio.play();
  if(p&&typeof p.catch==='function')p.catch(()=>{});
  return [{
    stop(){audio.pause();audio.currentTime=0;curAudio=null;},
    disconnect(){audio.src='';audio.load();curAudio=null;}
  }];
}
const SOUND_LIBRARY={
  rain:{src:'assets/sounds/tropical-rain.mp3',volume:0.22},
  fire:{src:'assets/sounds/fireplace.mp3',volume:0.24},
  ocean:{src:'assets/sounds/ocean.mp3',volume:0.23},
  forest:{src:'assets/sounds/forest.mp3',volume:0.21},
  birds:{src:'assets/sounds/birds.mp3',volume:0.20}
};
function playSound(name){
  const sound=SOUND_LIBRARY[name];
  if(!sound)throw new Error(`Unknown sound: ${name}`);
  return playLoopFile(sound.src,sound.volume);
}
function setSoundVolume(val){
  if(curAudio)curAudio.volume=val/100;
  const slider=document.getElementById('sound-vol-slider');
  if(slider)slider.style.background=`linear-gradient(to right,#7a9870 ${val}%,rgba(210,190,162,0.45) ${val}%)`;
}
