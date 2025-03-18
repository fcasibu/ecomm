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
} as const;
