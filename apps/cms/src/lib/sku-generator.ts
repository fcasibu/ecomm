export function generateSKU(productName: string, category: string): string {
  const namePrefix = productName.slice(0, 3).toUpperCase()
  const categoryPrefix = category.slice(0, 2).toUpperCase()
  const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase()

  return `${categoryPrefix}${namePrefix}-${randomSuffix}`
}

