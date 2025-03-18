import { defineType, defineField, defineArrayMember } from 'sanity';

export const headerType = defineType({
  name: 'header',
  title: 'Header',
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
          validation: (Rule) => Rule.max(10),
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
                defineField({ name: 'link', title: 'Link', type: 'link' }),
                defineField({
                  name: 'promotionalBanner',
                  title: 'Promotional Banner',
                  type: 'object',
                  fields: [
                    defineField({
                      type: 'string',
                      name: 'name',
                      title: 'Name',
                    }),
                    defineField({
                      type: 'string',
                      name: 'description',
                      title: 'Description',
                    }),
                    defineField({
                      name: 'image',
                      title: 'Image',
                      type: 'customImage',
                    }),
                    defineField({
                      type: 'link',
                      name: 'cta',
                      title: 'Call to Action',
                    }),
                  ],
                }),
                defineField({
                  name: 'children',
                  title: 'Tier 2 Navigation Items',
                  type: 'array',
                  validation: (Rule) => Rule.max(12),
                  of: [
                    defineArrayMember({
                      type: 'object',
                      title: 'Tier 2 Navigation Item',
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
                        defineField({
                          name: 'children',
                          title: 'Tier 3 Navigation Items',
                          type: 'array',
                          validation: (Rule) => Rule.max(12),
                          of: [
                            defineField({
                              name: 'tier3Child',
                              type: 'object',
                              title: 'Tier 3 Navigation Item',
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
            defineField({
              type: 'object',
              title: 'Category Navigation Item',
              name: 'categoryNavigationItem',
              fields: [
                defineField({
                  type: 'rootCategorySelect',
                  name: 'category',
                  title: 'Category',
                }),
                defineField({
                  name: 'promotionalBanner',
                  title: 'Promotional Banner',
                  type: 'object',
                  fields: [
                    defineField({
                      type: 'string',
                      name: 'name',
                      title: 'Name',
                    }),
                    defineField({
                      type: 'string',
                      name: 'description',
                      title: 'Description',
                    }),
                    defineField({
                      name: 'image',
                      title: 'Image',
                      type: 'customImage',
                    }),
                    defineField({
                      type: 'link',
                      name: 'cta',
                      title: 'Call to Action',
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
