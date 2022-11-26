import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import { filenameToSlug, filenameToTitle } from "./slug";
import { join } from "path";
import { existsSync } from "fs";
import { Bibliography, parseBibliography } from "./bibliography";

const contentDir = "./content";

export type Content = {
  title: string;
  slug: string;
  frontMatter: {
    [key: string]: any;
  };
  content: string;
  bibliography?: Array<Bibliography> | undefined | null;
};

const mdExtensionRegex = /\.mdx?$/i;

export const parseFile = async (
  file: string,
  content: string
): Promise<Content> => {
  const gm = matter(content);
  const frontMatter = gm.data;

  const bibFile = file.replace(mdExtensionRegex, ".bib");

  const bibliography = existsSync(bibFile)
    ? parseBibliography(await readFile(bibFile, "utf-8"))
    : null;

  return {
    title: "title" in frontMatter ? frontMatter.title : filenameToTitle(file),
    frontMatter: gm.data,
    slug: filenameToSlug(file),
    content: gm.content,
    bibliography,
  };
};

export const getContent = async () => {
  const files = await (
    await readdir(contentDir)
  ).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
  const contents = await Promise.all(
    files.map(async (file) => {
      const content = await readFile(join(contentDir, file), "utf-8");
      return parseFile(file, content);
    })
  );

  return contents.sort((a, b) => {
    return Date.parse(b.frontMatter.date) - Date.parse(a.frontMatter.date);
  }) as ReadonlyArray<Content>;
};
