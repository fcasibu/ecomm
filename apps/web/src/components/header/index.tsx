import { getCurrentLocale } from '@/locales/server';
import { getHeader } from '@/sanity/queries/header/get-header';
import { NavigationBar } from './navigation-bar';

export async function Header() {
  const locale = await getCurrentLocale();
  const header = await getHeader(locale);

  return (
    <header className="sticky top-0 w-full">
      <NavigationBar navigation={header?.navigation} />
    </header>
  );
}
