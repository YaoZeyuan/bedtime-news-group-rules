export function renderMarkdown(source: string) {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const html: string[] = [];
  let paragraph: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let tableRows: string[] = [];

  const closeParagraph = () => {
    if (paragraph.length === 0) return;
    html.push(`<p>${paragraph.map(renderInline).join("<br>")}</p>`);
    paragraph = [];
  };

  const closeList = () => {
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = null;
  };

  const closeTable = () => {
    if (tableRows.length === 0) return;
    html.push(renderTable(tableRows));
    tableRows = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (isTableLine(trimmed)) {
      closeParagraph();
      closeList();
      tableRows.push(trimmed);
      continue;
    }

    closeTable();

    if (!trimmed) {
      closeParagraph();
      closeList();
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeList();
      const level = Math.min(heading[1].length + 1, 6);
      html.push(`<h${level}>${renderInline(heading[2])}</h${level}>`);
      continue;
    }

    if (/^-{3,}$/.test(trimmed)) {
      closeParagraph();
      closeList();
      html.push("<hr>");
      continue;
    }

    const quote = trimmed.match(/^>\s?(.+)$/);
    if (quote) {
      closeParagraph();
      closeList();
      html.push(`<blockquote>${renderInline(quote[1])}</blockquote>`);
      continue;
    }

    const unordered = trimmed.match(/^[-*+]\s+(.+)$/);
    if (unordered) {
      closeParagraph();
      if (listType !== "ul") {
        closeList();
        html.push("<ul>");
        listType = "ul";
      }
      html.push(`<li>${renderInline(unordered[1])}</li>`);
      continue;
    }

    const ordered = trimmed.match(/^\d+[.)]\s+(.+)$/);
    if (ordered) {
      closeParagraph();
      if (listType !== "ol") {
        closeList();
        html.push("<ol>");
        listType = "ol";
      }
      html.push(`<li>${renderInline(ordered[1])}</li>`);
      continue;
    }

    closeList();
    paragraph.push(trimmed);
  }

  closeParagraph();
  closeList();
  closeTable();

  return html.join("");
}

function renderInline(value: string) {
  const tokens: string[] = [];
  const saveToken = (html: string) => {
    const id = tokens.push(html) - 1;
    return `@@TOKEN_${id}@@`;
  };

  let output = value;
  output = output.replace(/`([^`]+)`/g, (_, code: string) =>
    saveToken(`<code>${escapeHtml(code)}</code>`),
  );
  output = output.replace(
    /\[([^\]]+)]\(([^)]+)\)/g,
    (_, label: string, href: string) => saveToken(renderAnchor(href, label)),
  );
  output = output.replace(/https?:\/\/[^\s<]+/g, (url) =>
    saveToken(renderAnchor(url, url)),
  );
  output = escapeHtml(output);
  output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  return output.replace(
    /@@TOKEN_(\d+)@@/g,
    (_, id: string) => tokens[Number(id)] ?? "",
  );
}

function renderTable(rows: string[]) {
  const parsedRows = rows.map((row) =>
    row
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((cell) => cell.trim()),
  );
  const bodyRows = parsedRows.filter(
    (row) => !row.every((cell) => /^:?-{3,}:?$/.test(cell)),
  );

  if (bodyRows.length === 0) return "";

  const [head, ...body] = bodyRows;
  const headHtml = head
    .map((cell) => `<th>${renderInline(cell)}</th>`)
    .join("");
  const bodyHtml = body
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${renderInline(cell)}</td>`).join("")}</tr>`,
    )
    .join("");

  return `<div class="table-scroll"><table><thead><tr>${headHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
}

function renderAnchor(href: string, label: string) {
  const safeHref = sanitizeHref(href);
  return `<a href="${safeHref}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`;
}

function sanitizeHref(href: string) {
  const trimmed = href.trim();
  if (/^https?:\/\//.test(trimmed)) return escapeAttribute(trimmed);
  if (trimmed.startsWith("#")) return escapeAttribute(trimmed);
  return "#";
}

function isTableLine(line: string) {
  return line.startsWith("|") && line.endsWith("|") && line.includes("|");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/`/g, "&#96;");
}
