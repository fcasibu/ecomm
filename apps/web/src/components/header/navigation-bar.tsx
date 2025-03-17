'use client';

import { Text } from '@ecomm/ui/typography';
import { NextLink } from '../link';
import { Fragment, useState } from 'react';
import type {
  HeaderNavigation,
  HeaderTier1NavigationItem,
} from '@/sanity/queries/header/types';

interface NavigationBarProps {
  navigation: HeaderNavigation;
}

export function NavigationBar({ navigation }: NavigationBarProps) {
  const [openedMegamenuIndex, setOpenedMegamenuIndex] = useState<
    number | undefined
  >();
  const { navigationItems } = navigation;

  return (
    <nav onMouseLeave={() => setOpenedMegamenuIndex(undefined)}>
      <ul className="flex">
        {navigationItems?.map((item, index) => (
          <Fragment key={`${item.type}-${index}`}>
            {item.type === 'categoryNavigationItem' ? (
              <CategoryNavigationItem />
            ) : (
              <Tier1NavigationItem
                navigationItem={item}
                onMouseEnter={() => setOpenedMegamenuIndex(index)}
              />
            )}
          </Fragment>
        ))}
      </ul>
      {openedMegamenuIndex !== undefined && (
        <div className="absolute h-[500px] w-full bg-white">
          {JSON.stringify(navigationItems[openedMegamenuIndex])}
        </div>
      )}
    </nav>
  );
}

function CategoryNavigationItem() {
  return null;
}

function Tier1NavigationItem({
  navigationItem,
  onMouseEnter,
}: {
  navigationItem: HeaderTier1NavigationItem;
  onMouseEnter: () => void;
}) {
  return (
    <li onMouseEnter={onMouseEnter}>
      {navigationItem.link?.url ? (
        <NextLink href={navigationItem.link?.url}>
          <Text as="span">{navigationItem.title}</Text>
        </NextLink>
      ) : (
        <Text as="span">{navigationItem.title}</Text>
      )}
    </li>
  );
}
