export const site = {
  name: 'Klock Holding Co.',
  shortName: 'KHC',
  author: 'Klock Holding Co.',
  locale: 'en_US',
  description:
    'Customizable 3D-printed competition shooting gear, open-source designs, how-to videos, and SplitShot software from Klock Holding Co.',
  url: 'https://www.klockholdingco.com',
  defaultImage: '/favicon.png',
  defaultImageAlt: 'Klock Holding Co. logo',
  email: null,
  navigation: [
    { href: '/', label: 'Home' },
    { href: '/gear/', label: 'Customer Builds' },
    { href: '/about/', label: 'About Me' },
  ],
  social: {
    pewcentric: 'https://www.pewcentric.com/klockholdingco',
    printables: 'https://www.printables.com/@KlockHoldingCo',
    youtube: 'https://www.youtube.com/@klockholdingco',
    instagram: 'https://www.instagram.com/klockholdingco/',
    facebook: 'https://www.facebook.com/profile.php?id=61584035131013',
    github: 'https://github.com/jklock',
    splitshot: 'https://github.com/jklock/splitshot',
  },
} as const;
