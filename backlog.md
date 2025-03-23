# BACKLOG

- [ ] Implement GTM in web
- [ ] Add asterisk on required input fields
- [ ] Implement merge cart
  - It should be done on post-login
  - Merge the guest cart with the customer cart
  - It should remove the anonymousId from the cart
- [ ] Add destructive variant on error toasts
- [ ] Refactor command inputs that are one shot to close on select
- [ ] Fix input fields with undefined default values in forms
- [ ] Fix issues with errors in `product-delivery-promises-control.tsx`
- [ ] See if we can programatically prefetch images
- [ ] Fix UI inconsistencies in header
- [ ] Footer Newsletter functionality implementation
- [ ] Remove Text component (kinda annoying)
- [ ] Make texts legible (improve text sizing)
- [ ] Implement product tags (e.g., Sustainable Materials)
- [ ] Implement page metadata
- [ ] Fix sheet size in CMS
- [ ] Use localized text on ui components
- [ ] Add more correct validations in sanity
- [ ] Thin Banners
- [ ] Full Width Banners
- [ ] Hero Banner
- [ ] Feature Section
- [ ] Sanity revalidation webhook is off by one (?) 

## Notes

> Fix issue with form errors not showing up

Issue is about react compiler memoizing the component,
react-hook-form has not yet worked on this since react compiler is still
experimental.

> Inspirations

- zhik.com
- beaverbrooks.com
- nike.com
- clarks.com
