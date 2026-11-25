// Each collection has its own colours, facts about its source, and "looks":
// the kinds of outfits characters wear in that show.
export const collections = [
  {
    id: 'jujutsu-kaisen', name: 'Jujutsu Kaisen', kind: 'Anime',
    accent: '#d12b34', panel: '#2b0d12',
    tagline: 'Crimson, cursed energy and street-ready layers.',
    source: {
      medium: 'Manga and anime series', creator: 'Gege Akutami',
      producer: 'MAPPA (anime studio)', years: 'Manga 2018 to 2024, anime from 2020',
      premise: "Curses are monsters born from people's fear and anger. Jujutsu sorcerers are the few who can see and fight them.",
    },
    looks: [
      { who: 'Yuji Itadori', outfit: 'A dark school jacket with a high collar and a hood lined in red.' },
      { who: 'Satoru Gojo', outfit: 'An all-black teacher uniform, finished with a blindfold or dark glasses.' },
      { who: 'Student sorcerers', outfit: 'Matching dark uniforms with clean lines and a slightly military feel.' },
    ],
  },
  {
    id: 'solo-leveling', name: 'Solo Leveling', kind: 'Anime',
    accent: '#8a5cf0', panel: '#1c1233',
    tagline: 'Shadow tones for the quiet one who levels up.',
    source: {
      medium: 'Web novel, webtoon and anime series', creator: 'Chugong (novel), DUBU (webtoon art)',
      producer: 'A-1 Pictures (anime studio)', years: 'Novel 2016, anime from 2024',
      premise: 'Portals to dungeons have appeared, and people with powers called hunters fight what comes out. One of the weakest hunters gets a strange chance to grow stronger without limit.',
    },
    looks: [
      { who: 'Sung Jin-Woo (early)', outfit: 'Plain everyday clothes: dark hoodies, simple jackets and sneakers.' },
      { who: 'Sung Jin-Woo (later)', outfit: 'Head-to-toe black, including a long dark coat.' },
      { who: 'Hunters', outfit: 'Practical gear with light armour pieces, made for dungeon work.' },
    ],
  },
  {
    id: 'peaky-blinders', name: 'Peaky Blinders', kind: 'Series',
    accent: '#b8935a', panel: '#2a2118',
    tagline: 'Wool, tweed and restrained 1920s tailoring.',
    source: {
      medium: 'TV drama series', creator: 'Steven Knight', producer: 'BBC', years: '2013 to 2022',
      premise: 'A crime family in Birmingham, England, tries to rise in the years after the First World War.',
    },
    looks: [
      { who: 'Thomas Shelby', outfit: 'A long wool greatcoat over a tailored three-piece suit and a flat cap.' },
      { who: 'Arthur Shelby', outfit: 'Waistcoat, shirt sleeves and braces, with a flat cap.' },
      { who: 'The Shelby gang', outfit: 'Tweed, wool and leather boots in muted greys and browns.' },
    ],
  },
  {
    id: 'breaking-bad', name: 'Breaking Bad', kind: 'Series',
    accent: '#8ea63a', panel: '#1e2410',
    tagline: 'Desert workwear built for long days in the lab.',
    source: {
      medium: 'TV drama series', creator: 'Vince Gilligan', producer: 'AMC', years: '2008 to 2013',
      premise: 'A high-school chemistry teacher in Albuquerque, New Mexico, gets terrible news and makes choices that pull him into the criminal world.',
    },
    looks: [
      { who: 'Walter White (early)', outfit: 'Plain khaki trousers, pale shirts and a beige jacket.' },
      { who: 'Walter White (later)', outfit: 'A darker look with a green jacket and a black brimmed hat.' },
      { who: 'Jesse Pinkman', outfit: 'Baggy hoodies and oversized streetwear.' },
    ],
  },
  {
    id: 'the-matrix', name: 'The Matrix', kind: 'Movie',
    accent: '#22c55e', panel: '#06190d',
    tagline: 'Long black coats and green-tinted code.',
    source: {
      medium: 'Film', creator: 'The Wachowskis', producer: 'Warner Bros.', years: '1999, followed by sequels',
      premise: 'A hacker discovers that the world he lives in is a simulation and joins a rebellion against the machines that run it.',
    },
    looks: [
      { who: 'Neo', outfit: 'A long black coat, high collars and small dark sunglasses.' },
      { who: 'Trinity', outfit: 'Sleek black leather and a fitted, all-black silhouette.' },
      { who: 'Morpheus', outfit: 'A long leather coat and round dark glasses.' },
    ],
  },
]

export const getCollection = (id) => collections.find((c) => c.id === id)
