import type {
  ContentAlignment,
  ContentPosition,
} from '@/sanity/queries/content-page/types';

export function getAlignmentClass(contentAlignment: ContentAlignment) {
  switch (contentAlignment) {
    case 'left':
      return 'text-left items-start';
    case 'center':
      return 'text-center items-center';
    case 'right':
      return 'text-right items-end';
    default:
      throw new Error(`Unknwon content alignment: ${contentAlignment}`);
  }
}

export function getPositionClass(contentPosition: ContentPosition) {
  switch (contentPosition) {
    case 'top-left':
      return 'top-0 left-0';
    case 'middle-left':
      return 'top-1/2 left-0 -translate-y-1/2';
    case 'bottom-left':
      return 'bottom-0 left-0';
    case 'top-center':
      return 'top-0 left-1/2 -translate-x-1/2';
    case 'center':
      return 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2';
    case 'bottom-center':
      return 'bottom-0 left-1/2 -translate-x-1/2';
    case 'top-right':
      return 'top-0 right-0';
    case 'middle-right':
      return 'right-0 top-1/2 -translate-y-1/2';
    case 'bottom-right':
      return 'bottom-0 right-0';
    default:
      throw new Error(`Unknwon content alignment: ${contentPosition}`);
  }
}
