// Information about the characters that inspire the products.
// The keys must match the "character" field in products.js exactly.
// Spoiler-light summaries written for this project. Verify against official sources before presenting.
export const characters = {
  'Yuji Itadori': {
    role: 'Student sorcerer',
    about: 'A cheerful, athletic high-school student who is far stronger than he looks. After a dangerous accident he joins Tokyo Jujutsu High to learn how to fight curses.',
    look: ['Dark uniform jacket with a hood', 'Red lining against deep navy', 'Easy, sporty fit'],
    traits: ['Loyal', 'Warm-hearted', 'Hard to knock down'],
  },
  'Satoru Gojo': {
    role: 'Teacher at Tokyo Jujutsu High',
    about: 'A confident, playful teacher and one of the strongest sorcerers in the series. He guides his students while keeping watch for bigger threats.',
    look: ['Black high-collar uniform', 'Blindfold or dark round glasses', 'Clean, all-black styling'],
    traits: ['Confident', 'Playful', 'Protective of his students'],
  },
  'Sung Jin-Woo': {
    role: 'Hunter',
    about: 'Known as one of the weakest hunters, he survives a near-fatal dungeon and gains the ability to level up like a game character. His story is about going from underdog to someone nobody saw coming.',
    look: ['Mostly black, simple layers', 'Long dark coat silhouette', 'A cool violet glow as the accent'],
    traits: ['Quiet', 'Determined', 'Protective of his family'],
  },
  'Thomas Shelby': {
    role: 'Head of the Shelby family',
    about: 'A war veteran and sharp businessman who leads his family and wants to take it beyond street crime. Played by Cillian Murphy.',
    look: ['Long wool greatcoat', 'Flat cap and tailored three-piece suits', 'Muted greys, browns and navy'],
    traits: ['Calculating', 'Reserved', 'Ambitious'],
  },
  'Arthur Shelby': {
    role: 'Eldest Shelby brother',
    about: "Thomas's older brother: loud, volatile and fiercely loyal to the family. Played by Paul Anderson.",
    look: ['Flat cap', 'Waistcoat and shirt sleeves', 'Rougher, heavier tailoring than Thomas'],
    traits: ['Loyal', 'Impulsive', 'Larger than life'],
  },
  'Walter White': {
    role: 'Chemistry teacher',
    about: 'A quiet high-school chemistry teacher whose life changes after a health scare, pushing him toward choices he never imagined. Played by Bryan Cranston.',
    look: ['Plain khaki and olive work shirts', 'Round glasses, and a black hat later in the story', 'Everyday, understated colours'],
    traits: ['Intelligent', 'Proud', 'Secretive'],
  },
  'Neo': {
    role: 'Hacker',
    about: 'A software worker who leads a double life online, then learns his reality is not what it seems. Played by Keanu Reeves.',
    look: ['Long black coat', 'Small dark sunglasses', 'Black layers and high collars'],
    traits: ['Curious', 'Calm under pressure', 'Reluctant hero'],
  },
}

export const getCharacter = (name) => characters[name]
