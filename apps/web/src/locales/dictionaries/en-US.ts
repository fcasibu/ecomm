export default {
  header: {
    menu: {
      actions: {
        signIn: 'Sign In',
        joinUs: 'Join Us',
      },
      help: 'Help',
    },
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
    },
  },
  footer: {
    contactUs: {
      title: 'Contact Us',
      location: '123 Performance Street, New York, NY 10001',
      phone: '+1 (800) 123-4567',
      email: 'support@ecomm.com',
    },
    followUs: {
      title: 'Follow Us',
      facebook: 'Go to our Facebook page',
      instagram: 'Go to our Instagram page',
      youtube: 'Go to our Youtube page',
    },
    language: {
      title: 'Language',
    },
    newsletter: {
      title: 'Join Our Newsletter',
      description:
        'Sign up for our newsletter to receive exclusive offers and early access to new products',
      policy:
        'By subscribing, you agree to our <link>Privacy Policy</link> and consent to receive marketing emails.',
      form: {
        email: { placeholder: 'Your email address' },
        actions: {
          subscribe: 'Subscribe',
        },
      },
      success: {
        title: "You're all set!",
        description:
          "You're now subscribed to our newsletter. Keep an eye on your inbox for exclusive offers, product launches, and special updates.",
        additionalInfo:
          "If you don't see our email, check your spam folder or add us to your contacts to stay in the loop!",
        actions: {
          unsubscribe: 'Unsubscribe',
          explore: 'Explore Products',
        },
      },
    },
    meta: {
      title: 'ECOMM',
      links: {
        tos: 'Terms of Service',
        privacy: 'Privacy Policy',
        accessibility: 'Accessibility',
      },
      notice: '© {year} ECOMM. All rights reserved.',
    },
  },
} as const;
