import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFile,mkdir} from 'node:fs/promises';
const base=(process.argv[2]||'http://localhost:3051').replace(/\/$/,'');
const browser=await chromium.launch({channel:'chrome',headless:true});
try{
 const context=await browser.newContext({javaScriptEnabled:false,viewport:{width:1440,height:1000}});
 const page=await context.newPage();
 const response=await page.request.get(base+'/sitemap.xml');assert.equal(response.status(),200);
 const xml=await response.text();const entries=[...xml.matchAll(/<url>(.*?)<\/url>/g)].map(m=>({url:m[1].match(/<loc>(.*?)<\/loc>/)[1],lastmod:m[1].match(/<lastmod>(.*?)<\/lastmod>/)?.[1]}));
 assert.ok(entries.length>=122);assert.equal(new Set(entries.map(e=>e.url)).size,entries.length);
 for(const e of entries)assert.ok(e.lastmod&&Number.isFinite(Date.parse(e.lastmod)),e.url+' lastmod');
 for(const slug of ['about','privacy']){
   const head=await page.request.head(base+'/'+slug+'/',{maxRedirects:0});assert.equal(head.status(),200);assert.ok(!head.headers().location);
   const redirect=await page.request.get(base+'/'+slug,{maxRedirects:0});assert.equal(redirect.status(),301);assert.equal(new URL(redirect.headers().location).pathname,'/'+slug+'/');
 }
 const errors=[];let cursor=0;
 await Promise.all(Array.from({length:6},async()=>{while(cursor<entries.length){const e=entries[cursor++],path=new URL(e.url).pathname;try{const r=await page.request.get(base+path,{maxRedirects:0});assert.equal(r.status(),200,path);const html=await r.text();assert.equal((html.match(/<h1[ >]/g)||[]).length,1,path);const canonical=html.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];assert.equal(canonical,e.url,path);const ld=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m=>JSON.parse(m[1]));assert.ok(ld.some(s=>s['@type']==='BreadcrumbList'),path);}catch(error){errors.push({path,error:error.message})}}}));
 assert.deepEqual(errors,[]);
 const counts={};
 for(const slug of ['music','games','language','geography','sports','science']){
   await page.goto(base+'/categories/'+slug+'/');counts[slug]=await page.locator('.article-body a[href^="/prompts/"]').count();assert.ok(counts[slug]>=10,slug);
 }
 await page.goto(base+'/prompts/');const promptCount=await page.locator('.article-body a[href^="/prompts/"]').count();assert.ok(promptCount>=100);
 await page.goto(base+'/answers/today/');
 const text=await page.locator('main').innerText();assert.ok(text.length>1500);
 const faqs=await page.locator('script[type="application/ld+json"]').evaluateAll(nodes=>nodes.map(n=>JSON.parse(n.textContent)).find(s=>s['@type']==='FAQPage'));
 assert.equal(faqs.mainEntity.length,6);assert.equal(await page.locator('details[open]').count(),6);
 for(const f of faqs.mainEntity){assert.ok(text.includes(f.name));assert.ok(text.includes(f.acceptedAnswer.text));}
 const report={ok:true,base,sitemapUrls:entries.length,promptCount,categoryCounts:counts,todayVisibleCharacters:text.length,checks:['slash HEAD 200','slashless 301','all canonical equals sitemap loc','all URLs 200','one H1 each','all lastmod valid','all breadcrumbs','visible FAQ equals schema','no-JS']};
 await mkdir('output',{recursive:true});await writeFile('output/seo-release-'+(base.startsWith('https:')?'production':'local')+'.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report));
}finally{await browser.close()}
