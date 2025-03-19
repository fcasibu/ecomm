import { defineType, defineField, defineArrayMember } from 'sanity';

export const footerType = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'document',
  fields: [
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
    defineField({
      name: 'navigation',
      title: 'Navigation',
      type: 'object',
      fields: [
        defineField({
          name: 'navigationItems',
          title: 'Navigation Items',
          type: 'array',
          validation: (Rule) => Rule.max(6),
          of: [
            defineField({
              name: 'navigationItem',
              type: 'object',
              title: 'Navigation Item',
              fields: [
                defineField({
                  type: 'string',
                  name: 'title',
                  title: 'Title',
                }),
                defineField({
                  name: 'children',
                  title: 'Children',
                  type: 'array',
                  validation: (Rule) => Rule.max(10),
                  of: [
                    defineArrayMember({
                      type: 'object',
                      title: 'Item',
                      fields: [
                        defineField({
                          type: 'string',
                          name: 'title',
                          title: 'Title',
                        }),
                        defineField({
                          name: 'link',
                          title: 'Link',
                          type: 'link',
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
});
