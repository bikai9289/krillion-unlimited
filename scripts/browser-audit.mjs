import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { mkdir,writeFile } from 'node:fs/promises';
import { PRACTICE_BANK } from '../src/practice.mjs';
const base=process.argv[2]||'http://localhost:3051';
const output='output/playwright/production-ui';await mkdir(output,{recursive:true});
const b=await chromium.launch({channel:'chrome',headless:true});const errors=[];
try{
 const c=await b.newContext({viewport:{width:1440,height:1050},permissions:['clipboard-read','clipboard-write']});const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
 const phase=x=>p.waitForFunction(x=>JSON.parse(window.render_game_to_text()).phase===x,x);
 await p.goto(base);await phase('intro');assert.ok(await p.locator('#play-now').isVisible());await p.locator('#play-now').click();await phase('answering');await p.evaluate(()=>document.fonts.ready);assert.ok(await p.locator('#answer').isEnabled());await p.screenshot({path:output+'/home.png'});
 await p.reload();await phase('answering');
 await p.locator('#answer').fill('zzzzzzzzzz');await p.locator('#answer-form button[aria-label="Submit answer"]').click();await p.waitForFunction(()=>document.querySelector('#game-status').textContent.includes('Not in'));
 await p.locator('[data-help]').first().click();await p.waitForFunction(()=>JSON.parse(window.render_game_to_text()).paused);await p.locator('#help .close').click();await p.waitForFunction(()=>!JSON.parse(window.render_game_to_text()).paused);
 for(let i=0;i<7;i++){
  await phase('answering');const state=JSON.parse(await p.evaluate(()=>window.render_game_to_text()));const prompt=PRACTICE_BANK.find(q=>q.text===state.prompt);assert.ok(prompt);let answer=prompt.answers.find(a=>a.tier==='krillion').answer;
  await p.locator('#answer').fill(answer);await p.locator('#answer-form button[aria-label="Submit answer"]').click();await phase('landed');
  if(i===0){await p.reload();await phase('landed')}
  await p.locator('#next').click();
 }
 await phase('done');await p.locator('.review-round').first().waitFor();let state=JSON.parse(await p.evaluate(()=>window.render_game_to_text()));assert.equal(state.score,700);assert.equal(state.results.length,7);await p.locator('.review-round summary').first().click();await p.locator('#result .return-link').click();assert.ok((await p.evaluate(()=>navigator.clipboard.readText())).includes('700/700'));await p.screenshot({path:output+'/report.png'});await p.reload();await phase('done');
 await p.locator('#next').click();await phase('ready');await p.locator('#begin-round').click();await phase('answering');await p.locator('#pass-question').click();await phase('landed');assert.equal(JSON.parse(await p.evaluate(()=>window.render_game_to_text())).score,0);
 const mobile=await b.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const mp=await mobile.newPage();mp.on('pageerror',e=>errors.push(e.message));await mp.goto(base);await mp.waitForFunction(()=>JSON.parse(window.render_game_to_text()).phase==='intro');await mp.locator('#play-now').click();await mp.waitForFunction(()=>JSON.parse(window.render_game_to_text()).phase==='answering');assert.equal(await mp.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await mp.screenshot({path:output+'/mobile.png',fullPage:true});await mp.locator('#pass-question').click();await mp.waitForFunction(()=>JSON.parse(window.render_game_to_text()).phase==='landed');
 assert.deepEqual(errors,[]);const report={ok:true,checks:['real server questions','ready and active reload','seven-round scoring','rejection','pause/resume','pass','review','share','completed reload','repeat','mobile'],errors};await writeFile(output+'/report.json',JSON.stringify(report,null,2));console.log(report);
}finally{await b.close()}
