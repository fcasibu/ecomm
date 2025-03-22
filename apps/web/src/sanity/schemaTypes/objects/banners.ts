import { defineType, defineField } from 'sanity';

export const fullScreenBanner = defineType({
  name: 'fullScreenBanner',
  title: 'Full Screen Banner',
  type: 'object',
  preview: {
    select: {
      title: 'title.title',
    },
  },
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'heading',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'textContent',
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'link',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'customImage',
    }),
    defineField({
      name: 'contentAlignment',
      title: 'Content Alignment',
      type: 'textAlignment',
    }),
    defineField({
      name: 'contentPosition',
      title: 'Content Position',
      type: 'string',
      options: {
        list: [
          { title: 'Top Left', value: 'top-left' },
          { title: 'Middle Left', value: 'middle-left' },
          { title: 'Bottom Left', value: 'bottom-left' },

          { title: 'Top Center', value: 'top-center' },
          { title: 'Center', value: 'center' },
          { title: 'Bottom Center', value: 'bottom-center' },

          { title: 'Top Right', value: 'top-right' },
          { title: 'Middle Right', value: 'middle-right' },
          { title: 'Bottom Right', value: 'bottom-right' },
        ],
      },
    }),
  ],
});
