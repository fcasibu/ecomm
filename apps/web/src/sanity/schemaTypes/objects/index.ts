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
