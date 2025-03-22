import { RootCategorySelect } from '@/sanity/components/root-category-select';
import { ImageGalleryInput } from '@/sanity/components/image-gallery-input';
import { defineType, defineField } from 'sanity';

export const rootCategorySelect = defineType({
  name: 'rootCategorySelect',
  title: 'Root Category',
  type: 'object',
  fields: [
    defineField({
      name: 'category',
      title: 'Category',
      type: 'object',
      fields: [
        defineField({
          name: 'id',
          title: 'Category ID',
          type: 'string',
        }),
        defineField({
          name: 'name',
          title: 'Category Name',
          type: 'string',
          readOnly: true,
        }),
      ],
      components: {
        input: RootCategorySelect,
      },
    }),
  ],
});

export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'url',
      title: 'URL',
      type: 'string',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true;

          const isExternal = /^https?:\/\//.test(value);
          const isInternal = value.startsWith('/');

          return isExternal || isInternal
            ? true
            : 'Must be a valid external URL or an internal link (starting with "/")';
        }),
    }),
    defineField({
      name: 'newTab',
      title: 'Open in New Tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});

export const image = defineType({
  name: 'customImage',
  title: 'Image',
  type: 'object',
  fields: [
    defineField({
      name: 'alt',
      title: 'Image Alt Text',
      type: 'string',
    }),
    defineField({
      name: 'image',
      title: 'Image URL',
      type: 'string',
      components: {
        input: ImageGalleryInput,
      },
    }),
  ],
});

export const heading = defineType({
  name: 'heading',
  title: 'Heading',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'color',
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'H1', value: 'h1' },
          { title: 'H2', value: 'h2' },
          { title: 'H3', value: 'h3' },
          { title: 'H4', value: 'h4' },
          { title: 'H5', value: 'h5' },
          { title: 'H6', value: 'h6' },
        ],
      },
    }),
  ],
});

export const textAlignment = defineField({
  name: 'textAlignment',
  title: 'Text Alignment',
  type: 'string',
  options: {
    list: [
      { title: 'Left', value: 'left' },
      { title: 'Center', value: 'center' },
      { title: 'Right', value: 'right' },
    ],
    layout: 'radio',
  },
});

export const textContent = defineType({
  name: 'textContent',
  title: 'Text',
  type: 'object',
  fields: [
    defineField({
      name: 'value',
      title: 'Text Content',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'textColor',
      title: 'Text Color',
      type: 'color',
    }),
  ],
});
