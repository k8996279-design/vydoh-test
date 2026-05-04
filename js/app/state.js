// STATE
let curSec=null,curCard=null,curCardKey=null,curCardIdx=null;
let curMood=localStorage.getItem('lastMood')||'ok';
let tInt=null,phraseInt=null,ritualTimerInt=null;
let favs=readStoredArray('favs');
let history=readStoredArray('hist');
let notes=readStoredArray('notes');
let streak=parseInt(localStorage.getItem('streak')||'0');
let lastDay=localStorage.getItem('lastDay')||'';
let curSound=null;
let prevScreen='home';
let coverVariant=localStorage.getItem('coverVariant')||'premium';
let moodQuiz={feel:null,need:null,time:null};
// 30-day state
let r30Done=readStoredArray('r30Done');
let r30State=readStoredObject('r30State'); // {dayN: {checked:[idx], inputs:{idx:val}, water:N, moodM:'', moodE:'', practiceDone:bool}}
let curDay=null;
let curInputCallback=null;
let practiceTab='all';
let homeSectionsOpen=false;
let curDetailFavKey=null;
