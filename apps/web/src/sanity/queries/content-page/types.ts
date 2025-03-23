import type { ExtractType } from '@/types';
import type { CustomImage, Heading, Link, TextContent } from '../common/types';
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
  breadcrumb: BreadcrumbItem[];
  seoMetadata: SEOMetadata;
  blocks: Block[];
}

export interface BreadcrumbItem {
  link: Link;
  label: string;
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

export type Block = FullScreenBanner | ThinBanner;
export type BlockKeys = ExtractType<ContentPage, 'blocks[number]._type'>;

export interface FullScreenBanner {
  key: string;
  type: BlockKeys;
  title: Heading;
  description: TextContent;
  tag: TextContent;
  cta: Link;
  image: CustomImage;
  contentAlignment: ContentAlignment;
  contentPosition: ContentPosition;
}

export interface ThinBanner {
  key: string;
  type: BlockKeys;
  title: Heading;
  description: TextContent;
  tag: TextContent;
  cta: Link;
  image: CustomImage;
  contentAlignment: ContentAlignment;
}
