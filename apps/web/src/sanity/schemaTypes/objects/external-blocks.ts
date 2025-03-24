import { defineType, defineField } from 'sanity';

export const categoryProductNewArrivals = defineType({
  name: 'categoryProductNewArrivals',
  title: 'Category Product New Arrivals',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'nonRootCategorySelect',
    }),
  ],
});

export const recentlyViewedProducts = defineType({
  name: 'recentlyViewedProducts',
  title: 'Recently Viewed Products',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
  ],
});
