import {promptPages} from '../src/prompt-pages.mjs';
import {cp,mkdir,rm,readFile,writeFile} from 'node:fs/promises';
import {sitemapPaths} from '../src/site-content.mjs';
await rm('public/site',{recursive:true,force:true});
await rm('public/_next',{recursive:true,force:true});
await mkdir('public/site',{recursive:true});
await cp('website/out','public/site',{recursive:true});
await cp('website/out/_next','public/_next',{recursive:true});
// Static export links for /about/ and /privacy/ retain the site's existing canonical URLs.
const report=JSON.parse(await readFile('docs/build-report.json','utf8'));
report.framework='GitBase-derived Next.js App Router';report.pages=[...sitemapPaths,...promptPages.map(p=>p.path)];report.indexablePages=report.pages.length;
await writeFile('docs/build-report.json',JSON.stringify(report,null,2)+'\n');
console.log(`Published ${report.indexablePages} canonical pages (today answers rendered live by Worker).`);
