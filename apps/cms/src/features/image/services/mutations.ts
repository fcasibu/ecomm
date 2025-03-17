'use server';

import { executeOperation } from '@ecomm/lib/execute-operation';
import { imageController } from '@ecomm/services/registry';

export const uploadImage = async (file: string, identifier: string) => {
  const result = await executeOperation(() =>
    imageController().upload(file, identifier),
  );
  return result;
};
