'use client';

import { useCurrentLocale, useScopedI18n } from '@/locales/client';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/sanity/queries/content-page/types';
import { Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { link } from '@/lib/utils/link-helper';
import { BreadcrumbRenderer, type BreadcrumbData } from './breadcrumb-renderer';

export function ContentPageBreadcrumb({
  data,
}: {
  data: BreadcrumbItemType[];
}) {
  const pathname = usePathname();
  const locale = useCurrentLocale();
  const t = useScopedI18n('breadcrumb.home');

  const breadcrumb = createBreadcrumb(data, pathname, t('label'), locale);

  return (
    <BreadcrumbRenderer
      breadcrumb={breadcrumb}
      currentPath={pathname}
      locale={locale}
    />
  );
}

function createBreadcrumb(
  data: BreadcrumbItemType[],
  currentPath: string,
  homeLabel: string,
  locale: string,
): BreadcrumbData[] {
  const breadcrumb = data.map((item) => ({
    label: item.label,
    icon: undefined as React.ElementType | undefined,
    url: item.link.url,
  }));

  if (currentPath !== `${link.home}${locale}`) {
    breadcrumb.unshift({ label: homeLabel, icon: Home, url: '/' });
  }

  return breadcrumb;
}
