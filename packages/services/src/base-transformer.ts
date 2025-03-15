export class BaseTransformer {
  protected formatDateToISO(date: Date | string): string {
    if (date instanceof Date) return date.toISOString();

    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }

    return '';
  }
}
