import { LocaleList } from '@/features/store/components/locale-list';
import { STORE_CURRENT_LOCALE_COOKIE_KEY } from '@/features/store/constants';
import { getStores } from '@/features/store/services/queries';
import { getLocales } from '@ecomm/lib/locales';
import { cookies } from 'next/headers';

export async function Header() {
  const locales = getLocales();
  const stores = await getStores({
    page: 1,
    pageSize: Object.keys(locales).length,
  });

  const selectStoreLocaleAction = async (locale: string) => {
    'use server';

    (await cookies()).set(STORE_CURRENT_LOCALE_COOKIE_KEY, locale);
  };

  return (
    <header className="bg-white p-4">
      <LocaleList
        stores={stores.success ? stores.data.stores : []}
        selectStoreLocaleAction={selectStoreLocaleAction}
      />
    </header>
  );
}
