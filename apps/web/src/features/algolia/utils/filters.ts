export class ProductFiltersBuilder {
  private filters: string[] = [];

  public build() {
    return this.filters.join(' AND ');
  }

  public addCategorySlug(categorySlug: string) {
    this.filters.push(`categorySlug:${categorySlug}`);

    return this;
  }
}
