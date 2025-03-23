import { defineType, defineField } from 'sanity';

export const contentPageType = defineType({
  name: 'contentPage',
  title: 'Content Page',
  type: 'document',
  preview: {
    select: {
      title: 'title',
    },
  },
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'string',
    }),
    defineField({
      name: 'breadcrumb',
      title: 'Breadcrumb',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'link' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'seoMetadata',
      title: 'SEO Metadata',
      type: 'object',
      fields: [
        defineField({
          name: 'title',
          title: 'SEO Metadata Title',
          type: 'string',
        }),
        defineField({
          name: 'description',
          title: 'SEO Metadata Description',
          type: 'string',
        }),
        defineField({
          name: 'ogTitle',
          title: 'Opengraph Title',
          type: 'string',
        }),
        defineField({
          name: 'ogDescription',
          title: 'Opengraph Description',
          type: 'string',
        }),
        defineField({
          name: 'twitterTitle',
          title: 'Twitter Title',
          type: 'string',
        }),
        defineField({
          name: 'twitterDescription',
          title: 'Twitter Description',
          type: 'string',
        }),
        defineField({
          name: 'indexing',
          title: 'Indexing',
          type: 'string',
          options: {
            list: [
              {
                title: 'index, follow: Full Page Indexing and Link Following',
                value: 'index, follow',
              },
              {
                title: 'noindex, nofollow: Hidden from Search Engines',
                value: 'noindex, nofollow',
              },
              {
                title: 'index, nofollow: Page Indexing Without Link Following',
                value: 'index, nofollow',
              },
              {
                title: 'noindex, follow: Link Following Without Page Indexing',
                value: 'noindex, follow',
              },
            ],
          },
        }),
      ],
    }),
    defineField({
      name: 'blocks',
      title: 'Blocks',
      type: 'array',
      validation: (Rule) => Rule.min(1).max(12),
      of: [{ type: 'fullScreenBanner' }],
    }),
  ],
});
