'use client';

import { subscribe, unsubscribe } from '@/lib/actions/newsletter';
import { renderRichText } from '@/lib/utils/render-rich-text';
import { useScopedI18n } from '@/locales/client';
import { Button } from '@ecomm/ui/button';
import { Input } from '@ecomm/ui/input';
import { CheckCircle, ChevronRight, Loader, Mail } from 'lucide-react';
import { useActionState } from 'react';
import { NextLink } from '../link';
import { link } from '@/lib/utils/link-helper';

export function Newsletter({ email }: { email?: string }) {
  const t = useScopedI18n('footer.newsletter');
  const [result, formAction, isPending] = useActionState(subscribe, {
    data: { email: email ?? '' },
    success: true,
  });

  if (result.success && result.data.email) {
    return <NewsletterSuccess email="projectnevz@gmail.com" />;
  }

  return (
    <div className="bg-dark text-dark-foreground py-12 sm:py-16">
      <div className="container flex flex-col items-center gap-4 sm:text-center">
        <div className="space-y-2">
          <p className="text-2xl !font-semibold uppercase lg:text-4xl">
            {t('title')}
          </p>
          <p className="text-sm lg:text-lg">{t('description')}</p>
        </div>
        <form className="flex w-full sm:max-w-[400px]">
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-black/60">
              <Mail className="h-5 w-5" />
            </div>
            <Input
              type="email"
              autoComplete="email"
              name="email"
              placeholder={t('form.email.placeholder')}
              aria-label={t('form.email.placeholder')}
              className="rounded-none bg-white pl-10 text-sm text-black"
              required
            />
          </div>
          <Button
            type="submit"
            formAction={formAction}
            className="min-w-[120px] rounded-none text-black"
            variant="outline"
            disabled={isPending}
          >
            {isPending ? (
              <Loader className="animate-spin" />
            ) : (
              t('form.actions.subscribe')
            )}
          </Button>
        </form>
        <p className="lg:text-md text-xs">
          {renderRichText(t('policy'), {
            link: ({ children }) => (
              <NextLink href={link.privacyPolicy} className="underline">
                {children}
              </NextLink>
            ),
          })}
        </p>
      </div>
    </div>
  );
}

function NewsletterSuccess({ email }: { email: string }) {
  const t = useScopedI18n('footer.newsletter.success');
  const [result, formAction, isPending] = useActionState(unsubscribe, {
    data: false,
    success: true,
  });

  if (result.success && result.data) {
    return <Newsletter />;
  }

  return (
    <div className="bg-dark text-dark-foreground py-12 sm:py-16">
      <div className="container flex max-w-[500px] flex-col items-center gap-3 text-center">
        <CheckCircle className="animate-pulse" size={80} />
        <p className="text-2xl !font-semibold uppercase lg:text-3xl">
          {t('title')}
        </p>
        <p className="lg:text-md text-sm">{t('description')}</p>
        <p className="text-xs lg:text-sm">{t('additionalInfo')}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <form>
            <input type="hidden" value={email} name="email" />
            <Button
              type="submit"
              className="min-w-[150px] text-black"
              variant="outline"
              formAction={formAction}
              disabled={isPending}
            >
              {isPending ? (
                <Loader className="animate-spin" />
              ) : (
                t('actions.unsubscribe')
              )}
            </Button>
          </form>
          <Button type="button" variant="outline" asChild>
            <NextLink
              href="/"
              className="flex items-center gap-2 text-black hover:no-underline"
            >
              <span>{t('actions.explore')}</span>
              <ChevronRight />
            </NextLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
