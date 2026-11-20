import test from 'node:test';
import assert from 'node:assert/strict';
import { PRACTICE_BANK } from '../src/practice.mjs';
import { todayContent } from '../src/site-content.mjs';
import { promptHint } from '../src/prompt-hints.mjs';
import { dailyPuzzle } from '../src/practice.mjs';

test('legacy snapshots without IDs retain category-specific hints', () => {
  for (const prompt of PRACTICE_BANK) {
    assert.equal(promptHint({ text: prompt.text }), promptHint(prompt), prompt.text);
    assert.equal(promptHint({ id: 'legacy-id', text: prompt.text }), promptHint(prompt), prompt.text);
  }
});

test('November 21 edition keeps seven distinct hints after snapshot serialization', () => {
  const puzzle = JSON.parse(JSON.stringify(dailyPuzzle({date:'2026-11-21'})));
  assert.equal(new Set(puzzle.prompts.map(promptHint)).size, 7);
});

test('every bank prompt renders a distinct useful hint without revealing answers', () => {
  const html = todayContent({ date: '2026-11-11', prompts: PRACTICE_BANK });
  const hints = [...html.matchAll(/<p>Hint: ([\s\S]*?)<\/p>/g)].map(m => m[1]);
  assert.equal(hints.length, PRACTICE_BANK.length);
  assert.equal(new Set(hints).size, PRACTICE_BANK.length);
  assert.ok(hints.every(h => h.length > 30 && !h.includes('stay inside the exact category')));
  assert.equal((html.match(/<details>/g) || []).length, PRACTICE_BANK.length);
});
