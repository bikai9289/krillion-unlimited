import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker, { validateReference } from '../src/worker.mjs';
import { DEMO } from '../src/demo.mjs';
import { PRACTICE_BANK, dailyPuzzle } from '../src/practice.mjs';
import { SITE } from '../src/config.mjs';
import { documents, aiLinks } from '../src/docs.mjs';
import { etDate, resetAt, normalize, matchAnswer, TIERS } from '../public/rules.mjs';
import { homePage } from '../src/html.mjs';
import { sitemapPaths } from '../src/site-content.mjs';

function database(){
  const db=new DatabaseSync(':memory:');
  db.exec(readFileSync(new URL('../migrations/0001_initial.sql',import.meta.url),'utf8'));
  db.exec(readFileSync(new URL('../migrations/0002_pause.sql',import.meta.url),'utf8'));
  db.exec(readFileSync(new URL('../migrations/0003_practice_puzzles.sql',import.meta.url),'utf8'));
  const prepare=sql=>({
    bind(...args){
      const s=db.prepare(sql);
      return {
        async first(){return s.get(...args)||null},
        async all(){return {results:s.all(...args)}},
        async run(){const r=s.run(...args);return {success:true,meta:{changes:Number(r.changes)}}},
      };
    },
    async first(){return db.prepare(sql).get()||null},
  });
  return{prepare,async batch(statements){db.exec('BEGIN');try{const r=[];for(const s of statements)r.push(await s.run());db.exec('COMMIT');return r}catch(e){db.exec('ROLLBACK');throw e}},close:()=>db.close()};
}
function service(){const env={DB:database(),BUCKET:{put:async()=>{},get:async()=>null},LOCAL_DEVELOPMENT:'true',REFERENCE_SYNC:'false',ASSETS:{fetch:async()=>new Response('not found',{status:404})}};let cookie='';return{env,async call(path,data,extra={}){const r=await worker.fetch(new Request('http://localhost:3051'+path,{...(data===undefined?{}:{method:'POST',body:JSON.stringify(data),headers:{'Content-Type':'application/json','Cookie':cookie,...extra}}),...(data===undefined?{headers:{Cookie:cookie,...extra}}:{})}),env,{});if(r.headers.get('Set-Cookie'))cookie=r.headers.get('Set-Cookie').split(';')[0];return{status:r.status,body:await r.json()}},cookie:()=>cookie};}

