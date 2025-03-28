import { getCurrentLocale, getScopedI18n } from '@/locales/server';
import { NextLink } from '../link';
import { link } from '@/lib/utils/link-helper';
import { Separator } from '@ecomm/ui/separator';
import { Text } from '@ecomm/ui/typography';
import { Globe } from 'lucide-react';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
} from '@clerk/nextjs';

export async function UtilityBar() {
  const locale = await getCurrentLocale();
  const t = await getScopedI18n('header.menu');
  const [lang, region] = locale.split('-');

  return (
    <div className="bg-gray-200 py-1">
      <div className="container flex items-center justify-end gap-4">
        <NextLink href={link.help} className="text-[0.6rem]">
          {t('help')}
        </NextLink>
        <Separator orientation="vertical" className="h-[20px] bg-gray-500" />
        <ClerkProvider>
          <SignedOut>
            <SignInButton>
              <span className="cursor-pointer text-[0.6rem] hover:underline">
                {t('actions.signIn')}
              </span>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <NextLink href={link.myAccount.dashboard} className="text-[0.6rem]">
              {t('actions.myAccount')}
            </NextLink>
          </SignedIn>
        </ClerkProvider>
        <Separator orientation="vertical" className="h-[20px] bg-gray-500" />
        <Text className="flex items-start gap-1 !text-[0.6rem]">
          <Globe size={12} />
          <span>{(region ? region : lang)?.toUpperCase()}</span>
        </Text>
      </div>
    </div>
  );
}
