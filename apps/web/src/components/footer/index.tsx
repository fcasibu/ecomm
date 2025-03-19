import { getCurrentLocale } from '@/locales/server';
import { getFooter } from '@/sanity/queries/footer/get-footer';
import { FooterNavigation } from './footer-navigation';
import { ContactUs } from './contact-us';
import { FollowUs } from './follow-us';
import { LocalePicker } from './locale-picker';
import { Newsletter } from './newsletter';
import { FooterMeta } from './footer-meta';

export async function Footer() {
  const locale = await getCurrentLocale();
  const footer = await getFooter(locale);

  return (
    <footer>
      <Newsletter />
      <div className="container flex flex-col items-start space-y-4 py-6 lg:flex-row lg:gap-12 lg:space-y-0">
        <div className="">
          <FooterNavigation
            navigation={footer.success ? footer.data.navigation : null}
          />
        </div>
        <div className="space-y-6 lg:ml-auto">
          <LocalePicker />
          <ContactUs />
          <FollowUs />
        </div>
      </div>
      <FooterMeta />
    </footer>
  );
}
