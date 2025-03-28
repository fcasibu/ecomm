export default {
  breadcrumb: {
    home: {
      label: 'Home',
    },
  },
  search: {
    actions: {
      backToHome: 'Back to Home',
    },
    results: {
      title: 'Search Results for: "{query}"',
    },
    noResult: {
      title: 'No results found',
      description:
        'Your query was empty or there are no results matching your query. Try checking the spelling or using different keywords.',
      suggestions: {
        title: 'Search suggestions',
        suggestionOne: 'Check for typos or spelling errors',
        suggestionTwo: ' Try more general keywords',
        suggestionThree: 'Try searching by product name or category slug',
      },
    },
  },
  autocomplete: {
    actions: {
      viewAll: 'View All',
    },
    recentSearches: {
      title: 'Recent searches',
      empty: 'No recent searches',
      actions: {
        clear: 'Clear',
      },
    },
    results: 'Results for "{query}"',
    noResult: {
      title: 'No results found for "{query}"',
      description:
        'We could not find any products matching your search. Try checking the spelling or using different keywords.',
      suggestions: {
        title: 'Search suggestions',
        suggestionOne: 'Check for typos or spelling errors',
        suggestionTwo: ' Try more general keywords',
        suggestionThree: 'Try searching by product name or category slug',
      },
    },
  },
  searchMenu: {
    placeholder: 'Search for products',
    actions: {
      close: 'Close',
    },
  },
  cart: {
    'title#zero': 'Shopping Cart',
    'title#one': 'Shopping Cart ({count} item)',
    'title#other': 'Shopping Cart ({count} items)',
    actions: {
      continueShopping: 'Continue Shopping',
    },
    empty: {
      title: 'Your cart is empty',
      description:
        "Looks like you haven't added anything to your cart yet. Browse our collection to find something you'll love.",
      actions: {
        continueShopping: 'Continue Shopping',
      },
    },
    orderSummary: {
      title: 'Order Summary',
      subtotal: 'Subtotal',
      total: 'Total',
      shipping: 'Shipping',
      free: 'Free',
      freeShippingEligibility:
        'Your order qualifies for free shipping on eligible items',
      cartInfo: {
        freeShipping: 'Free shipping on orders over {price}',
        freeReturns: 'Free 30-day return policy on all orders',
        securePayment: 'Secure payment',
      },
      actions: {
        checkout: 'Checkout',
      },
    },
    item: {
      size: 'Size: {value}',
      actions: {
        remove: 'Remove {name} from cart',
        quantity: {
          decrease: 'Decrease quantity',
          increase: 'Increase quantity',
        },
      },
    },
    shippingMethod: {
      title: 'Shipping Method',
      free: 'Free',
      STANDARD: 'Standard Delivery ({min}, {max} days)',
      EXPRESS: 'Express Delivery ({min}, {max} days)',
      NEXT_DAY: 'Next Day Delivery',
      estimatedDelivery: 'Estimated delivery: {date}',
      notEligibleForFreeShipping: 'Not eligible for free shipping',
      addMoreForFreeShipping: 'Add <bold>{price}</bold> more for free shipping',
    },
    sheet: {
      title: 'Your Cart ({value})',
      empty: {
        title: 'Your cart is empty',
        description:
          "Looks like you haven't added any products to your cart yet.",
      },
      actions: {
        close: 'Close Cart',
        continueShopping: 'Continue Shopping',
        checkout: 'Checkout',
      },
      total: 'Total',
    },
  },
  header: {
    menu: {
      actions: {
        signIn: 'Sign In',
        myAccount: 'My Account',
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
    sortBy: {
      main: 'Relevance',
      priceAsc: 'Price: Low to High',
      priceDesc: 'Price: High to Low',
    },
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
    noResult: {
      title: 'No products match your filters',
      description:
        'We could not find any products in this category. Please try browsing a different category or check back later.',
      descriptionWithFilters:
        'We could not find any products that match your current filter selections. Try adjusting or clearing your filters to see more products.',
      suggestions: {
        title: 'Filter suggestions',
        suggestionOne: 'Clear your filters and try again',
        suggestionTwo: 'Try selecting fewer filters at once',
        suggestionThree: 'Expand your price range',
      },
    },
    showing:
      'Showing <bold1>{count}</bold1> of <bold2>{total}</bold2> products',
    actions: {
      gridLayout: {
        one: '1 Column',
        two: '2 Columns',
        three: '3 Columns',
      },
    },
    productCard: {
      variants: {
        more: '+ {count} more',
      },
      wishlist: {
        title: 'Wishlist',
        actions: {
          add: 'Add to Wishlist',
          remove: 'Remove from Wishlist',
        },
      },
    },
  },
} as const;
