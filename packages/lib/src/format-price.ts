export function formatPrice(
  price: number,
  currencyCode: string,
  opts?: Intl.NumberFormatOptions,
): string | null {
  if (isNaN(price)) return null;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
    ...opts,
  }).format(price);

  return formattedPrice;
}