test('New York reset follows DST rather than device midnight',()=>{
  assert.equal(etDate(Date.parse('2026-10-17T03:59:59Z')),'2026-10-16');
  assert.equal(etDate(Date.parse('2026-10-17T04:00:00Z')),'2026-10-17');
  assert.equal(new Date(resetAt('2026-10-17')).toISOString(),'2026-10-18T04:00:00.000Z');
  assert.equal(new Date(resetAt('2026-12-17')).toISOString(),'2026-12-18T05:00:00.000Z');
});
test('answer matching normalizes accents, uses known aliases and avoids short fuzzy guesses',()=>{
  assert.equal(normalize('São Tomé & Príncipe'),'saotomeandprincipe');
  assert.equal(matchAnswer('mashed',DEMO.prompts[0].answers).answer,'Mashed potatoes');
  assert.equal(matchAnswer('Yttrum',DEMO.prompts[3].answers).correction,true);
  assert.equal(matchAnswer('xyz',DEMO.prompts[3].answers),null);
  assert.equal(matchAnswer('zzzzzzzzzz',DEMO.prompts[0].answers),null);
});
test('reference import validates date, question identity and tier whitelist',()=>{
  const date='2026-10-17';const today={date,dayNumber:94,prompts:DEMO.prompts.map(({id,text})=>({id,text}))},reveal={date,prompts:structuredClone(DEMO.prompts)};
  assert.equal(validateReference(today,reveal,date).prompts.length,7);
  assert.throws(()=>validateReference(today,{...reveal,date:'2026-10-18'},date));
  reveal.prompts[0].text='Different question';assert.throws(()=>validateReference(today,reveal,date));
});
test('seven rounds are scored on server; retries cannot duplicate points; other browsers cannot read the run',async()=>{
  const s=service();let{body:game}=await s.call('/api/start',{});const id=game.runId;
  const first=PRACTICE_BANK.find(p=>p.id===game.prompts[0].id);
  const preview=await s.call('/api/answer',{runId:id,round:0,answer:'zzzzzzzzzz'});assert.equal(preview.body.rejected,true);
  const rejected=await s.call('/api/answer',{runId:id,round:0,answer:'zzzzzzzzzz'});assert.equal(rejected.body.rejected,true);
  for(let i=0;i<7;i++){
    const answer=PRACTICE_BANK.find(p=>p.id===game.prompts[i].id).answers.find(a=>a.tier==='krillion').answer;
    const result=await s.call('/api/answer',{runId:id,round:i,answer,confirm:true,score:99999});assert.equal(result.status,200);assert.equal(result.body.result.score,TIERS.krillion.score);game=result.body.state;
    const duplicate=await s.call('/api/answer',{runId:id,round:i,answer});assert.equal(duplicate.body.alreadyScored,true);assert.equal(duplicate.body.state.results.length,i+1);
    if(i<6){const n=await s.call('/api/next',{runId:id});assert.equal(n.body.round,i+1);}
  }
  assert.equal(game.score,700);assert.equal(game.completed,true);
  const same=await s.call('/api/start',{});assert.equal(same.body.runId,id);
  const review=await s.call('/api/review?run='+id);assert.equal(review.status,200);assert.equal(review.body.betterThan,null);assert.equal(review.body.population,0);
  const other=service();const missing=await other.call('/api/state?run='+id);assert.equal(missing.status,404);
  const csrf=await s.call('/api/start',{}, {Origin:'https://evil.example'});assert.equal(csrf.status,403);
  s.env.DB.close();other.env.DB.close();
});
test('review stays locked, pause is server-side and practice is separate',async()=>{
  const s=service();const{body:g}=await s.call('/api/start',{});
  assert.equal((await s.call('/api/review?run='+g.runId)).status,403);
  const paused=await s.call('/api/pause',{runId:g.runId,paused:true});assert.ok(paused.body.pausedAt);
  const resumed=await s.call('/api/pause',{runId:g.runId,paused:false});assert.equal(resumed.body.pausedAt,null);assert.ok(resumed.body.roundStart>=g.roundStart);
  const practice=await s.call('/api/start',{practice:true});assert.notEqual(practice.body.runId,g.runId);assert.equal(practice.body.mode,'practice');
  s.env.DB.close();
});
test('expired server windows cannot score late answers or be revived by pausing',async()=>{
  const s=service();const{body:g}=await s.call('/api/start',{});
  s.env.LOCAL_DEVELOPMENT='false';
  await s.env.DB.prepare('UPDATE runs SET round_start=? WHERE id=?').bind(Date.now()-30000,g.runId).run();
  const paused=await s.call('/api/pause',{runId:g.runId,paused:true});assert.equal(paused.body.pausedAt,null);
  const late=await s.call('/api/answer',{runId:g.runId,round:0,answer:'Pommes soufflées',confirm:true,timeout:true});
  assert.equal(late.body.result.score,0);assert.equal(late.body.state.round,1);s.env.DB.close();
});
test('four docs share product facts, full composes all three, config mutations propagate without private keys',()=>{
  const a=documents();assert.equal(Object.keys(a).length,4);
  for(const key of ['/llms.txt','/pricing.md','/models.md'])assert.ok(a['/llms-full.txt'].includes(a[key]));
  const changed=structuredClone(SITE);changed.price.amount=7;changed.price.label='Test pricing';changed.features.push('Isolated capability test');changed.secret='DO_NOT_LEAK';
  const b=documents(changed);assert.ok(b['/pricing.md'].includes('7 USD'));assert.ok(b['/models.md'].includes('Isolated capability test'));assert.ok(b['/llms-full.txt'].includes('Test pricing'));assert.ok(!JSON.stringify(b).includes('DO_NOT_LEAK'));
});
test('five AI destinations share one localized prompt, canonical docs and native link safety',()=>{
  for(const lang of SITE.languages){const links=aiLinks(lang);assert.equal(links.length,5);const q=links.map(a=>new URL(a.href).searchParams.get('q'));assert.equal(new Set(q).size,1);assert.ok(q[0].includes(SITE.origin+'/llms-full.txt'));assert.ok(q[0].includes(lang==='zh'?'用中文回答':'answer in English'));assert.equal(new URL(links.find(a=>a.name==='Google AI Mode').href).searchParams.get('udm'),'50');const html=homePage(lang);assert.ok(html.includes('id="play-now"'));assert.ok(!html.includes('github.com'));}
});
test('SSR homepage has a visible keyword heading, playable entry and a short guide-link structure',()=>{
  const html=homePage();assert.ok(html.includes('<h1>Krillion Unlimited</h1>'));assert.ok(!html.includes('id="guide"'));assert.ok(html.includes('href="/how-to-play/"'));assert.ok(html.includes('id="play-now"'));assert.ok(html.includes('https://krillion-unlimited.app/assets/og.png'));
  const text=html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<[^>]+>/g,' '),words=text.match(/[A-Za-z]+(?:[’'-][A-Za-z]+)*/g),density=words.filter(w=>w.toLowerCase()==='krillion').length/words.length;
  assert.ok(words.length<1500);assert.equal((html.match(/<h1[ >]/g)||[]).length,1);assert.ok(!html.includes('googlebot'));
});
test('public docs GET and HEAD are readable UTF-8 and not SPA HTML',async()=>{
  const s=service();for(const path of Object.keys(documents()))for(const method of ['GET','HEAD']){const r=await worker.fetch(new Request('http://localhost:3051'+path,{method}),s.env,{});assert.equal(r.status,200);assert.match(r.headers.get('Content-Type'),/text\/plain; charset=utf-8/);const body=await r.text();if(method==='HEAD')assert.equal(body,'');else{assert.ok(body.startsWith('# '+SITE.name));assert.ok(!body.includes('<!doctype html>'));}}s.env.DB.close();
});


test('unlimited runs persist their unique prompts and hide answers', async()=>{
  const app=service();
  const a=await app.call('/api/start',{practice:true});
  const b=await app.call('/api/start',{practice:true});
  assert.equal(a.status,200);
  assert.equal(b.status,200);
  assert.notEqual(a.body.runId,b.body.runId);
  assert.equal(a.body.prompts.length,7);
  assert.equal(new Set(a.body.prompts.map(p=>p.id)).size,7);
  assert.ok(a.body.prompts.every(p=>!('answers' in p)));
  const restored=await app.call('/api/state?run='+a.body.runId);
  assert.deepEqual(restored.body.prompts,a.body.prompts);
  app.env.DB.close();
});

test('randomized practice scores and reviews the saved puzzle; boards exclude unfinished dives and keep one best per browser', async()=>{
  const app=service();
  const started=await app.call('/api/start',{practice:true});
  const id=started.body.runId;
  let game=started.body;
  assert.equal((await app.call('/api/leaderboard')).body.entries.length,0);
  for(let i=0;i<7;i++){
    const prompt=PRACTICE_BANK.find(p=>p.id===game.prompts[i].id);
    const answer=prompt.answers.find(a=>a.tier==='krillion').answer;
    const response=await app.call('/api/answer',{runId:id,round:i,answer,confirm:true});
    assert.equal(response.body.result.score,100);
    game=response.body.state;
    if(i<6)await app.call('/api/next',{runId:id});
  }
  assert.equal(game.score,700);
  const review=await app.call('/api/review?run='+id);
  assert.deepEqual(review.body.prompts.map(p=>p.id),game.prompts.map(p=>p.id));
  const daily=(await app.call('/api/leaderboard?period=daily')).body;
  assert.equal(daily.entries.length,1);
  assert.equal(daily.entries[0].depth,7000);
  assert.ok(!JSON.stringify(daily).includes(app.cookie().split('=')[1]));
  assert.equal((await app.call('/api/leaderboard?period=monthly')).status,400);
  assert.equal((await app.call('/api/leaderboard?period=weekly')).body.entries.length,1);
  const second=await app.call('/api/start',{practice:true});
  for(let i=0;i<7;i++){
    const p=PRACTICE_BANK.find(p=>p.id===second.body.prompts[i].id);
    await app.call('/api/answer',{runId:second.body.runId,round:i,answer:p.answers[0].answer,confirm:true});
    if(i<6)await app.call('/api/next',{runId:second.body.runId});
  }
  const after=(await app.call('/api/leaderboard')).body;
  assert.equal(after.entries.length,1);
  assert.equal(after.entries[0].score,700);
  app.env.DB.close();
});

test('daily starter puzzles are stable across isolates and vary with the date',()=>{
  const a=dailyPuzzle({date:'2026-11-01'}), b=dailyPuzzle({date:'2026-11-01'}), c=dailyPuzzle({date:'2026-11-02'});
  assert.deepEqual(a.prompts,b.prompts);
  assert.notDeepEqual(a.prompts.map(p=>p.id),c.prompts.map(p=>p.id));
});

test('ready dives do not expire before explicit next; daily puzzles remain pinned to the run',async()=>{
 const app=service();
 const {body:g}=await app.call('/api/start',{ready:true});
 assert.equal(g.roundStart,null);
 const before=await app.call('/api/answer',{runId:g.runId,round:0,answer:'Earth'});
 assert.equal(before.body.alreadyScored,true);
 assert.equal(before.body.state.results.length,0);
 const stored=await app.env.DB.prepare('SELECT content FROM run_puzzles WHERE run_id=?').bind(g.runId).first();
 assert.equal(JSON.parse(stored.content).prompts[0].text,g.prompts[0].text);
 await app.env.DB.prepare('UPDATE puzzles SET content=? WHERE date=?').bind(JSON.stringify({...DEMO,date:g.date}),g.date).run();
 const restored=await app.call('/api/state?run='+g.runId);
 assert.deepEqual(restored.body.prompts,g.prompts);
 const next=await app.call('/api/next',{runId:g.runId});
 assert.ok(next.body.roundStart>Date.now());
 app.env.DB.close();
});

test('sitemap covers dedicated canonical landing pages and redirects slash variants',async()=>{
 const app=service();
 const response=await worker.fetch(new Request('https://krillion-unlimited.app/sitemap.xml'),app.env,{});
 const xml=await response.text();
 assert.equal(sitemapPaths.length,12);
 assert.equal(new Set(sitemapPaths).size,12);
 for(const path of sitemapPaths)assert.ok(xml.includes(`<loc>https://krillion-unlimited.app${path}</loc>`));
 const redirect=await worker.fetch(new Request('https://krillion-unlimited.app/how-to-play'),app.env,{});
 assert.equal(redirect.status,301);
 assert.equal(redirect.headers.get('Location'),'https://krillion-unlimited.app/how-to-play/');
 app.env.DB.close();
});

test('today answer HTML uses this service daily puzzle without altering locked run review',async()=>{
 const app=service();
 const today=(await app.call('/api/today')).body;
 const response=await worker.fetch(new Request('http://localhost:3051/answers/today/'),app.env,{});
 const html=await response.text();
 assert.equal(response.status,200);
 assert.equal(response.headers.get('Cache-Control'),'no-store');
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 assert.ok(html.includes(today.date));
 for(const prompt of today.prompts)assert.ok(html.includes(prompt.text));
 const head=await worker.fetch(new Request('http://localhost:3051/answers/today/',{method:'HEAD'}),app.env,{});
 assert.equal(await head.text(),'');
 const started=(await app.call('/api/start',{ready:true})).body;
 assert.equal((await app.call('/api/review?run='+started.runId)).status,403);
 app.env.DB.close();
});

test('homepage SSR contains actual seven daily prompts, categories, all tiers and matching FAQ schema',async()=>{
 const app=service();const today=(await app.call('/api/today')).body;
 const r=await worker.fetch(new Request('https://krillion-unlimited.app/'),app.env,{});const html=await r.text();
 assert.equal(r.status,200);assert.equal(r.headers.get('Cache-Control'),'no-store');
 assert.ok(!html.includes('Loading your first question'));
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 for(const q of today.prompts)assert.ok(html.includes(q.text));
 assert.equal((html.match(/class="prompt-category"/g)||[]).length,7);
 for(const tier of Object.values(TIERS))assert.ok(html.includes(tier.name));
 const schema=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));
 assert.ok(schema.some(s=>s['@type']==='VideoGame'&&s.url==='https://krillion-unlimited.app/'));
 assert.ok(schema.some(s=>s['@type']==='BreadcrumbList'));
 const faq=schema.find(s=>s['@type']==='FAQPage');assert.equal(faq.mainEntity.length,4);
 for(const q of faq.mainEntity){assert.ok(html.includes(q.name));assert.ok(html.includes(q.acceptedAnswer.text));}
 assert.equal((html.match(/<details open class="home-faq">/g)||[]).length,4);
 app.env.DB.close();
});

