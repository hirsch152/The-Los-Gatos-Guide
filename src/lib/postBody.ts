/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Post body normalizer for The Los Gatos Guide.
 *
 * Three accepted input shapes, in priority order:
 *
 *   1. contentBlocks: structured array of {type, ...} blocks (preferred)
 *      - {type:"paragraph", text:string}
 *      - {type:"heading",   text:string}
 *      - {type:"list",      items:string[]}
 *
 *   2. body string with simple Markdown:
 *      - "## Heading" or "**Bold heading**" lines become headings
 *      - "- item" or "* item" lines become a list
 *      - Blank-line-separated chunks become paragraphs
 *
 *   3. body string as plain prose:
 *      - Blank-line-separated chunks become paragraphs
 *      - If there are no blank lines, apply a fallback that splits long text
 *        into paragraphs at sentence boundaries, never longer than ~500 chars.
 *
 * Output is always a sanitized HTML string. No raw HTML from any input
 * shape is passed through unescaped. The only HTML the renderer emits
 * comes from this module, and it is restricted to <p>, <h3>, <ul>, <li>.
 */

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: string[] };

const MAX_PARAGRAPH_CHARS = 500;
const SENTENCES_PER_PARAGRAPH = 3;

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

/**
 * Split a long plain-text run into paragraphs at sentence boundaries,
 * capped at ~500 chars per paragraph and 2-3 sentences each.
 *
 * Always returns at least one paragraph. If a single sentence exceeds
 * 500 chars it is returned as-is (we do not break inside a sentence).
 */
export const splitIntoParagraphs = (text: string): string[] => {
  const trimmed = text.trim();
  if (!trimmed) return [];

  const sentences = trimmed.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g);
  if (!sentences || sentences.length <= SENTENCES_PER_PARAGRAPH) {
    return [trimmed];
  }

  const paragraphs: string[] = [];
  let buffer: string[] = [];
  let bufferLen = 0;

  const flush = () => {
    if (buffer.length === 0) return;
    paragraphs.push(buffer.join(" ").replace(/\s+/g, " ").trim());
    buffer = [];
    bufferLen = 0;
  };

  for (const raw of sentences) {
    const sentence = raw.trim();
    if (!sentence) continue;
    const wouldBeLen = bufferLen + (bufferLen > 0 ? 1 : 0) + sentence.length;

    if (
      buffer.length >= SENTENCES_PER_PARAGRAPH ||
      (bufferLen > 0 && wouldBeLen > MAX_PARAGRAPH_CHARS)
    ) {
      flush();
    }
    buffer.push(sentence);
    bufferLen = bufferLen === 0 ? sentence.length : wouldBeLen;
  }
  flush();

  return paragraphs.length > 0 ? paragraphs : [trimmed];
};

/**
 * Parse a body string that may contain minimal Markdown into a ContentBlock[].
 * Recognized Markdown: "## Heading", "**Heading**", "- item" / "* item".
 * Plain-text lines are grouped into paragraphs by blank-line separation.
 */
export const parseMarkdownish = (body: string): ContentBlock[] => {
  const blocks: ContentBlock[] = [];
  const lines = body.replace(/\r\n/g, "\n").split("\n");

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Heading: "## Heading" or "**Heading**"
    const mdHeading = /^#{1,6}\s+(.+)$/.exec(trimmed);
    const boldHeading = /^\*\*(.+?)\*\*$/.exec(trimmed);
    if (mdHeading) {
      blocks.push({ type: "heading", text: mdHeading[1].trim() });
      i++;
      continue;
    }
    if (boldHeading && boldHeading[1].length < 80 && !boldHeading[1].includes(". ")) {
      blocks.push({ type: "heading", text: boldHeading[1].trim() });
      i++;
      continue;
    }

    // List: consecutive "- " or "* " lines
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        const m = /^[-*]\s+(.+)$/.exec(t);
        if (!m) break;
        items.push(m[1].trim());
        i++;
      }
      blocks.push({ type: "list", items });
      continue;
    }

    // Paragraph: gather contiguous non-empty, non-heading, non-list lines,
    // then split on blank lines.
    const paraLines: string[] = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (
        !t ||
        /^#{1,6}\s+/.test(t) ||
        /^\*\*.+\*\*$/.test(t) ||
        /^[-*]\s+/.test(t)
      ) {
        break;
      }
      paraLines.push(t);
      i++;
    }
    if (paraLines.length > 0) {
      blocks.push({ type: "paragraph", text: paraLines.join(" ") });
    }
  }

  return blocks;
};

/**
 * Render a ContentBlock[] to safe HTML.
 * Only the tags defined below are emitted. All text is HTML-escaped.
 */
export const renderBlocksToHtml = (blocks: ContentBlock[]): string => {
  const out: string[] = [];
  for (const block of blocks) {
    if (block.type === "paragraph") {
      const text = block.text.trim();
      if (!text) continue;
      out.push(`<p class="post-paragraph">${escapeHtml(text)}</p>`);
    } else if (block.type === "heading") {
      const text = block.text.trim();
      if (!text) continue;
      out.push(`<h3 class="post-heading">${escapeHtml(text)}</h3>`);
    } else if (block.type === "list") {
      const items = block.items
        .map((it) => it.trim())
        .filter((it) => it.length > 0);
      if (items.length === 0) continue;
      const li = items
        .map((it) => `<li class="post-list-item">${escapeHtml(it)}</li>`)
        .join("");
      out.push(`<ul class="post-list">${li}</ul>`);
    }
  }
  return out.join("\n");
};

/**
 * Normalize any accepted body shape into a safe HTML string for the modal.
 * - If contentBlocks is present and non-empty, use it.
 * - Else if body contains minimal Markdown, parse it.
 * - Else treat body as plain prose and split intelligently.
 */
export const normalizePostBody = (
  body: string | undefined | null,
  contentBlocks: ContentBlock[] | undefined | null,
): string => {
  if (Array.isArray(contentBlocks) && contentBlocks.length > 0) {
    return renderBlocksToHtml(contentBlocks);
  }

  const raw = (body ?? "").trim();
  if (!raw) {
    return `<p class="post-paragraph">Details coming soon.</p>`;
  }

  const hasMarkdownSignal =
    /(^|\n)#{1,6}\s+/.test(raw) ||
    /(^|\n)\*\*[^*\n]{1,80}\*\*\s*(\n|$)/.test(raw) ||
    /(^|\n)[-*]\s+\S/.test(raw);

  const blocks = hasMarkdownSignal
    ? parseMarkdownish(raw)
    : splitIntoParagraphs(raw).map((p) => ({ type: "paragraph" as const, text: p }));

  return renderBlocksToHtml(blocks);
};