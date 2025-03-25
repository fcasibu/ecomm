export function slugify(text: string | null | undefined): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export function toTitleCase(text: string | null | undefined): string {
  if (!text) return '';

  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/-+/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
