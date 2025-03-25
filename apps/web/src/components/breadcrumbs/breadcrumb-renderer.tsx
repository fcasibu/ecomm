import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@ecomm/ui/breadcrumb';
import { cn } from '@ecomm/ui/lib/utils';
import { Fragment } from 'react';
import { ConditionalLink } from '../link';

export interface BreadcrumbData {
  label: string;
  icon?: React.ElementType;
  url: string;
}

export function BreadcrumbRenderer({
  breadcrumb,
  currentPath,
  locale,
}: {
  breadcrumb: BreadcrumbData[];
  currentPath: string;
  locale: string;
}) {
  if (!breadcrumb.length) return null;

  return (
    <Breadcrumb className="container my-4">
      <BreadcrumbList>
        {breadcrumb.map(({ label, icon: Icon, url }, index) => {
          const isCurrentPath = `/${locale}${url}` === currentPath;

          return (
            <Fragment key={`${label}-${index}`}>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <ConditionalLink href={isCurrentPath ? null : url}>
                    <div className="flex items-center gap-2">
                      {Icon && <Icon size={15} />}
                      <span className={cn({ 'font-bold': isCurrentPath })}>
                        {label}
                      </span>
                    </div>
                  </ConditionalLink>
                </BreadcrumbLink>
              </BreadcrumbItem>
              {index !== breadcrumb.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
