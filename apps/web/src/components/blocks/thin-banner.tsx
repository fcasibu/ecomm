import type { ThinBanner as ThinBannerType } from '@/sanity/queries/content-page/types';
import { Button } from '@ecomm/ui/button';
import { ImageComponent, type CustomImageProps } from '@ecomm/ui/image';
import { Heading } from '@ecomm/ui/typography';
import { ConditionalLink } from '../link';
import { cn } from '@ecomm/ui/lib/utils';
import { getAlignmentClass } from '@/lib/utils/block-classname-transformers';
import { Badge } from '@ecomm/ui/badge';

export function ThinBanner({
  data,
  imageLoadingStrategy = null,
}: {
  data: ThinBannerType;
  imageLoadingStrategy?: Pick<
    CustomImageProps,
    'loading' | 'fetchPriority'
  > | null;
}) {
  const { cta, image, title, description, tag, contentAlignment } = data;

  return (
    <div className="container relative min-h-[300px] py-12">
      {image?.url && (
        <div className="absolute inset-0 -z-10 overflow-hidden 2xl:rounded-xl">
          <ImageComponent
            className="h-full w-full object-cover"
            alt={image.alt || 'Banner Image'}
            src={image.url}
            fill
            {...imageLoadingStrategy}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      )}

      <div className="flex h-full w-full items-center">
        <div
          className={cn(
            'relative flex flex-col gap-6 lg:px-4',
            getAlignmentClass(contentAlignment),
          )}
        >
          <div>
            {tag?.value && (
              <Badge style={{ color: tag.textColor }}>{tag.value}</Badge>
            )}
            <Heading style={{ color: title.textColor }} as={title.type}>
              {title.value}
            </Heading>
            {description?.value && (
              <p style={{ color: description.textColor }} className="text-lg">
                {description.value}
              </p>
            )}
          </div>
          {cta?.url && (
            <Button
              asChild
              className="w-full max-w-max hover:no-underline"
              variant="outline"
              type="button"
            >
              <ConditionalLink href={cta.url} newTab={cta.newTab}>
                {cta.title}
              </ConditionalLink>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
