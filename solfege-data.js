/* Transcriptions of the two scores supplied by the user (Crea Tu Música screenshots).
   12 integer ticks per quarter; MIDI C4=60. Rendering and audio use these same events. */
(function(root){
const n=(m,d)=>({m,d}),r=d=>({m:null,d});
const SCORES=[
{id:'foto-solfejo-1',title:'Solfejo 1 · Dó, Ré, Mi',tempo:90,meter:4,credit:'Transcrito do print enviado · Crea Tu Música',bars:[
[n(60,12),n(62,6),n(64,6),n(65,12),n(64,6),n(62,6)],
[n(60,12),n(67,12),n(64,12),n(60,12)],
[n(67,12),n(65,6),n(64,6),n(65,12),n(64,6),n(62,6)],
[n(60,12),n(59,12),n(60,12),r(12)],
[n(64,12),n(65,6),n(67,6),n(65,12),n(67,6),n(65,6)],
[n(64,12),n(72,12),n(71,12),n(69,12)],
[n(67,24),n(65,24)],
[n(64,48)]
]},
{id:'foto-solfejo-2',title:'Solfejo 2 · Ritmos pontuados',tempo:115,meter:4,credit:'Transcrito do print enviado · Crea Tu Música',bars:[
[n(67,12),n(64,9),n(65,3),n(67,12),n(64,6),n(65,6)],
[n(64,12),n(60,9),n(62,3),n(64,12),n(62,6),n(60,6)],
[n(59,18),n(62,6),n(64,6),n(65,6),n(64,6),n(65,6)],
[n(67,24),r(12),n(65,12)],
[n(64,12),n(60,9),n(62,3),n(64,12),n(62,6),n(60,6)],
[n(59,18),n(59,6),n(64,6),n(62,6),n(60,6),n(62,6)],
[n(60,6),n(65,6),n(64,6),n(65,6),n(69,6),n(72,6),n(71,6),n(72,6)],
[n(71,12),n(67,12),n(69,12),n(71,12)],
[n(72,48)]
]}
];
const names={59:'Si',60:'Dó',62:'Ré',64:'Mi',65:'Fá',67:'Sol',69:'Lá',71:'Si',72:'Dó'};
const steps={59:-1,60:0,62:1,64:2,65:3,67:4,69:5,71:6,72:7};
const find=id=>SCORES.find(s=>s.id===id)||SCORES[0];
function clean(x){const s=x&&typeof x==='object'?x:{};return {id:find(s.id).id,tempo:Number.isFinite(s.tempo)?Math.max(40,Math.min(140,Math.round(s.tempo))):60,names:s.names!==false,click:s.click!==false,count:s.count!==false,repeats:[1,2,4].includes(s.repeats)?s.repeats:1,open:s.open===true};}
function plan(score,from=0,to=score.bars.length-1,repeats=1){if(!Number.isInteger(from)||!Number.isInteger(to)||from<0||to>=score.bars.length||to<from||![1,2,4].includes(repeats))throw Error('Trecho inválido');let t=0;const events=[],measures=[];for(let rep=0;rep<repeats;rep++)for(let b=from;b<=to;b++){measures.push({bar:b,t,rep});score.bars[b].forEach((e,ni)=>{events.push({t,d:e.d,midi:e.m,bar:b,ni,r:e.m===null,rep});t+=e.d;});}return {events,measures,total:t,from,to,repeats};}
function position(plan,t){if(t<0)return null;const e=plan.events.find(e=>e.t<=t&&t<e.t+e.d);return e?{...e,barTick:t-plan.measures.find(b=>b.bar===e.bar&&b.rep===e.rep).t}:null;}
function beams(bar){const groups=[];let g=[],t=0;bar.forEach((e,i)=>{if(e.m!==null&&e.d<=9){if(g.length&&Math.floor(t/24)!==Math.floor((t-e.d)/24)&&t%24===0){if(g.length>1)groups.push(g);g=[];}g.push(i);}else{if(g.length>1)groups.push(g);g=[];}t+=e.d;});if(g.length>1)groups.push(g);return groups;}
const api={SCORES,names,steps,find,clean,plan,position,beams};if(typeof module!=='undefined')module.exports=api;else root.SolfegeBook=api;
})(typeof window!=='undefined'?window:globalThis);
