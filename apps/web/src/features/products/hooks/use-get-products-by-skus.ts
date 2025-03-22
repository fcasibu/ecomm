import { createQueryString } from '@ecomm/lib/create-query-string';
import type { Result } from '@ecomm/lib/execute-operation';
import { formatPrice } from '@ecomm/lib/format-price';
import type { ProductDTO } from '@ecomm/services/products/product-dto';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGetProductsBySkus(skus: string[]) {
  const { data, error, isLoading } = useSWR<Result<ProductDTO[]>>(
    `/api/recently-viewed-products${createQueryString('', { skus: skus.join(',') })}`,
    fetcher,
  );

  const result = data?.success
    ? { success: true, data: data.data.map(transformProduct) }
    : { succes: false, error: data?.error };

  return { result, error, isLoading };
}

function transformProduct(product: ProductDTO) {
  const variant = product.variants[0];

  return {
    id: product.id,
    name: product.name,
    sku: product.sku,
    price: formatPrice(
      variant?.price.value ?? 0,
      variant?.price.currency ?? '',
    ),
    image: variant?.images?.[0],
  };
}
