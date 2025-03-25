export default {
  breadcrumb: {
    home: {
      label: 'Home',
    },
  },
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
  productDetail: {
    image: {
      thumbnails: {
        actions: { select: 'Select Product Image {index}' },
        alt: 'Thumbnail Product Image {index}',
      },
    },
    variantSelection: {
      title: 'Color',
      alt: 'Select Variant SKU {sku}',
    },
    sizeSelection: {
      title: 'Size',
      alt: 'Size {value}',
    },
    quantitySelection: {
      title: 'Quantity',
      action: {
        increase: 'Increase quantity',
        decrease: 'Decrease quantity',
      },
    },
    addToCart: {
      title: 'Add to Cart',
      loading: 'Adding...',
    },
    wishlist: {
      title: 'Wishlist',
    },
    share: {
      title: 'Share',
      copied: 'Copied!',
    },
    guarantees: {
      freeShipping: {
        title: 'Free Shipping',
        subtitle: 'On orders over {value}',
      },
      easyReturns: {
        title: 'Easy Returns',
        subtitleL: '30-day return policy',
      },
      secureCheckout: {
        title: 'Secure Checkout',
        subtitle: 'Protected payments',
      },
    },
    tabs: {
      description: 'Description',
      features: 'Features',
    },
    errors: {
      size: 'Please select a size',
    },
  },
  recentlyViewedProducts: {
    title: 'Recently Viewed',
  },
  categoryProductNewArrivals: {
    title: 'New Arrivals',
  },
  productListing: {
    filters: {
      title: 'Filters',
      appliedFilters: {
        title: 'Applied Filters',
        actions: {
          remove: 'Remove {value}',
        },
      },
      actions: {
        clearAll: 'Clear All',
      },
      labels: {
        price: 'Price',
        color: 'Color',
        width: 'Width',
      },
      checkbox: {
        action: {
          toggle: {
            more: 'Show more',
            less: 'Show less',
          },
        },
      },
    },
    showing:
      'Showing <bold1>{count}</bold1> of <bold2>{total}</bold2> products',
    actions: {
      gridLayout: {
        two: '2 Columns',
        three: '3 Columns',
      },
    },
    productCard: {
      variants: {
        more: '+ {count} more',
      },
      wishlist: {
        actions: {
          add: 'Add to Wishlist',
          remove: 'Remove from Wishlist',
        },
      },
    },
  },
} as const;
