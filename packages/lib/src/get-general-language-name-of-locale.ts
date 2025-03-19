export function getGeneralLanguageNameOfLocale(locale: string) {
  const languageCode = locale.split('-')[0] ?? 'en';
  return new Intl.DisplayNames(['en'], { type: 'language' }).of(languageCode);
}
