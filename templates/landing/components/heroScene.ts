// Startsidans hero-scen: vägen hem, med himlen förlängd uppåt till 16:9 så
// budskapet får plats i himlen ovanför huset. Delas av heron och sidans förladdning.
export const HERO_SCENE = {
  src: '/images/brand/hero-vagen-hem-1440.webp',
  srcSet: '/images/brand/hero-vagen-hem-1440.webp 1440w, /images/brand/hero-vagen-hem-2160.webp 2160w, /images/brand/hero-vagen-hem-3168.webp 3168w',
  width: 3168,
  height: 1782,
  // Bildens övre kant, så himlen fortsätter sömlöst från textytan ner i scenen.
  sky: '#E5F1FA',
} as const
