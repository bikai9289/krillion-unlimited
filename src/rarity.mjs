import { normalize } from '../public/rules.mjs';
import { OBSERVATION_CACHE_KEY, STATS_CACHE_TTL_MS, loadOrRefreshStatsCache, writeStatsCache } from './stats-cache.mjs';
export const MIN_SAMPLE=100;
export const PUBLIC_SAMPLE=100;
const OBSERVATION_SQL=`WITH candidates AS (
   SELECT json_extract(p.value,'$.id') AS promptId,json_extract(p.value,'$.text') AS promptText,
     a.answer,r.player,ROW_NUMBER() OVER (
       PARTITION BY r.player,json_extract(p.value,'$.id'),json_extract(p.value,'$.text')
       ORDER BY a.created_at,r.id,a.round) AS pick
   FROM answers a JOIN runs r ON r.id=a.run_id JOIN run_puzzles rp ON rp.run_id=r.id
   JOIN json_each(rp.content,'$.prompts') p ON CAST(p.key AS INTEGER)=a.round
   WHERE r.completed=1 AND a.answer IS NOT NULL AND a.created_at>=?
 ) SELECT promptId,promptText,answer,COUNT(*) AS count FROM candidates WHERE pick=1
 GROUP BY promptId,promptText,answer`;
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
export async function computeObservations(env){
 const since=Date.now()-30*86400000;
 return (await env.DB.prepare(OBSERVATION_SQL).bind(since).all()).results;
}
export async function refreshObservationCache(env){
 const rows=await computeObservations(env);
 await writeStatsCache(env,OBSERVATION_CACHE_KEY,rows);
 return rows;
}
export async function loadObservations(env){
 return loadOrRefreshStatsCache(env,OBSERVATION_CACHE_KEY,()=>computeObservations(env),STATS_CACHE_TTL_MS);
}
export async function scoreFromObservations(env,puzzle){
 const rows=await loadObservations(env);
 return {...puzzle,prompts:puzzle.prompts.map(p=>observedPrompt(p,rows))};
}
