'use client';

import { useClerk } from '@clerk/nextjs';
import { NextLink } from '../link';
import { link } from '@/lib/utils/link-helper';
import { Skeleton } from '@ecomm/ui/skeleton';
import { useScopedI18n } from '@/locales/client';
import { ClerkProvider } from '@clerk/nextjs';
import { Suspense } from 'react';

function Auth() {
  const { isSignedIn, loaded, buildSignInUrl } = useClerk();
  const t = useScopedI18n('header.menu');

  if (!loaded) {
    return <Skeleton className="h-3 w-[62px]" />;
  }

  if (isSignedIn) {
    return (
      <NextLink href={link.myAccount.dashboard} className="text-[0.6rem]">
        {t('actions.myAccount')}
      </NextLink>
    );
  }

  return (
    <a href={buildSignInUrl()} className="text-[0.6rem]">
      {t('actions.signIn')}
    </a>
  );
}

export function AuthStatus() {
  return (
    <Suspense fallback={<Skeleton className="h-4 w-[62px]" />}>
      <ClerkProvider dynamic>
        <Auth />
      </ClerkProvider>
    </Suspense>
  );
}
