import 'server-only';
import { imageController } from '@ecomm/services/registry';
import { executeOperation } from '@ecomm/lib/execute-operation';
import { unstable_cacheTag as cacheTag } from 'next/cache';

export async function getImages(cursor: string) {
  'use cache';

  cacheTag('images');

  return await executeOperation(() => imageController().getImages(cursor));
}
