import { init } from "@paralleldrive/cuid2";

const createSkuId = init({
  length: 8,
});

const createVariantSkuId = init({
  length: 6,
});

export function generateSku(name: string): string {
  const nameSegment = name
    .split(" ")
    .map((item) => item.charAt(0))
    .join("")
    .substring(0, 2);

  return `${nameSegment}-${createSkuId()}`.toUpperCase();
}

export function generateVariantSku(baseSku: string): string {
  return `${baseSku}-${createVariantSkuId()}`.toUpperCase();
}
