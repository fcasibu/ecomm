import type { ExtractType } from '@/types';
import type { CustomImage, Link } from '../common/types';
import type { ContentPage } from '@/sanity.types';

export type ContentAlignment = 'left' | 'center' | 'right';
export type ContentPosition =
  | 'top-left'
  | 'middle-left'
  | 'bottom-left'
  | 'top-center'
  | 'center'
  | 'bottom-center'
  | 'top-right'
  | 'middle-right'
  | 'bottom-right';

export interface ContentPageDTO {
  slug: string;
  seoMetadata: SEOMetadata;
  content: Content[];
}

export interface SEOMetadata {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  indexing: string;
}

export type Content = FullWidthBanner;
export type ContentKeys = ExtractType<ContentPage, 'blocks[number]._type'>;

export interface FullWidthBanner {
  title: string;
  description: string;
  cta: Link;
  image: CustomImage;
  contentAlignment: ContentAlignment;
  contentPosition: ContentPosition;
}
