import { defineType, defineField } from 'sanity';

export const fullWidthBanner = defineType({
  name: 'fullWidthBanner',
  title: 'Full Width Banner',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'heading',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'string',
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
      type: 'string',
      options: {
        list: [
          { title: 'Text Left', value: 'left' },
          { title: 'Text Center', value: 'center' },
          { title: 'Text Right', value: 'right' },
        ],
      },
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
