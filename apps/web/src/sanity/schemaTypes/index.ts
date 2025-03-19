import { type SchemaTypeDefinition } from 'sanity';
import { headerType } from './header-type';
import { image, link, rootCategorySelect } from './objects';
import { footerType } from './footer-type';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    headerType,
    footerType,

    // reusable objects
    link,
    image,
    rootCategorySelect,
  ],
};
