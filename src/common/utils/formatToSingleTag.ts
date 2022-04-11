type SupportedTags = "p";

export default function formatToSingleTag(
  content: string,
  as: SupportedTags = "p"
): string {
  return `<${as}>${content
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()}</${as}>`;
}
