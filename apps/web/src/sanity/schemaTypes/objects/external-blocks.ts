import { defineType, defineField } from 'sanity';

export const categorySpecificNewArrivals = defineType({
  name: 'categorySpecificNewArrivals',
  title: 'Category Specific New Arrivals',
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
      type: 'rootCategorySelect',
    }),
  ],
});
