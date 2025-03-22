import type { ContentPage } from '@/sanity.types';
import type {
  BlockKeys,
  ContentPageDTO,
} from '@/sanity/queries/content-page/types';
import { FullWidthBanner } from '../blocks/full-width-banner';
import { Spacer } from '../spacer';

const BLOCKS = {
  fullWidthBanner: FullWidthBanner,
} as const satisfies Record<BlockKeys, React.ElementType>;

const BLOCKS_WITH_NO_SPACING: BlockKeys[] = ['fullWidthBanner'];

export function ContentPage({ contentPage }: { contentPage: ContentPageDTO }) {
  if (!contentPage.blocks.length) return null;

  return (
    <>
      {contentPage.blocks.map((block, index) => {
        const Component = BLOCKS[block.type];

        if (!Component) return null;

        const hasSpacing = !BLOCKS_WITH_NO_SPACING.includes(block.type);
        const topSpacing = hasSpacing && index !== 0;
        const bottomSpacing =
          hasSpacing && index !== contentPage.blocks.length - 1;

        return (
          <Spacer key={block.key} top={topSpacing} bottom={bottomSpacing}>
            <Component data={block} />
          </Spacer>
        );
      })}
    </>
  );
}
