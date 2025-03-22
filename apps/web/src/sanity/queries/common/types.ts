import type { Heading as HeadingType } from '@/sanity.types';

export interface Link {
  title: string;
  url: string;
  newTab: boolean;
}

export interface CustomImage {
  alt: string;
  url: string;
}

export interface Heading {
  value: string;
  type: NonNullable<HeadingType['type']>;
}
