export const ATTRIBUTES_FOR_FACETING = {
  range: [
    {
      attribute: 'price.value',
      label: 'price',
      type: 'range',
    },
  ],
  checkbox: [
    {
      attribute: 'attributes.width',
      label: 'width',
      type: 'checkbox',
    },

    {
      attribute: 'attributes.color',
      label: 'color',
      type: 'checkbox',
    },
  ],
} as const;

export type Attribute =
  (typeof ATTRIBUTES_FOR_FACETING)[keyof typeof ATTRIBUTES_FOR_FACETING][number];
