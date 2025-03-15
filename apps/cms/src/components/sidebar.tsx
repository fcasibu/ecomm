'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@ecomm/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  Home,
  Package,
  Users,
  ShoppingCart,
  List,
  Settings,
} from 'lucide-react';
import { cn } from '@ecomm/ui/lib/utils';
import { useWindowInfo } from '@faceless-ui/window-info';

const navItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Categories', href: '/categories', icon: List },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Orders', href: '/orders', icon: ShoppingCart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const windowInfo = useWindowInfo();

  useEffect(() => {
    if (windowInfo?.width && windowInfo.width <= 640) {
      setIsCollapsed(true);
    }
  }, [windowInfo.width]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const toggleSidebar = () => setIsCollapsed((prev) => !prev);

  return (
    <aside
      className={cn(
        'border-border bg-card relative h-full border-r transition-all duration-300',
        isCollapsed ? 'w-20' : 'w-64',
      )}
    >
      <nav className="mt-6 flex flex-col gap-1 px-2">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Button
              key={item.name}
              variant={active ? 'default' : 'ghost'}
              className={cn(
                'w-full justify-start overflow-hidden transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
              asChild
            >
              <Link href={item.href}>
                <item.icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-transform duration-300',
                    isCollapsed ? 'scale-110' : 'scale-100',
                    active ? 'text-primary-foreground' : '',
                  )}
                />
                <span
                  className={cn(
                    'ml-3 truncate transition-opacity duration-300',
                    isCollapsed ? 'opacity-0 delay-150' : 'opacity-100',
                  )}
                >
                  {item.name}
                </span>
              </Link>
            </Button>
          );
        })}
      </nav>

      <Button
        onClick={toggleSidebar}
        className="bg-card absolute -right-5 top-1/2 -translate-y-1/2 transform rounded-full border shadow-md"
        variant="ghost"
        size="icon"
        aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5" />
        )}
      </Button>
    </aside>
  );
}
