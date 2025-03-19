import { getCurrentLocale, getScopedI18n } from '@/locales/server';
import { getHeader } from '@/sanity/queries/header/get-header';
import { NavigationBar } from './navigation-bar';
import { NavigationBarMobile } from './navigation-bar-mobile';
import { NextLink } from '../link';
import { link } from '@/lib/utils/link-helper';
import { Separator } from '@ecomm/ui/separator';
import { Text } from '@ecomm/ui/typography';
import { Globe } from 'lucide-react';

export async function Header() {
  const locale = await getCurrentLocale();
  const header = await getHeader(locale);
  const t = await getScopedI18n('header.menu');
  const [lang, region] = locale.split('-');

  return (
    <header className="sticky top-0 w-full border border-b-gray-300 bg-white">
      <div className="bg-gray-200 py-1">
        <div className="container flex items-center justify-end gap-4">
          <NextLink href={link.help} className="text-[0.6rem]">
            {t('help')}
          </NextLink>
          <Separator orientation="vertical" className="h-[20px] bg-gray-500" />
          <NextLink href={link.auth.joinUs} className="text-[0.6rem]">
            {t('actions.joinUs')}
          </NextLink>
          <Separator orientation="vertical" className="h-[20px] bg-gray-500" />
          <NextLink href={link.auth.signIn} className="text-[0.6rem]">
            {t('actions.signIn')}
          </NextLink>
          <Separator orientation="vertical" className="h-[20px] bg-gray-500" />
          <Text className="flex items-start gap-1 !text-[0.6rem]">
            <Globe size={12} />
            <span>{(region ? region : lang)?.toUpperCase()}</span>
          </Text>
        </div>
      </div>
      <NavigationBar
        navigation={header?.success ? header.data?.navigation : null}
      />
      <NavigationBarMobile
        navigation={header?.success ? header.data?.navigation : null}
      />
    </header>
  );
}
