export function formatPrice(
  price: number,
  currencyCode: string,
): string | null {
  if (isNaN(price)) return null;

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode || 'USD',
  }).format(price);

  return formattedPrice;
}
