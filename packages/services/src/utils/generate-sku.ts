export function generateSku(name: string) {
  const nameSegment = name
    .split(" ")
    .map((item) => item.at(0))
    .join("");
  const id = Date.now().toString(36);

  return `${nameSegment}-${id}`.toUpperCase();
}
