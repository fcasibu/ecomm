export const link = {
  category: {
    single: (slug: string) => `/categories/${slug}`,
  },
  auth: {
    signIn: '/sign-in',
    joinUs: '/create-account',
  },
  help: '/help',
  home: '/',
  socials: {
    facebook: 'https://facebook.com/ecomm',
    instagram: 'https://instagram.com/ecomm',
    youtube: 'https://youtube.com/@ecomm',
  },
  privacyPolicy: '/privacy',
  tos: '/terms-of-service',
  accessibility: '/accessibility',
} as const;
