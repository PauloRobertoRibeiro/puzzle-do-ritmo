/* Musical time uses 12 integer ticks per quarter note. No rounding in score data. */
(function(root){
const T=12;
const P=[
{id:'ta',name:'Semínima',syllable:'tá',beats:1,events:[{d:12}],level:0,color:'lilac',hint:'Uma nota ocupa um tempo.'},
{id:'rest',name:'Pausa de semínima',syllable:'silêncio',beats:1,events:[{d:12,r:true}],level:0,color:'peach',hint:'Um tempo de silêncio. A pulsação continua.'},
{id:'titi',name:'Duas colcheias',syllable:'ti-ti',beats:1,events:[{d:6},{d:6}],level:1,color:'mint',hint:'Duas notas iguais dentro de um tempo.'},
{id:'half',name:'Mínima',syllable:'tá—',beats:2,events:[{d:24}],level:1,color:'blue',hint:'Uma nota sustentada durante dois tempos.'},
{id:'halfrest',name:'Pausa de mínima',syllable:'dois silêncios',beats:2,events:[{d:24,r:true}],level:1,color:'peach',hint:'Dois tempos de silêncio.'},
{id:'four',name:'Quatro semicolcheias',syllable:'ti-ri-ti-ri',beats:1,events:[{d:3},{d:3},{d:3},{d:3}],level:2,color:'yellow',hint:'Quatro notas iguais dentro de um tempo.'},
{id:'longshort',name:'Colcheia e semicolcheias',syllable:'ti-ti-ri',beats:1,events:[{d:6},{d:3},{d:3}],level:2,color:'mint',hint:'Metade de um tempo, depois dois quartos de tempo.'},
{id:'shortlong',name:'Semicolcheias e colcheia',syllable:'ti-ri-ti',beats:1,events:[{d:3},{d:3},{d:6}],level:2,color:'blue',hint:'Dois quartos de tempo, depois metade de um tempo.'},
{id:'dotted',name:'Colcheia pontuada e semicolcheia',syllable:'tá-i-ti',beats:1,events:[{d:9},{d:3}],level:2,color:'lilac',hint:'Três quartos de tempo, depois um quarto de tempo.'}
];
const byId=id=>P.find(p=>p.id===id);
function events(ids){let t=0;return ids.flatMap(id=>{const p=byId(id);if(!p)throw Error('Peça inválida');return p.events.map(e=>{const a={t,d:e.d,r:!!e.r};t+=e.d;return a;});});}
function filled(board){return board.reduce((a,id)=>a+byId(id).beats,0);}
function canPlace(board,id,capacity){return !!byId(id)&&filled(board)+byId(id).beats<=capacity;}
function signature(ids){const e=events(ids);const result=[];for(const a of e){const last=result.at(-1);if(a.r&&last?.r)last.d+=a.d;else result.push({...a});}return JSON.stringify(result.map(({t,d,r})=>[t,d,r]));}
function compare(answer,target,barBeats){const a=events(answer),b=events(target);if(signature(answer)===signature(target))return {ok:true,beat:null};let bad=0;for(let t=0;t<filled(target)*T;t++){const x=a.find(e=>e.t<=t&&t<e.t+e.d),y=b.find(e=>e.t<=t&&t<e.t+e.d);if(!x||!y||x.r!==y.r||(!x.r&&(x.t!==y.t||x.d!==y.d))){bad=Math.floor(t/T);break;}}return {ok:false,beat:bad,bar:Math.floor(bad/barBeats)+1};}
function makeTarget(level,bars,barBeats,rng=Math.random){const out=[];for(let i=0;i<bars;i++){let left=barBeats;while(left>0){let choices=P.filter(p=>p.level<=level&&p.beats<=left); // At least one sounding event in every challenge.
if(!out.length)choices=choices.filter(p=>p.events.some(e=>!e.r));const p=choices[Math.floor(rng()*choices.length)];out.push(p.id);left-=p.beats;}}return out;}
const api={T,P,byId,events,filled,canPlace,signature,compare,makeTarget};if(typeof module!=='undefined')module.exports=api;else root.Rhythm=api;
})(typeof window!=='undefined'?window:globalThis);
