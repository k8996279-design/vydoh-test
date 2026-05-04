// SOUNDS
let curSoundNodes=null;
function stopSound(){if(curSoundNodes){try{curSoundNodes.forEach(n=>{if(n.stop)n.stop();if(n.disconnect)n.disconnect();});}catch(e){}curSoundNodes=null;}}
function playLoopFile(src,volume=0.35){
  const audio=new Audio(src);
  audio.loop=true;
  audio.preload='auto';
  audio.volume=volume;
  const p=audio.play();
  if(p&&typeof p.catch==='function')p.catch(()=>{});
  return [{
    stop(){audio.pause();audio.currentTime=0;},
    disconnect(){audio.src='';audio.load();}
  }];
}
const SOUND_LIBRARY={
  rain:{src:'assets/sounds/tropical-rain.mp3',volume:0.11},
  fire:{src:'assets/sounds/fireplace.mp3',volume:0.24},
  ocean:{src:'assets/sounds/ocean.mp3',volume:0.23},
  forest:{src:'assets/sounds/forest.mp3',volume:0.21},
  birds:{src:'assets/sounds/birds.mp3',volume:0.11}
};
function playSound(name){
  const sound=SOUND_LIBRARY[name];
  if(!sound)throw new Error(`Unknown sound: ${name}`);
  return playLoopFile(sound.src,sound.volume);
}
