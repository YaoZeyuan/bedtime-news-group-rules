import type { CaseRecord } from "../types/home";
import { renderMarkdown } from "./markdown";

export function parseCaseRecords(source: string): CaseRecord[] {
  const normalizedSource = source.replace(/\r\n/g, "\n");
  const matches = [...normalizedSource.matchAll(/^#\s+Q(\d+)[：:]\s*(.+)$/gm)];

  return matches.map((match, index) => {
    const nextMatch = matches[index + 1];
    const bodyStart = (match.index ?? 0) + match[0].length;
    const bodyEnd = nextMatch?.index ?? normalizedSource.length;
    const body = normalizedSource.slice(bodyStart, bodyEnd).trim();
    const plainText = body
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[#>*`_[\]()]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      id: `Q${match[1]}`,
      title: match[2].trim(),
      excerpt: createCaseExcerpt(plainText),
      plainText,
      html: renderMarkdown(body),
    };
  });
}

export function normalizeSearchText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function createCaseExcerpt(value: string) {
  if (value.length <= 72) return value;
  return `${value.slice(0, 72)}...`;
}
