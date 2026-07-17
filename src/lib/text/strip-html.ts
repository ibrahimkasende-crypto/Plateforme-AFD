const HTML_ENTITY_MAP: Record<string, string> = {
  nbsp: " ",
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  "#39": "'",
};

export function stripHtmlTags(value: string): string {
  const withoutTags = value.replace(/<[^>]*>/g, " ");
  return withoutTags
    .replace(/&([a-zA-Z#0-9]+);/g, (match, entity: string) => {
      return HTML_ENTITY_MAP[entity] ?? match;
    })
    .replace(/\s+/g, " ")
    .trim();
}
