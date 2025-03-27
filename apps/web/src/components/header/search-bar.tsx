'use client';

import { dynamicImport } from '@/lib/utils/dynamic-import';
import { useScopedI18n } from '@/locales/client';
import { Button } from '@ecomm/ui/button';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const { SearchContent } = dynamicImport(
  () => import('./search-content'),
  {
    SearchContent: null,
  },
  { ssr: false },
);

export function SearchBar() {
  const [open, setOpen] = useState(false);
  const t = useScopedI18n('header.navigation');
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      <Button
        aria-label={t('actions.search.open')}
        variant="none"
        size="icon"
        className="h-min w-min"
        onClick={() => setOpen(!open)}
      >
        <Search aria-hidden />
      </Button>
      {open && <SearchContent close={() => setOpen(false)} />}
    </>
  );
}
