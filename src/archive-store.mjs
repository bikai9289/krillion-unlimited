import { validDate } from './answer-archives.mjs';
import { TIERS } from '../public/rules.mjs';

export const ARCHIVE_MIRROR_KEY='daily-archives/snapshots-v1.json';
export function validSnapshot(puzzle,date){
  return validDate(date)&&puzzle?.date===date&&puzzle.prompts?.length===7&&puzzle.prompts.every(p=>
    typeof p.text==='string'&&Array.isArray(p.answers)&&p.answers.length>0&&p.answers.every(a=>typeof a.answer==='string'&&TIERS[a.tier]));
}
export async function readArchiveMirror(env){
  try{
    const object=await env.BUCKET?.get(ARCHIVE_MIRROR_KEY);
    if(!object)return null;
    const data=await object.json();
    if(data?.version!==1||!data.editions||Array.isArray(data.editions))return null;
    if(!Object.entries(data.editions).every(([date,puzzle])=>validSnapshot(puzzle,date)))return null;
    return data.editions;
  }catch(error){console.error('archive mirror read failed:',error.message);return null;}
}
export async function savedArchive(env,date){
  const mirror=await readArchiveMirror(env);
  if(mirror?.[date])return mirror[date];
  if(mirror&&date<=Object.keys(mirror).sort().at(-1))return null;
  const row=await env.DB.prepare('SELECT content FROM daily_archives WHERE date=?').bind(date).first();
  if(!row)return null;
  const puzzle=JSON.parse(row.content);
  if(!validSnapshot(puzzle,date))throw new Error('Invalid saved daily snapshot: '+date);
  return puzzle;
}
// Copy only persisted editions, never generated historical puzzles or run/player data.
export async function mirrorSavedArchives(env){
  const rows=(await env.DB.prepare('SELECT date,content FROM daily_archives ORDER BY date').all()).results;
  const editions=Object.fromEntries(rows.map(row=>[row.date,JSON.parse(row.content)]));
  if(!Object.entries(editions).every(([date,puzzle])=>validSnapshot(puzzle,date)))throw new Error('Invalid archive mirror source');
  if(!rows.length)return;
  await env.BUCKET?.put(ARCHIVE_MIRROR_KEY,JSON.stringify({version:1,editions}),{httpMetadata:{contentType:'application/json'}});
}
