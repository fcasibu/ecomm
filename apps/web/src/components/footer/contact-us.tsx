import { getScopedI18n } from '@/locales/server';
import { Text } from '@ecomm/ui/typography';
import { Mail, MapPin, Phone } from 'lucide-react';

export async function ContactUs() {
  const t = await getScopedI18n('footer.contactUs');

  return (
    <div>
      <Text size="md" className="mb-2 !font-semibold">
        {t('title')}
      </Text>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <MapPin size={20} />
          <Text as="span" size="sm" className="text-gray-600">
            {t('location')}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Phone size={20} />
          <Text as="span" size="sm" className="text-gray-600">
            {t('phone')}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Mail size={20} />
          <Text as="span" size="sm" className="text-gray-600">
            {t('email')}
          </Text>
        </div>
      </div>
    </div>
  );
}
