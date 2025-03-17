'use server';

import { executeOperation } from '@ecomm/lib/execute-operation';
import { imageController } from '@ecomm/services/registry';
import { revalidateTag } from 'next/cache';

export const uploadImage = async (file: string, identifier: string) => {
  const result = await executeOperation(() =>
    imageController().upload(file, identifier),
  );

  if (result.success) {
    revalidateTag('images');
  }

  return result;
};
