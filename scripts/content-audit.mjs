import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { promptPages } from '../src/prompt-pages.mjs';
import { PROMPT_GUIDES } from '../src/content/prompt-guides.mjs';
import { escapeHTML } from '../src/site-content.mjs';
import { matchAnswer } from '../public/rules.mjs';
import editorial from '../src/prompt-editorial.json' with { type: 'json' };

const base = process.argv[2] || 'http://localhost:3053';
const output = process.argv[3] || 'output/content-20261118';
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
try {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  // Check both render paths: live Worker HTML and the static Next.js export.
  for (const entry of promptPages) {
    const response = await page.request.get(base + entry.path);
    assert.equal(response.status(), 200, entry.path);
    const live = await response.text();
    const exported = await readFile('public/site' + entry.path + 'index.html', 'utf8');
    for (const html of [live, exported]) {
      if (editorial[entry.prompt.id]) assert.ok(html.includes(editorial[entry.prompt.id]), entry.path + ' existing editorial content');
      assert.ok(!/\b[A-Za-z]+\?s\b|\?Name [^<]*\?/.test(html), entry.path + ' damaged punctuation');
      assert.ok(html.includes('https://krillion-unlimited.app' + entry.path), entry.path);
      assert.ok(!html.includes('Accepted entries currently in this bank'), entry.path);
      assert.ok(!/<td>0<\/td>/.test(html), entry.path + ' empty tier row');
      for (const answer of entry.prompt.answers) {
        assert.ok(html.includes('<strong>' + escapeHTML(answer.answer) + '</strong>'), entry.path + ' missing answer');
        for (const alias of answer.aliases || []) assert.ok(html.includes(escapeHTML(alias)), entry.path + ' missing alias');
      }
    }
  }
  // Validate the editorial examples against the actual matcher, not just HTML copy.
  let acceptedChecks = 0;
  let aliasChecks = 0;
  let excludedChecks = 0;
  for (const id of Object.keys(PROMPT_GUIDES)) {
    const prompt = promptPages.find(entry => entry.prompt.id === id).prompt;
    for (const answer of prompt.answers) {
      assert.equal(matchAnswer(answer.answer, prompt.answers)?.answer, answer.answer);
      acceptedChecks++;
      for (const alias of answer.aliases || []) {
        assert.equal(matchAnswer(alias, prompt.answers)?.answer, answer.answer);
        aliasChecks++;
      }
    }
    for (const [input] of PROMPT_GUIDES[id].examples) {
      assert.equal(matchAnswer(input, prompt.answers), null, id + ': ' + input);
      excludedChecks++;
    }
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [id, guide] of Object.entries(PROMPT_GUIDES)) {
      const entry = promptPages.find(item => item.prompt.id === id);
      assert.ok(entry, id + ' has a published page');
      await page.goto(base + entry.path, { waitUntil: 'networkidle' });
      assert.equal(await page.locator('h1').count(), 1);
      const body = await page.locator('.article-body').innerText();
      assert.ok(body.includes(guide.scope));
      for (const [answer, reason] of guide.examples) {
        assert.ok(body.includes(answer));
        assert.ok(body.includes(reason));
      }
      assert.equal(await page.locator('details li strong').count(), entry.prompt.answers.length);
      assert.ok(await page.locator('a[href="/answer-matching-guide/"]').count());
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, entry.path);
      if (id === 'practice-6' || id === 'music-expanded-12') {
        await page.screenshot({ path: `${output}/${id}-${width}.png`, fullPage: true });
      }
    }
    await page.goto(base + '/how-to-play/', { waitUntil: 'networkidle' });
    const rules = await page.locator('.article-body').innerText();
    assert.ok(!/\b[A-Za-z]+\?s\b/.test(rules), 'rules damaged punctuation');
    assert.ok(rules.includes('Within a run, the saved answer snapshot fixes the tiers and scores'));
    assert.ok(rules.includes('several answers, or none, can qualify'));
    assert.ok(rules.includes('100 accepted choices from distinct browser identifiers'));
    assert.ok(rules.includes('Rankings use separate UTC day and Monday-based week windows'));
    assert.ok(!rules.includes('The same recognized entry keeps its configured score'));
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true);
    await page.screenshot({ path: `${output}/rules-${width}.png`, fullPage: true });
  }
  assert.deepEqual(errors, []);
  const report = { ok: true, base, promptPages: promptPages.length, detailedGuides: Object.keys(PROMPT_GUIDES).length, matcher: { acceptedChecks, aliasChecks, excludedChecks }, widths: [1440, 390], javascriptEnabled: false, checks: ['Worker and static export preserve answers and aliases', 'no empty tiers', 'six specific scopes and examples', 'examples agree with actual matcher', 'rules consistency', 'no damaged punctuation', 'canonical URLs', 'mobile overflow'], errors };
  await writeFile(output + '/report.json', JSON.stringify(report, null, 2) + '\n');
  console.log(report);
} finally {
  await browser.close();
}
