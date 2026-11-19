export const SOURCE_OBSERVATION_SQL=`INSERT OR IGNORE INTO prompt_observations(player,prompt_id,prompt_text,answer,created_at)
WITH candidates AS (
  SELECT r.player,json_extract(p.value,'$.id') AS prompt_id,json_extract(p.value,'$.text') AS prompt_text,a.answer,a.created_at,
    ROW_NUMBER() OVER (
      PARTITION BY r.player,json_extract(p.value,'$.id'),json_extract(p.value,'$.text')
      ORDER BY a.created_at,r.id,a.round) AS pick
  FROM answers a JOIN runs r ON r.id=a.run_id JOIN run_puzzles rp ON rp.run_id=r.id
  JOIN json_each(rp.content,'$.prompts') p ON CAST(p.key AS INTEGER)=a.round
  WHERE r.completed=1 AND a.answer IS NOT NULL AND a.created_at>=?
) SELECT player,prompt_id,prompt_text,answer,created_at FROM candidates WHERE pick=1`;

export const SOURCE_SITEMAP_SQL=`INSERT INTO prompt_mtimes(prompt_id,updated_at)
SELECT json_extract(p.value,'$.id') AS prompt_id,MAX(a.created_at) AS updated_at
FROM answers a JOIN runs r ON r.id=a.run_id JOIN run_puzzles rp ON rp.run_id=r.id
JOIN json_each(rp.content,'$.prompts') p ON CAST(p.key AS INTEGER)=a.round
WHERE r.completed=1
GROUP BY json_extract(p.value,'$.id')
ON CONFLICT(prompt_id) DO UPDATE SET updated_at=MAX(prompt_mtimes.updated_at,excluded.updated_at)`;

const TABLE_OBSERVATION_SQL=`SELECT prompt_id AS promptId,prompt_text AS promptText,answer,COUNT(*) AS count
FROM prompt_observations WHERE created_at>=? GROUP BY prompt_id,prompt_text,answer`;
const TABLE_SITEMAP_SQL=`SELECT prompt_id AS id,updated_at AS updated FROM prompt_mtimes`;
export const OBSERVATIONS_BACKFILL_KEY='observations_backfill';
export const PROMPT_MTIMES_BACKFILL_KEY='prompt_mtimes_backfill';

export async function isBackfillDone(env,key){
  try{
    const row=await env.DB.prepare('SELECT value FROM stats_meta WHERE key=?').bind(key).first();
    return row?.value==='done';
  }catch{
    return false;
  }
}

async function markBackfillDone(env,key){
  await env.DB.prepare('INSERT INTO stats_meta(key,value) VALUES(?,?) ON CONFLICT(key) DO UPDATE SET value=excluded.value').bind(key,'done').run();
}

export async function backfillObservationsFromSource(env){
  if(await isBackfillDone(env,OBSERVATIONS_BACKFILL_KEY))return;
  const since=Date.now()-30*86400000;
  await env.DB.prepare(SOURCE_OBSERVATION_SQL).bind(since).run();
  await markBackfillDone(env,OBSERVATIONS_BACKFILL_KEY);
}

export async function backfillPromptMtimesFromSource(env){
  if(await isBackfillDone(env,PROMPT_MTIMES_BACKFILL_KEY))return;
  await env.DB.prepare(SOURCE_SITEMAP_SQL).bind().run();
  await markBackfillDone(env,PROMPT_MTIMES_BACKFILL_KEY);
}

export async function queryObservationCounts(env){
  const since=Date.now()-30*86400000;
  return (await env.DB.prepare(TABLE_OBSERVATION_SQL).bind(since).all()).results;
}

export async function queryPromptMtimes(env){
  const rows=(await env.DB.prepare(TABLE_SITEMAP_SQL).all()).results;
  return rows.map(r=>[r.id,new Date(Number(r.updated)).toISOString()]);
}

export async function computeObservations(env,{allowSourceScan=false}={}){
  if(allowSourceScan)await backfillObservationsFromSource(env);
  else if(!await isBackfillDone(env,OBSERVATIONS_BACKFILL_KEY)){
    const rows=await queryObservationCounts(env);
    if(rows.length)return rows;
    throw new Error('observation table has not been backfilled');
  }
  return queryObservationCounts(env);
}

export async function computeSitemapPromptMtimes(env,{allowSourceScan=false}={}){
  if(allowSourceScan)await backfillPromptMtimesFromSource(env);
  else if(!await isBackfillDone(env,PROMPT_MTIMES_BACKFILL_KEY)){
    const rows=await queryPromptMtimes(env);
    if(rows.length)return rows;
    throw new Error('prompt mtimes table has not been backfilled');
  }
  return queryPromptMtimes(env);
}

export async function recordCompletedRun(env,{player,puzzle,results,createdAt}){
  if(!player||!puzzle?.prompts||!results?.length)return;
  const statements=[];
  for(const result of results){
    const prompt=puzzle.prompts[result.round];
    if(!prompt||!result.answer)continue;
    const at=Number(result.createdAt||result.created_at||createdAt)||Date.now();
    statements.push(env.DB.prepare('INSERT OR IGNORE INTO prompt_observations(player,prompt_id,prompt_text,answer,created_at) VALUES(?,?,?,?,?)').bind(player,prompt.id,prompt.text,result.answer,at));
    statements.push(env.DB.prepare('INSERT INTO prompt_mtimes(prompt_id,updated_at) VALUES(?,?) ON CONFLICT(prompt_id) DO UPDATE SET updated_at=MAX(prompt_mtimes.updated_at,excluded.updated_at)').bind(prompt.id,at));
  }
  if(statements.length)await env.DB.batch(statements);
}
