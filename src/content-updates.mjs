// Editorial dates change when the corresponding content is edited,
// not on every build or crawl. Daily hubs still use the America/New_York date.
export const CONTENT_UPDATED = '2026-11-01';
// Per-path overrides: only bump a URL when that page’s content actually changed.
export const PAGE_DATES = {
  '/answer-matching-guide/': '2026-11-09',
  '/terms/': '2026-11-07',
  '/contact/': '2026-11-07',
  '/disclaimer/': '2026-11-07',
  '/privacy/': '2026-11-07',
  '/about/': '2026-11-07',

  '/prompts/': '2026-11-02',
  '/categories/': '2026-11-02',
  '/categories/more/': '2026-11-02',
};
export function lastModified(path, today, promptPages, statisticDates = new Map()) {
  const archive=path.match(/^\/answers\/(\d{4}-\d{2}-\d{2})\/$/);
  if(archive)return archive[1];
  if(path==='/'||path==='/answers/today/'||path==='/answers/')return today;
  const prompt=promptPages.find(p=>p.path===path);
  if(prompt){
    const editorial=prompt.modified||PAGE_DATES[path]||CONTENT_UPDATED;
    const recorded=statisticDates.get(prompt.prompt.id);
    const observed=recorded?recorded.slice(0,10):'';
    return observed&&observed>editorial?observed:editorial;
  }
  return PAGE_DATES[path]||CONTENT_UPDATED;
}
