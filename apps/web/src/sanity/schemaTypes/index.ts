import { type SchemaTypeDefinition } from 'sanity';
import { postType } from './post-type';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [postType],
};
