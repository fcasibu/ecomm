import type { FullScreenBanner as FullScreenBannerType } from '@/sanity/queries/content-page/types';
import { Button } from '@ecomm/ui/button';
import { ImageComponent, type CustomImageProps } from '@ecomm/ui/image';
import { Heading } from '@ecomm/ui/typography';
import { cn } from '@ecomm/ui/lib/utils';
import {
  getAlignmentClass,
  getPositionClass,
} from '@/lib/utils/block-classname-transformers';
import { Badge } from '@ecomm/ui/badge';
import { ConditionalLink } from '../link';

export function FullScreenBanner({
  data,
  imageLoadingStrategy = null,
}: {
  data: FullScreenBannerType;
  imageLoadingStrategy?: Pick<
    CustomImageProps,
    'loading' | 'fetchPriority'
  > | null;
}) {
  const {
    cta,
    image,
    title,
    description,
    tag,
    contentPosition,
    contentAlignment,
  } = data;

  return (
    <div className="relative h-screen py-8">
      {image.url && (
        <div className="absolute inset-0">
          <ImageComponent
            className="object-cover"
            alt={image.alt}
            src={image.url}
            fill
            {...imageLoadingStrategy}
          />
        </div>
      )}
      <div className="container relative h-full w-full">
        <div
          className={cn(
            'absolute flex flex-col gap-6 px-4',
            getAlignmentClass(contentAlignment),
            getPositionClass(contentPosition),
          )}
        >
          <div>
            {tag.value && (
              <Badge style={{ color: tag.textColor }}>{tag.value}</Badge>
            )}
            <Heading style={{ color: title.textColor }} as={title.type}>
              {title.value}
            </Heading>
            <p style={{ color: description.textColor }} className="text-lg">
              {description.value}
            </p>
          </div>
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
        </div>
      </div>
    </div>
  );
}
