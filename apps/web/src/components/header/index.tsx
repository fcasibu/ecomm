import { getCurrentLocale } from '@/locales/server';
import { getHeader } from '@/sanity/queries/header/get-header';
import { NavigationBar } from './navigation-bar';
import { NavigationBarMobile } from './navigation-bar-mobile';
import { ActionComponents } from './action-components';
import { UtilityBar } from './utility-bar';

export async function Header() {
  const locale = await getCurrentLocale();
  const header = await getHeader(locale);

  // NOTE(fcasibu): this is fine since we are in server
  const actionComponents = <ActionComponents />;

  return (
    <header className="sticky top-0 z-10 w-full border border-b-gray-300 bg-white">
      <UtilityBar />
      <NavigationBar
        navigation={header?.success ? header.data?.navigation : null}
        actionComponents={actionComponents}
      />
      <NavigationBarMobile
        navigation={header?.success ? header.data?.navigation : null}
        actionComponents={actionComponents}
      />
    </header>
  );
}
