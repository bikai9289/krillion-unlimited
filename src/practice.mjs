import { DEMO } from './demo.mjs';

const extra = [
  ['Name a planet in our solar system', ['Earth', 'Mars', 'Jupiter', 'Venus', 'Neptune', 'Uranus', 'Mercury', 'Saturn']],
  ['Name a month with exactly 30 days', ['April', 'June', 'September', 'November']],
  ['Name a standard chess piece', ['Pawn', 'King', 'Queen', 'Rook', 'Bishop', 'Knight']],
  ['Name a primary or secondary color in the traditional RYB model', ['Red', 'Yellow', 'Blue', 'Orange', 'Green', 'Purple']],
  ['Name a polygon with three to ten sides', ['Triangle', 'Square', 'Pentagon', 'Hexagon', 'Heptagon', 'Octagon', 'Nonagon', 'Decagon']],
  ['Name an ocean', ['Pacific', 'Atlantic', 'Indian', 'Arctic', 'Southern']],
  ['Name a day of the week', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']],
  ['Name one of the five Great Lakes of North America', ['Superior', 'Michigan', 'Huron', 'Erie', 'Ontario']],
  ['Name a US state that borders the Pacific Ocean', ['California', 'Hawaii', 'Alaska', 'Oregon', 'Washington']],
  ['Name one of the four suits in a standard French-suited card deck', ['Hearts', 'Spades', 'Diamonds', 'Clubs']],
  ['Name a noble gas in the periodic table', ['Helium', 'Neon', 'Argon', 'Krypton', 'Xenon', 'Radon', 'Oganesson']],
  ['Name an alkali metal', ['Lithium', 'Sodium', 'Potassium', 'Rubidium', 'Caesium', 'Francium']],
  ['Name a symbol used as a Roman numeral', ['I', 'V', 'X', 'L', 'C', 'D', 'M']],
  ['Name an SI base unit', ['Metre', 'Kilogram', 'Second', 'Ampere', 'Kelvin', 'Mole', 'Candela']],
  ['Name a continent in the seven-continent model', ['Europe', 'Asia', 'Africa', 'North America', 'South America', 'Australia', 'Antarctica']],
  ['Name a country on the island of Great Britain', ['England', 'Scotland', 'Wales']],
  ['Name one of the four main compass directions', ['North', 'South', 'East', 'West']],
  ['Name one of the five Platonic solids', ['Cube', 'Tetrahedron', 'Octahedron', 'Dodecahedron', 'Icosahedron']],
  ['Name a month with exactly 31 days', ['January', 'March', 'May', 'July', 'August', 'October', 'December']],
  ['Name a letter in the Greek alphabet', ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega']],
  ['Name one of the six strings of a guitar in standard tuning, using its note letter', ['E', 'A', 'D', 'G', 'B']],
];
const tiers = ['plankton', 'tooclever', 'schooler', 'rare', 'deepcut', 'krillion'];
const aliases = { Metre: ['meter'], Caesium: ['cesium'], Purple: ['violet'], Superior: ['Lake Superior'], Michigan: ['Lake Michigan'], Huron: ['Lake Huron'], Erie: ['Lake Erie'], Ontario: ['Lake Ontario'], Cube: ['hexahedron'] };
export const PRACTICE_BANK = [...DEMO.prompts, ...extra.map(([text, answers], i) => ({
  id: `practice-${i + 1}`, text,
  answers: answers.map((answer, j) => ({ answer, tier: tiers[Math.round(j * 5 / (answers.length - 1))], aliases: text === 'Name an ocean' ? [`${answer} Ocean`] : aliases[answer] || [] })),
}))];

export function practicePuzzle(base) {
  const prompts = [...PRACTICE_BANK];
  for (let i = prompts.length - 1; i > 0; i--) {
    const j = Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296 * (i + 1));
    [prompts[i], prompts[j]] = [prompts[j], prompts[i]];
  }
  return { ...base, source: 'Independent starter bank · curated difficulty tiers, not player frequency', sample: true, prompts: prompts.slice(0, 7) };
}

export function dailyPuzzle(base) {
  // Stable per date in every Worker isolate; no official puzzle synchronization.
  let seed = 2166136261;
  for (const c of base.date) seed = Math.imul(seed ^ c.charCodeAt(0), 16777619) >>> 0;
  const prompts = [...PRACTICE_BANK];
  for (let i = prompts.length - 1; i > 0; i--) {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    const j = Math.floor(seed / 4294967296 * (i + 1));
    [prompts[i], prompts[j]] = [prompts[j], prompts[i]];
  }
  return { ...base, source: 'Independent starter bank · curated difficulty tiers, not player frequency', sample: true, prompts: prompts.slice(0, 7) };
}
