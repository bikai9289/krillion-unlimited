export const SITE = {
  name: 'Krillion Unlimited', origin: 'https://krillion-unlimited.app',
  repository: 'https://github.com/bikai9289/krillion-unlimited',
  description: 'Play Krillion Unlimited, an independent free trivia game with unlimited practice dives. Seven prompts, 25 seconds each. Think rare, dive deeper, and share your score.',
  title: 'Krillion Unlimited — Free Trivia, No Daily Limit',
  languages: ['en', 'zh'], gameplayLanguage: 'en',
  price: { amount: 0, currency: 'USD', label: 'Free to play', checkout: false },
  rounds: 7, previewSeconds: 3, answerSeconds: 25, maxScore: 700, metresPerPoint: 10,
  models: [], credits: false, accounts: false,
  modes: ['daily', 'practice'],
  features: ['Daily seven-prompt trivia', 'Unlimited randomized practice dives', 'Daily and weekly anonymous leaderboards', 'Six rarity tiers', 'Typo correction with confirmation', 'Animated jellyfish and depth feedback', 'Synthesized sound effects', 'Score and depth report', 'Answer review', 'Local completed-dive history', 'Shareable results'],
  analytics: { plausible: '' },
};
export const publicConfig = site => ({ name: site.name, origin: site.origin, repository: site.repository, price: site.price, rounds: site.rounds, previewSeconds: site.previewSeconds, answerSeconds: site.answerSeconds, maxScore: site.maxScore, metresPerPoint: site.metresPerPoint, models: site.models, credits: site.credits, accounts: site.accounts, modes: site.modes, features: site.features, languages: site.languages, gameplayLanguage: site.gameplayLanguage });
