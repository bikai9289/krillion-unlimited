import editorial from './prompt-editorial.json' with {type:'json'};
import { PROMPT_GUIDES } from './content/prompt-guides.mjs';
import published from './published-prompts.json' with {type:'json'};
import { PRACTICE_BANK } from './practice.mjs';
import { TIERS } from '../public/rules.mjs';
import { categories, ORIGIN, escapeHTML as esc, siteNavigation, siteFooter, documentHead } from './site-content.mjs';

export const promptSlug = p => p.text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
export const promptPages = PRACTICE_BANK.filter(p=>published.includes(p.id)).map(prompt=>({prompt,modified:'2026-11-18',path:`/prompts/${promptSlug(prompt)}/`,h1:prompt.text,title:prompt.id==='practice-6'?'Name an Ocean — Five Accepted Answers & Practice':`${prompt.text} — Answer Guide | Krillion Unlimited`,description:`Accepted answer scope, prepared rarity tiers and examples for “${prompt.text}” in our independent question bank.`}));
export function categoryRecord(prompt){
 return categories.find(c=>c.ids.includes(prompt.id))||null;
}
export function categoryFor(prompt){
 const category=categoryRecord(prompt);
 if(category)return category.name;
 return ({p1:'Food',p2:'Animals',p5:'General knowledge',p7:'Entertainment','practice-2':'Calendar','practice-3':'Games','practice-4':'Art','practice-5':'Mathematics','practice-7':'Calendar','practice-10':'Games','practice-13':'Language','practice-19':'Calendar','practice-20':'Language','practice-21':'Music'})[prompt.id]||'General knowledge';
}
export function siblingPrompts(prompt,count=2){
 const category=categoryRecord(prompt);
 if(!category)return [];
 const members=PRACTICE_BANK.filter(p=>category.ids.includes(p.id)&&published.includes(p.id))
  .sort((a,b)=>promptSlug(a).localeCompare(promptSlug(b))||a.id.localeCompare(b.id));
 const index=members.findIndex(p=>p.id===prompt.id);
 if(index<0||members.length<2)return [];
 const out=[];
 for(let step=1;out.length<count&&out.length<members.length-1;step++){
  out.push(members[(index+step)%members.length]);
 }
 return out;
}
export function relatedPromptsMarkup(prompt){
 const category=categoryRecord(prompt);
 const siblings=siblingPrompts(prompt,2);
 if(!category||siblings.length<2)return '';
 return `<h2>Related ${esc(category.name)} prompts</h2><p>Compare the wording and accepted answers in these related questions.</p><ul>${siblings.map(p=>`<li><a href="/prompts/${promptSlug(p)}/">${esc(p.text)}</a></li>`).join('')}</ul><p><a href="/categories/${category.slug}/">All ${esc(category.name)} guides</a></p>`;
}
export const faqs = [
 ['Is Krillion Unlimited free to play?','Yes. Daily and Unlimited dives are free in the browser, with no account or download required.'],
 ['How are answers scored?','The server matches an accepted answer list. Tiers award 10, 15, 30, 60, 85 or 100 points. After 100 accepted browser choices per prompt, new runs use recent observed frequency; smaller samples use a labelled editorial fallback. Scores are frozen per run.'],
 ['Are these the official daily questions?','No. The Daily prompts and answer guide on this site use our independent question bank and are not the daily puzzle from krillion.io.'],
 ['What is the difference between Daily and Unlimited?','Daily saves one shared seven-question challenge per browser per New York day. Unlimited draws a mixed set for every new dive without a daily play cap.'],
];
const jsonLd = data => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g,'\\u003c')}</script>`;
export function breadcrumbs(items){return jsonLd({'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:items.map(([name,path],i)=>({'@type':'ListItem',position:i+1,name,item:ORIGIN+path}))});}
export function homepageEvidence(puzzle){
 return `<section class="daily-evidence" aria-labelledby="daily-heading"><p class="eyebrow">OUR DAILY DIVE · ${esc(puzzle.date)} · AMERICA/NEW_YORK</p><h2 id="daily-heading">Today’s seven prompts</h2><p>These are our own Daily questions, rendered by the server. Unlimited uses a different random mix. <a href="/?mode=daily&play=1#game">Play this Daily dive</a>.</p><ol>${puzzle.prompts.map(p=>`<li><span class="prompt-category">${esc(categoryFor(p))}</span><a href="/prompts/${promptSlug(p)}/">${esc(p.text)}</a></li>`).join('')}</ol><h2>Six tiers. One ocean.</h2><p>Each accepted answer earns its prepared points × 10 metres. A pass or empty timeout scores zero; seven 100-point answers reach 7,000m. You have 25 seconds per question after the preview.</p><div class="score-tiers">${Object.values(TIERS).map(t=>`<p><strong>${esc(t.name)}</strong><span>${t.score} points · ${t.score*10}m</span></p>`).join('')}</div><p>Editorial tiers are the fallback; prompts with 100 accepted browser choices use observed frequency for new runs. <a href="/how-to-play/">Read the full rules</a> · <a href="/answers/today/">Today’s own answers</a> · <a href="/prompts/">Browse all prompt guides</a> · <a href="/categories/">Browse categories</a>.</p><h2>Questions before you dive</h2>${faqs.map(([q,a])=>`<details open class="home-faq"><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}<noscript><p>JavaScript is needed to play the timed game. The questions, scoring guide, answer help and category pages remain readable without it.</p></noscript></section>`;
}
export function hydrateHomepage(html,puzzle){
 const evidence=homepageEvidence(puzzle);
 html=html.replace(/<h2 id="question">[\s\S]*?<\/h2>/,`<h2 id="question">${esc(puzzle.prompts[0].text)}</h2>`);
 html=html.replace('<section class="home-links"',evidence+'<section class="home-links"');
 html=html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g,'');
 const schema=[{'@context':'https://schema.org','@type':'VideoGame',name:'Krillion Unlimited',url:ORIGIN+'/',description:'Free independent seven-question rare-answer trivia with Daily and Unlimited modes.',gamePlatform:'Web browser',isAccessibleForFree:true}, {'@context':'https://schema.org','@type':'FAQPage',mainEntity:faqs.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))}];
 return html.replace('</head>',schema.map(jsonLd).join('')+breadcrumbs([['Home','/']])+'</head>');
}
export function promptContent(prompt,stats=null){
 if(stats&&stats.reduce((n,r)=>n+Number(r.attempts),0)<100)stats=null;
 const grouped=Object.entries(TIERS).map(([key,t])=>({key,t,answers:prompt.answers.filter(a=>a.tier===key)}));
 const guide=PROMPT_GUIDES[prompt.id];
 const matches=stats?.reduce((n,r)=>n+Number(r.attempts),0)||0;
 return `${editorial[prompt.id]||''}<p class="scope-note">Our independent answer bank. <a href="/answer-matching-guide/">Matching rules and bank limitations</a>.</p><p>Category: ${categoryRecord(prompt)?`<a href="/categories/${categoryRecord(prompt).slug}/">${esc(categoryFor(prompt))}</a>`:esc(categoryFor(prompt))}.</p><h2>Answer scope</h2><p>${guide?esc(guide.scope):`Choose one answer for this question: <strong>${esc(prompt.text)}</strong>. The accepted list below shows the names and aliases supported for this question.`}</p>${guide?`<h2>${esc(guide.heading)}</h2>${guide.paragraphs.map(text=>`<p>${esc(text)}</p>`).join('')}<h2>Examples to distinguish</h2><p>These are explanations of the question’s scope and current coverage, not statistics about player mistakes.</p><dl>${guide.examples.map(([answer,reason])=>`<dt><strong>${esc(answer)}</strong></dt><dd>${esc(reason)}</dd>`).join('')}</dl>`:''}<h2>${prompt.rarity?.method==='observed'?'Frequency-based answer tiers':'Editorial answer tiers'}</h2><p>${prompt.rarity?.method==='observed'?'These tiers use accepted choices from at least 100 browser identifiers in the last 30 days, with one choice per browser and add-one smoothing. They are frozen when each new run starts.':'These are editorial settings, not measured popularity. New runs can use observed tiers once 100 distinct browser choices qualify. Your saved run or Daily edition keeps its own scores. <a href="/how-to-play/">How scoring works</a>.'}</p><table><thead><tr><th>Tier</th><th>Entries</th><th>Points / depth</th></tr></thead><tbody>${grouped.filter(g=>g.answers.length).map(({t,answers})=>`<tr><td>${esc(t.name)}</td><td>${answers.length}</td><td>${t.score} pts / ${t.score*10}m</td></tr>`).join('')}</tbody></table><h2>Accepted answers and aliases</h2>${grouped.filter(g=>g.answers.length).map(({t,answers})=>`<details open class="home-faq"><summary>${esc(t.name)} · ${t.score} points</summary><ul>${answers.map(a=>`<li><strong>${esc(a.answer)}</strong>${a.aliases?.length?' — also accepts: '+a.aliases.map(esc).join(', '):''}</li>`).join('')}</ul></details>`).join('')}${stats===null?'':'<h2>Observed browser choices</h2>'}${stats===null?'':matches?`<p>${matches} accepted browser choices from completed dives are recorded for this prompt over the last 30 days. Repeated choices from the same browser count once. Blanks, passes and rejected retries are excluded. Browser identifiers are not a verified unique-person count.</p><ul>${stats.map(r=>`<li>${r.tier?esc(TIERS[r.tier]?.name||r.tier):'Miss / pass'}: ${Number(r.attempts)} browser choices</li>`).join('')}</ul>`:''}${relatedPromptsMarkup(prompt)}<h2>Try it in a dive</h2><p>Unlimited mixes seven prompts from the bank, so this exact question is not guaranteed to appear in the next run. The <a href="/answers/today/">Daily answer guide</a> shows the current shared set.</p><a class="primary content-play" href="/?play=1#game">Play a mixed dive <span>↘</span></a><p><a href="/prompts/">All prompt guides</a> · <a href="/categories/">Categories</a> · <a href="/how-to-play/">Rules and scoring</a></p>`;
}
export function promptIndex(){return `<p>Explore ${PRACTICE_BANK.length} practice prompts across the bank; the ${promptPages.length} existing guides below cover published questions from our independent starter bank. Each guide explains answer scope, prepared score tiers and the entries our matching engine accepts.</p><p>These are mixed into Unlimited dives. No subject-only or specific-prompt selection is promised.</p><ul>${promptPages.map(p=>`<li><span class="prompt-category">${esc(categoryFor(p.prompt))}</span> <a href="${p.path}">${esc(p.h1)}</a></li>`).join('')}</ul><p><a href="/?play=1#game">Play now</a> · <a href="/answers/today/">Today’s Daily questions and answers</a></p>`;}
export function renderPromptPage(page,stats,env={}){const category=categoryRecord(page.prompt);const crumb=category?[['Home','/'],['Categories','/categories/'],[category.name,`/categories/${category.slug}/`],[page.h1,page.path]]:[['Home','/'],['Prompts','/prompts/'],[page.h1,page.path]];const visible=category?`<a href="/">Home</a> / <a href="/categories/">Categories</a> / <a href="/categories/${category.slug}/">${esc(category.name)}</a>`:`<a href="/">Home</a> / <a href="/prompts/">Prompts</a>`;return `<!doctype html><html lang="en"><head>${documentHead(page,env)}${breadcrumbs(crumb)}</head><body>${siteNavigation}<main class="content-page"><nav class="breadcrumbs">${visible}</nav><h1>${esc(page.h1)}</h1><div class="article-body">${promptContent(page.prompt,stats)}</div></main>${siteFooter}</body></html>`;}
