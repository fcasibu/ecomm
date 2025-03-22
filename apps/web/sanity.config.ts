'use client';

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import { visionTool } from '@sanity/vision';
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { schema } from './src/sanity/schemaTypes';
import { structure } from './src/sanity/structure';
import { clientEnv } from '@/env/client';
import { documentInternationalization } from '@sanity/document-internationalization';
import { AVAILABLE_LOCALES } from '@ecomm/lib/locale-helper';
import { colorInput } from '@sanity/color-input';

export default defineConfig({
  basePath: '/en-US/studio',
  projectId: clientEnv.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: clientEnv.NEXT_PUBLIC_SANITY_DATASET,
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: clientEnv.NEXT_PUBLIC_SANITY_API_VERSION }),
    colorInput(),
    documentInternationalization({
      supportedLanguages: AVAILABLE_LOCALES.map((locale) => ({
        id: locale,
        name: locale.replace('-', '_'),
        title: locale.toUpperCase(),
      })),
      schemaTypes: ['header', 'footer', 'contentPage'],
    }),
  ],
});
