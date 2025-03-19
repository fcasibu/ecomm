import type { FooterNavigation } from '@/sanity/queries/footer/types';
import { ConditionalLink } from '../link';
import { Text } from '@ecomm/ui/typography';

export function FooterNavigation({
  navigation,
}: {
  navigation: FooterNavigation | null | undefined;
}) {
  if (!navigation?.navigationItems.length) return null;

  return (
    <ul className="grid grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-4">
      {navigation.navigationItems.map((item) => (
        <li key={item.title}>
          <Text size="md" className="mb-2 !font-semibold">
            {item.title}
          </Text>
          <ul>
            {item.children.map((child) => (
              <li key={child.title} className="mb-1">
                <ConditionalLink href={child.link?.url} prefetch>
                  <Text as="span" size="sm" className="text-gray-600">
                    {child.title}
                  </Text>
                </ConditionalLink>
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}
