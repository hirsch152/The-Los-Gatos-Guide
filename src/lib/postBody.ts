import { PostContentBlock } from "../types";

const isNonEmptyString = (value: unknown): value is string => {
  return typeof value === "string" && value.length > 0;
};

const isPostContentBlock = (value: unknown): value is PostContentBlock => {
  if (!value || typeof value !== "object" || !("type" in value)) return false;

  const block = value as Record<string, unknown>;
  if (block.type === "paragraph" || block.type === "heading") {
    return isNonEmptyString(block.text);
  }

  if (block.type === "list") {
    return Array.isArray(block.items) && block.items.length > 0 && block.items.every(isNonEmptyString);
  }

  return false;
};

export const parsePostContentBlocks = (value: unknown): PostContentBlock[] | null => {
  if (!Array.isArray(value) || value.length === 0 || !value.every(isPostContentBlock)) {
    return null;
  }

  return value.map((block) => {
    if (block.type === "list") {
      return { type: block.type, items: [...block.items] };
    }

    return { type: block.type, text: block.text };
  });
};

export const selectPostBody = (contentBlocks: unknown, body: unknown, content: unknown) => {
  const parsedBlocks = parsePostContentBlocks(contentBlocks);
  if (parsedBlocks) {
    return { contentBlocks: parsedBlocks, fallbackText: "" };
  }

  const fallbackText = isNonEmptyString(body)
    ? body
    : isNonEmptyString(content)
      ? content
      : "";

  return { contentBlocks: [], fallbackText };
};

export const contentBlocksToText = (blocks: PostContentBlock[]) => {
  return blocks
    .flatMap((block) => (block.type === "list" ? block.items : [block.text]))
    .join(" ");
};

export const splitPlainTextBody = (body: string) => {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
};
