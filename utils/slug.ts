import type { Content } from "./content";

export const filenameToSlug = (filename: string) =>
  filename.replace(/.mdx?$/, "");

export const filenameToTitle = (filename: string) =>
  filename.replace(/.mdx?$/, "").replace(/[\s._-]+/g, " ");

export const getPath = (content: Content) => `/${content.slug}`;
