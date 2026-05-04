function readStored(key,fallback,validate){
  try{
    const raw=localStorage.getItem(key);
    if(raw===null)return fallback;
    const parsed=JSON.parse(raw);
    return !validate||validate(parsed)?parsed:fallback;
  }catch(e){
    try{localStorage.removeItem(key);}catch(_){}
    return fallback;
  }
}
function writeStored(key,value){
  try{localStorage.setItem(key,JSON.stringify(value));}catch(e){}
}
function readStoredArray(key){return readStored(key,[],Array.isArray);}
function readStoredObject(key){return readStored(key,{},(v)=>v&&typeof v==='object'&&!Array.isArray(v));}
function setStoredText(key,value){
  try{localStorage.setItem(key,value);}catch(e){}
}
