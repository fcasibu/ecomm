'use client';

import { link } from '@/lib/utils/link-helper';
import { useCurrentLocale, useScopedI18n } from '@/locales/client';
import { Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { BreadcrumbRenderer } from './breadcrumb-renderer';

export function ProductDetailPageBreadcrumb({
  data,
}: {
  data: { id: string; name: string; slug: string }[];
}) {
  const pathname = usePathname();
  const locale = useCurrentLocale();
  const t = useScopedI18n('breadcrumb.home');

  const breadcrumb = data.map((item) => ({
    label: item.name,
    icon: undefined as React.ElementType | undefined,
    url: link.category.single(item.slug),
  }));

  breadcrumb.unshift({ label: t('label'), icon: Home, url: link.home });

  return (
    <BreadcrumbRenderer
      breadcrumb={breadcrumb}
      currentPath={pathname}
      locale={locale}
    />
  );
}
