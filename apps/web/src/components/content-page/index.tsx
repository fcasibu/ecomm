import type { ContentPage } from '@/sanity.types';
import type {
  BlockKeys,
  ContentPageDTO,
} from '@/sanity/queries/content-page/types';
import { FullScreenBanner } from '../blocks/full-screen-banner';
import { Spacer } from '../spacer';
import { ContentPageBreadcrumb } from '../content-page-breadcrumb';

const BLOCKS = {
  fullScreenBanner: FullScreenBanner,
} as const satisfies Record<BlockKeys, React.ElementType>;

const BLOCKS_WITH_NO_SPACING: BlockKeys[] = ['fullScreenBanner'];

export function ContentPage({ contentPage }: { contentPage: ContentPageDTO }) {
  if (!contentPage.blocks.length) return null;

  return (
    <>
      <ContentPageBreadcrumb data={contentPage.breadcrumb} />
      {contentPage.blocks.map((block, index) => {
        const Component = BLOCKS[block.type];

        if (!Component) return null;

        const hasSpacing = !BLOCKS_WITH_NO_SPACING.includes(block.type);
        const topSpacing = hasSpacing && index !== 0;
        const bottomSpacing =
          hasSpacing && index !== contentPage.blocks.length - 1;

        return (
          <Spacer key={block.key} top={!topSpacing} bottom={!bottomSpacing}>
            <Component data={block} />
          </Spacer>
        );
      })}
    </>
  );
}
