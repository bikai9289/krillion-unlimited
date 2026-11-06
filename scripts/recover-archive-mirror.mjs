// Input must be a daily_archives-only D1 SQL export. Output stays private.
import { DatabaseSync } from 'node:sqlite';
import { readFile,writeFile } from 'node:fs/promises';
import { validSnapshot } from '../src/archive-store.mjs';
const [input,output]=process.argv.slice(2);
if(!input||!output)throw new Error('Usage: node scripts/recover-archive-mirror.mjs <archive-export.sql> <mirror.json>');
const db=new DatabaseSync(':memory:');
try{
  db.exec(await readFile(input,'utf8'));
  const rows=db.prepare('SELECT date,content FROM daily_archives ORDER BY date').all();
  const editions=Object.fromEntries(rows.map(row=>[row.date,JSON.parse(row.content)]));
  if(!rows.length||!Object.entries(editions).every(([date,puzzle])=>validSnapshot(puzzle,date)))throw new Error('Invalid archive export');
  await writeFile(output,JSON.stringify({version:1,editions}));
  console.log(JSON.stringify({dates:Object.keys(editions),editions:rows.length,output}));
}finally{db.close();}
