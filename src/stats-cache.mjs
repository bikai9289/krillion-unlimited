export const OBSERVATION_CACHE_KEY='observations';
export const SITEMAP_PROMPT_MTIME_KEY='sitemap_prompt_mtime';
export const STATS_CACHE_TTL_MS=60*60*1000;
export const STATS_CACHE_FAILURE_TTL_MS=10*60*1000;

export function useStatsCache(env){
  return env?.LOCAL_DEVELOPMENT!=='true';
}

function cacheKey(key){
  return 'stats-cache/'+key+'.json';
}
function failureKey(key){
  return cacheKey(key)+'.error';
}

export async function readStatsCache(env,key,ttlMs=STATS_CACHE_TTL_MS){
  try{
    const object=await env.BUCKET?.get(cacheKey(key));
    if(!object)return null;
    const row=await object.json();
    if(!row||!('value' in row))return null;
    if(ttlMs!=null&&Date.now()-Number(row.refreshed_at)>=ttlMs)return null;
    return row.value;
  }catch{
    return null;
  }
}

export async function writeStatsCache(env,key,value){
  try{
    if(!env.BUCKET)return;
    await env.BUCKET.put(cacheKey(key),JSON.stringify({value,refreshed_at:Date.now()}),{httpMetadata:{contentType:'application/json'}});
    await env.BUCKET.delete?.(failureKey(key));
  }catch(error){
    console.error('stats cache write failed:',error.message);
  }
}

async function hasRecentFailure(env,key){
  try{
    const object=await env.BUCKET?.get(failureKey(key));
    if(!object)return false;
    const row=await object.json();
    return Date.now()-Number(row.failed_at)<STATS_CACHE_FAILURE_TTL_MS;
  }catch{
    return false;
  }
}

async function markFailure(env,key){
  try{
    if(!env.BUCKET)return;
    await env.BUCKET.put(failureKey(key),JSON.stringify({failed_at:Date.now()}),{httpMetadata:{contentType:'application/json'}});
  }catch(error){
    console.error('stats cache failure marker write failed:',error.message);
  }
}

export async function loadOrRefreshStatsCache(env,key,compute,ttlMs=STATS_CACHE_TTL_MS){
  if(useStatsCache(env)){
    const cached=await readStatsCache(env,key,ttlMs);
    if(cached)return cached;
    if(await hasRecentFailure(env,key)){
      const stale=await readStatsCache(env,key,null);
      if(stale)return stale;
      throw new Error('stats cache refresh recently failed for '+key);
    }
    try{
      const fresh=await compute();
      await writeStatsCache(env,key,fresh);
      return fresh;
    }catch(error){
      await markFailure(env,key);
      const stale=await readStatsCache(env,key,null);
      if(stale){
        console.error('stats cache refresh failed, serving stale '+key+':',error.message);
        return stale;
      }
      throw error;
    }
  }
  return compute();
}
