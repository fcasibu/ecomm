export default {
  navigation: {
    title: 'ECOMM',
    actions: {
      search: { open: 'Open Search' },
      wishlist: { open: 'Open Wishlist' },
      cart: { open: 'Open Cart' },
      menu: {
        open: 'Open Menu',
        close: 'Close Menu',
      },
    },
    menu: {
      actions: {
        signIn: 'Sign In',
        joinUs: 'Join Us',
      },
      help: 'Help',
    },
  },
} as const;