test('prompt detail pages use bank scope and real completed-run aggregates',async()=>{
 const app=service();const prompt=PRACTICE_BANK[0];
 const path='/prompts/'+prompt.text.toLowerCase().replace(/[^a-z0-9]+/g,'-')+'/';
 const empty=await worker.fetch(new Request('https://krillion-unlimited.app'+path),app.env,{});
 assert.equal(empty.status,200);assert.ok((await empty.text()).includes('No completed-run observations'));
 const run=(await app.call('/api/start',{practice:true,ready:true})).body;
 const snapshot={date:run.date,prompts:Array.from({length:7},()=>prompt)};
 await app.env.DB.prepare('UPDATE run_puzzles SET content=? WHERE run_id=?').bind(JSON.stringify(snapshot),run.runId).run();
 for(let i=0;i<7;i++){await app.call('/api/next',{runId:run.runId});await app.call('/api/answer',{runId:run.runId,round:i,answer:prompt.answers[0].answer,confirm:true});}
 const populated=await worker.fetch(new Request('https://krillion-unlimited.app'+path),app.env,{});const html=await populated.text();
 assert.ok(html.includes('7 scored rounds from completed dives'));
 assert.ok(html.includes('not a unique-player count'));
 assert.equal((html.match(/<h1[ >]/g)||[]).length,1);
 app.env.DB.close();
});
