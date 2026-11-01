// Editorial dates are changed when the corresponding content is edited,
// not on every build or crawl. All current articles were authored/edited on this date.
export const CONTENT_UPDATED = '2026-11-01';
export function lastModified(path, today, promptPages, statisticDates = new Map()) {
  const archive=path.match(/^\/answers\/(\d{4}-\d{2}-\d{2})\/$/);
  if(archive)return archive[1];
  if(path==='/'||path==='/answers/today/'||path==='/answers/')return today;
  const prompt=promptPages.find(p=>p.path===path);
  if(prompt){
    const recorded=statisticDates.get(prompt.prompt.id);
    return recorded && recorded.slice(0,10)>(prompt.modified||CONTENT_UPDATED) ? recorded : prompt.modified||CONTENT_UPDATED;
  }
  return CONTENT_UPDATED;
}
