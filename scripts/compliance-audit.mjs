import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import {PAGE_DATES} from '../src/content-updates.mjs';
const base=process.argv[2]||'http://localhost:3051';
const browser=await chromium.launch({channel:'chrome',headless:true});
try {
 const context=await browser.newContext({javaScriptEnabled:false});
 const page=await context.newPage();
 const slugs=['terms','contact','disclaimer','privacy','about'];
 for(const slug of slugs){
  const response=await page.goto(`${base}/${slug}/`,{waitUntil:"domcontentloaded"});
  assert.equal(response.status(),200,slug);
  assert.equal(await page.locator('h1').count(),1);
  assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'),`https://krillion-unlimited.app/${slug}/`);
  for(const target of slugs)assert.ok(await page.locator(`footer a[href="/${target}/"]`).count(),`${slug} footer ${target}`);
 }
 await page.goto(base+'/privacy/',{waitUntil:'domcontentloaded'});
 assert.ok(await page.getByRole('heading',{name:'Advertising and cookies'}).count());
 assert.ok(await page.locator('a[href="https://adssettings.google.com/"]').count());
 await page.goto(base+'/contact/',{waitUntil:'domcontentloaded'});
 assert.ok((await page.locator('main').innerText()).includes('bikai9289@gmail.com'));
 assert.equal(await page.locator('main a[href="mailto:bikai9289@gmail.com"]').count(),1);
 assert.ok(!(await page.locator('main').innerText()).includes('A public support email is not available yet.'));
 await page.setViewportSize({width:390,height:844});
 for(const slug of slugs){await page.goto(`${base}/${slug}/`,{waitUntil:"domcontentloaded"});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
 const xml=await(await page.request.get(base+'/sitemap.xml')).text();
 for(const slug of slugs)assert.ok(xml.includes(`<loc>https://krillion-unlimited.app/${slug}/</loc><lastmod>${PAGE_DATES[`/${slug}/`]}</lastmod>`));
 console.log('Compliance pages: no-JS HTML, canonicals, legal footer, advertising choices, mobile layout and sitemap passed. Published contact email and mailto link verified.');
} finally {await browser.close();}
