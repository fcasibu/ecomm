import { link } from '@/lib/utils/link-helper';
import { getScopedI18n } from '@/locales/server';
import { NextLink } from '../link';
import { Text } from '@ecomm/ui/typography';

export async function FooterMeta() {
  const t = await getScopedI18n('footer.meta');

  return (
    <div className="bg-gray-50 py-4">
      <div className="container flex flex-col items-center justify-center gap-2 lg:flex-row lg:justify-between lg:gap-0">
        <NextLink href={link.home} className="hover:no-underline">
          <Text className="!font-bold">{t('title')}</Text>
        </NextLink>
        <div className="flex gap-2">
          <NextLink href={link.tos}>
            <Text as="span" size="sm" className="text-gray-600">
              {t('links.tos')}
            </Text>
          </NextLink>
          <NextLink href={link.privacyPolicy}>
            <Text as="span" size="sm" className="text-gray-600">
              {t('links.privacy')}
            </Text>
          </NextLink>
          <NextLink href={link.accessibility}>
            <Text as="span" size="sm" className="text-gray-600">
              {t('links.accessibility')}
            </Text>
          </NextLink>
        </div>
        <Text as="span" size="sm" className="text-gray-600">
          {t('notice', { year: new Date().getFullYear() })}
        </Text>
      </div>
    </div>
  );
}
