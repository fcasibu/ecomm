import { randomUUID } from "crypto";

export function generateSku(name: string): string {
  const nameSegment = name
    .split(" ")
    .map((item) => item.charAt(0))
    .join("")
    .substring(0, 3);

  const uniqueId = randomUUID().replace(/-/g, "").substring(0, 8);

  return `${nameSegment}-${uniqueId}`.toUpperCase();
}

export function generateVariantSku(baseSku: string): string {
  const uniqueId = randomUUID().replace(/-/g, "").substring(0, 6);

  return `${baseSku}-${uniqueId}`.toUpperCase();
}
