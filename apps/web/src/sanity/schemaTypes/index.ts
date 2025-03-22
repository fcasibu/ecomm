import { type SchemaTypeDefinition } from 'sanity';
import { headerType } from './header-type';
import {
  heading,
  image,
  link,
  rootCategorySelect,
  textAlignment,
  textContent,
} from './objects';
import { footerType } from './footer-type';
import { contentPageType } from './content-page-type';
import { fullScreenBanner } from './objects/banners';

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    headerType,
    footerType,
    contentPageType,

    // reusable objects
    link,
    image,
    rootCategorySelect,
    fullScreenBanner,
    heading,
    textAlignment,
    textContent,
  ],
};
