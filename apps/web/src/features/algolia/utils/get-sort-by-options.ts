export type SortByLabel = 'main' | 'priceAsc' | 'priceDesc';

export function getProductSortByOptions(locale: string) {
  const envName =
    process.env.NODE_ENV === 'production' ? 'production' : 'development';

  return [
    { label: 'main', value: `${envName}_products_${locale}` },
    { label: 'priceAsc', value: `${envName}_products_price_asc_${locale}` },
    { label: 'priceDesc', value: `${envName}_products_price_desc_${locale}` },
  ];
}
