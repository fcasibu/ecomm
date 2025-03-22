import { slugify } from '@ecomm/lib/transformers';

export const link = {
  category: {
    single: (slug: string) => `/categories/${slug}`.toLowerCase(),
  },
  product: {
    single: (name: string, sku: string) =>
      `/products/${slugify(name)}/${sku}`.toLowerCase(),
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
