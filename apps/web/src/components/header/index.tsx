import { getCurrentLocale } from '@/locales/server';
import { getHeader } from '@/sanity/queries/header/get-header';
import { NavigationBar } from './navigation-bar';
import { NavigationBarMobile } from './navigation-bar-mobile';

export async function Header() {
  const locale = await getCurrentLocale();
  const header = await getHeader(locale);

  return (
    <header className="sticky top-0 w-full border border-b-gray-200 bg-white">
      <NavigationBar
        navigation={header?.success ? header.data.navigation : null}
      />
      <NavigationBarMobile
        navigation={header?.success ? header.data.navigation : null}
      />
    </header>
  );
}
