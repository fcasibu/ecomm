# BACKLOG

- [ ] Add asterisk on required input fields
- [ ] Implement merge cart
  - It should be done on post-login
  - Merge the guest cart with the customer cart
  - It should remove the anonymousId from the cart
- [ ] Add destructive variant on error toasts
- [ ] Refactor command inputs that are one shot to close on select
- [ ] Fix input fields with undefined default values in forms
- [ ] Fix issues with errors in `product-delivery-promises-control.tsx`
- [ ] Fix UI inconsistencies in header
- [ ] Footer Newsletter functionality implementation
- [ ] Remove Text component (kinda annoying)
- [ ] Make texts legible (improve text sizing)
- [ ] Implement product tags (e.g., Sustainable Materials)
- [ ] Implement page metadata
- [ ] Fix sheet size in CMS
- [ ] Use localized text on ui components
- [ ] Add more correct validations in sanity
- [ ] Sanity revalidation webhook is off by one (?)
- [ ] Product Best Seller
- [ ] Add Brand model
- [ ] Product/Category seo metadata
- [ ] Implement wishlist
- [ ] Figure out why TBT is >= 50 in PLP
- [ ] Add more sort by options in PLP
- [ ] Update order model with new changes in cart
- [ ] Error handling in cart
- [ ] Add Search Suggestions
- [ ] Add popular categories

- [=] Fix plp content shift (accordions are initially closed even with the default value added)

## Notes

> Fix plp content shift (accordions are closed for some reason)

Issue seems to be the same as https://github.com/radix-ui/primitives/issues/2891 that is from 2024 :facepalm:
and it can also be reproduced in their example.

> Fix issue with form errors not showing up

Issue is about react compiler memoizing the component,
react-hook-form has not yet worked on this since react compiler is still
experimental.

> Inspirations

- zhik.com
- beaverbrooks.com
- nike.com
- clarks.com
