import { type SchemaTypeDefinition } from 'sanity';
import { headerType } from './header-type';
import { image, link, rootCategorySelect } from './objects';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    headerType,

    // reusable objects
    link,
    image,
    rootCategorySelect,
  ],
};
