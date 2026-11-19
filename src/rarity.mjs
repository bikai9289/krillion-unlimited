import { normalize } from '../public/rules.mjs';
import { computeObservations } from './observations-store.mjs';
import { OBSERVATION_CACHE_KEY, STATS_CACHE_TTL_MS, loadOrRefreshStatsCache, useStatsCache, writeStatsCache } from './stats-cache.mjs';
export const MIN_SAMPLE=100;
export const PUBLIC_SAMPLE=100;
export function observedPrompt(prompt,rows){
 const counts=new Map();
 for(const row of rows){if(row.promptId!==prompt.id||row.promptText!==prompt.text)continue;const key=normalize(row.answer);counts.set(key,(counts.get(key)||0)+Number(row.count));}
 const known=new Set(prompt.answers.map(a=>normalize(a.answer)));
 const samples=[...counts].filter(([key])=>known.has(key)).reduce((n,[,count])=>n+count,0);
 if(samples<MIN_SAMPLE)return {...prompt,rarity:{method:'editorial',minimumSample:MIN_SAMPLE}};
 return {...prompt,rarity:{method:'observed',sampleSize:samples,windowDays:30,unit:'one accepted answer per browser per prompt',smoothing:'add-one'},answers:prompt.answers.map(a=>{
  const count=counts.get(normalize(a.answer))||0;
  const probability=(count+1)/(samples+prompt.answers.length);
  const tier=probability>=.25?'plankton':probability>=.15?'tooclever':probability>=.08?'schooler':probability>=.03?'rare':probability>=.01?'deepcut':'krillion';
  return {...a,tier};
 })};
}
export async function refreshObservationCache(env){
 const rows=await computeObservations(env,{allowSourceScan:true});
 await writeStatsCache(env,OBSERVATION_CACHE_KEY,rows);
 return rows;
}
export async function loadObservations(env){
 return loadOrRefreshStatsCache(env,OBSERVATION_CACHE_KEY,()=>computeObservations(env,{allowSourceScan:!useStatsCache(env)}),STATS_CACHE_TTL_MS);
}
export async function scoreFromObservations(env,puzzle){
 const rows=await loadObservations(env);
 return {...puzzle,prompts:puzzle.prompts.map(p=>observedPrompt(p,rows))};
}
