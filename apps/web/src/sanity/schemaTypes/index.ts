import { type SchemaTypeDefinition } from 'sanity';
import { headerType } from './header-type';
import {
  heading,
  image,
  link,
  nonRootCategorySelect,
  rootCategorySelect,
  textAlignment,
  textContent,
} from './objects';
import { footerType } from './footer-type';
import { contentPageType } from './content-page-type';
import { fullScreenBanner, heroBanner, thinBanner } from './objects/banners';
import { featureBlockType } from './objects/blocks';
import {
  categoryProductNewArrivals,
  recentlyViewedProducts,
} from './objects/external-blocks';

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
    nonRootCategorySelect,
    fullScreenBanner,
    thinBanner,
    heroBanner,
    heading,
    textAlignment,
    textContent,
    featureBlockType,

    // exterrnal blocks
    categoryProductNewArrivals,
    recentlyViewedProducts,
  ],
};
