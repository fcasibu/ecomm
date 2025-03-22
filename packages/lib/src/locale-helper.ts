export type Locale = 'en-US';

export const AVAILABLE_LOCALES = ['en-US'] as const;

export const DEFAULT_LOCALE = 'en-US';

export const toUnderscoreLocale = (locale: string) => {
  return locale.toLowerCase().replace('-', '_');
};
