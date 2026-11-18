// Notes describe this site's accepted sets, not measured player behaviour.
export const PROMPT_GUIDES = {
  'practice-6': {
    scope: 'This prompt asks for one ocean name. Our accepted set is Pacific, Atlantic, Indian, Arctic and Southern. The question uses these five names separately; a sea, gulf or lake is a different answer type.',
    heading: 'Ocean names and full-name aliases',
    paragraphs: [
      'Each short name also has an explicit full-name alias in this bank: Pacific Ocean, Atlantic Ocean, Indian Ocean, Arctic Ocean and Southern Ocean. Choose one ocean rather than combining several names in one submission.',
      'Southern is an accepted answer here even if you learned a four-ocean model at school. This list tells you which naming convention this question uses; it is not a claim that every geography source uses the same grouping.',
    ],
    examples: [
      ['Mediterranean Sea', 'A named sea, rather than one of the five ocean entries.'],
      ['Gulf of Mexico', 'A gulf name does not match this ocean list.'],
      ['Lake Superior', 'A lake belongs to a different geographic category.'],
    ],
  },
  'music-expanded-12': {
    scope: 'Name an instrument whose strings are plucked. This list includes guitar, harp, mandolin, banjo, ukulele, lute, sitar, koto, balalaika and bouzouki. Submit one instrument name, not a playing technique or a performer.',
    heading: 'Plucked strings and instruments played in other ways',
    paragraphs: [
      'Plucking can use fingers or a pick. The question is not limited to guitars: the accepted set includes the harp and koto as well as instruments with a neck, such as the lute and sitar.',
      'The current entries have no additional stored aliases. Use the displayed instrument spelling; a regional instrument name or a particular model is not automatically mapped to one of these entries. A valid instrument missing from this list is a coverage limit, not proof that it cannot be plucked.',
    ],
    examples: [
      ['Violin', 'A violin can be plucked using pizzicato, but Violin is not an entry in this prepared set.'],
      ['Piano', 'Its normal playing mechanism strikes strings with hammers; Piano is not in this list.'],
      ['Pizzicato', 'This names a playing technique rather than an instrument.'],
    ],
  },
  'practice-3': {
    scope: 'Name one of the six piece types in standard chess: pawn, king, queen, rook, bishop or knight. Piece colour, starting square and the number of pieces on the board do not change the type requested.',
    heading: 'Piece types, moves and notation',
    paragraphs: [
      'Use the full piece name shown below. The bank does not store single-letter chess notation as aliases. A starting position contains several pawns and pairs of some pieces, but this guide lists types rather than counting the pieces on a board.',
      'Pawn is included in this question even though some chess discussions use “piece” in a narrower sense that excludes pawns. Here, the accepted set is explicit. Promotion changes which piece a pawn becomes; it does not add another standard type.',
    ],
    examples: [
      ['Castling', 'A move involving the king and a rook, not a piece type.'],
      ['Checkmate', 'A game-ending position, not a piece.'],
      ['Chancellor', 'A piece used in some chess variants, outside this standard-chess list.'],
    ],
  },
  'practice-11': {
    scope: 'Name a group 18 element from the periodic table. The accepted names are helium, neon, argon, krypton, xenon, radon and oganesson. This question asks for an element name, not its chemical symbol.',
    heading: 'Element names rather than symbols',
    paragraphs: [
      'The current list stores full names and no symbol aliases. Type Helium rather than He, or Neon rather than Ne. A separate question about chemical symbols may accept different input, so do not transfer its rules to this one.',
      'Oganesson is included because this bank follows group 18 membership. Its inclusion does not mean that every listed element has identical physical properties. Likewise, an everyday gas is not necessarily a noble-gas element.',
    ],
    examples: [
      ['Nitrogen', 'An element in group 15 rather than group 18.'],
      ['Oxygen', 'An element in group 16 rather than group 18.'],
      ['Air', 'A mixture, not the name of a group 18 element.'],
    ],
  },
  'sports-expanded-08': {
    scope: 'Name one of the four apparatus events in women’s artistic gymnastics: vault, uneven bars, balance beam or floor exercise. This question is about artistic gymnastics, not rhythmic gymnastics or the men’s apparatus programme.',
    heading: 'Which apparatus names this bank recognizes',
    paragraphs: [
      'Beam is stored as an alias for Balance beam, and Floor is stored as an alias for Floor exercise. Uneven bars and Vault use their displayed names. Use Uneven bars rather than the ambiguous word bars, which is not a stored alias here.',
      'Floor exercise and vault also appear in men’s artistic gymnastics. Their appearance there does not exclude them here. The distinction matters for other apparatus: parallel bars and still rings belong to the men’s programme rather than this four-event set.',
    ],
    examples: [
      ['Parallel bars', 'A men’s artistic gymnastics apparatus, not Uneven bars.'],
      ['Still rings', 'Part of the men’s programme, outside this accepted set.'],
      ['Ribbon', 'Associated with rhythmic gymnastics rather than these artistic events.'],
    ],
  },
  p5: {
    scope: 'Give a type of station, rather than the proper name of a particular station. This bank accepts train station, police station, weather station, tracking station and ghost station.',
    heading: 'The word station has several meanings',
    paragraphs: [
      'A transport stop is only one interpretation. Police, weather and tracking stations fit different uses of the word. Ghost station refers to a disused or otherwise unused railway station; it is not a request to name a fictional place.',
      'Railway station is an explicit alias for Train station. This is a small prepared set, not a complete dictionary of station types. A real type such as radio station or fire station can fit the broad wording while still being absent from the current game list.',
    ],
    examples: [
      ['Radio station', 'A valid station type in ordinary usage, but not currently listed in this bank.'],
      ['Fire station', 'Also a real station type; its absence is a bank limitation.'],
      ['Grand Central Terminal', 'A particular place name rather than a station type; use Train station for the listed transport answer.'],
    ],
  },
};
