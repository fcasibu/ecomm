import { clientEnv } from '@/env/client';
import createImageUrlBuilder from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url/lib/types/types';

const builder = createImageUrlBuilder({
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
});

export const urlFor = (source: SanityImageSource) => {
  return builder.image(source);
};
