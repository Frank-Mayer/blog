import type { Content } from "./content";

export const filenameToSlug = (filename: string) =>
  filename.replace(/.mdx?$/, "");

export const filenameToTitle = (filename: string) =>
  filename.replace(/.mdx?$/, "").replace(/[\s._-]+/g, " ");

export const getPath = (content: Content) => {
  const d = new Date(content.frontMatter.date);

  const year = d.getFullYear();
  const month = d.getMonth() + 1;
  const day = d.getDate();

  return `/${year}/${month}/${day}/${content.slug}`;
};
