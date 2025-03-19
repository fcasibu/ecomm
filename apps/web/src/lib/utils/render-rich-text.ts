import { createElement } from 'react';

const TAG_REGEX = /<(\w+)>(.*?)<\/\1>/g;

// next-international does not have this kind of functionality yet https://github.com/QuiiBz/next-international/issues/359
export function renderRichText(
  text: string,
  tagMappings: Record<string, React.FC<React.PropsWithChildren>>,
) {
  if (!text) return null;

  TAG_REGEX.lastIndex = 0;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = TAG_REGEX.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const tagName = match[1] as string;
    const tagContent = match[2];

    const node = tagMappings[tagName];

    if (!node) {
      throw new Error(`No node for "${tagName}" was specified`);
    }

    if (tagMappings[tagName]) {
      parts.push(
        createElement(node, { key: `${tagName}-${tagContent}` }, tagContent),
      );
    } else {
      parts.push(tagContent);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
}
