const A_CHAR_CODE = 65;

export function getFlagOfLocale(locale: string): string {
  const countryCode = locale.split('-')?.[1]?.toUpperCase();

  if (!countryCode) return '';

  return countryCode
    .toUpperCase()
    .split('')
    .map((char) =>
      String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - A_CHAR_CODE),
    )
    .join('');
}
