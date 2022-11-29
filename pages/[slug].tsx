import type { GetStaticPaths, GetStaticPropsContext } from "next/types";
import { type Content, getContent, parseFile } from "../utils/content";
import { getPath } from "../utils/slug";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import type { CompileOptions } from "@mdx-js/mdx";
import { SyntaxHighlighting } from "../components/SyntaxHighlighting";
import Head from "next/head";
import { applyBibliographyAsync } from "../utils/bibliography";
import { mdSupercharge } from "../utils/mdSupercharge";
import Link from "next/link";
import { readFile } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import rehypeSlug from "rehype-slug";
import rehypeToc from "@jsdevtools/rehype-toc";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

type Props = Content & { source: MDXRemoteSerializeResult };

const components = { SyntaxHighlighting, Link };

const mdxOptions: Omit<
  CompileOptions,
  "outputFormat" | "providerImportSource"
> = {
  // remarkPlugins: [],
  rehypePlugins: [
    rehypeSlug,
    rehypeToc,
    [
      rehypeAutolinkHeadings,
      {
        behavior: "wrap",
      },
    ],
  ],
  format: "mdx",
};

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await getContent()).map((item) => getPath(item)),
  fallback: false,
});

export const getStaticProps = async (
  context: GetStaticPropsContext<{
    slug: string;
  }>
): Promise<{ props: Props }> => {
  if (context.params) {
    let filePath = join(".", "content", context.params.slug + ".md");

    if (!existsSync(filePath)) {
      filePath = filePath + "x";

      if (!existsSync(filePath)) {
        throw new Error(`Cannot find source for slug "${context.params.slug}"`);
      }
    }

    const fileContent = await readFile(filePath, "utf-8");

    const item = await parseFile(filePath, fileContent);

    return {
      props: {
        ...item,
        source: await serialize(
          mdSupercharge(
            await applyBibliographyAsync(item.content, item.bibliography)
          ),
          {
            mdxOptions,
          }
        ),
      },
    };
  } else {
    throw new Error("No slug provided");
  }
};

const Page = (props: Props) => {
  return (
    <>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.frontMatter.description} />
      </Head>

      <article>
        <h1>{props.frontMatter.title}</h1>
        <MDXRemote {...props.source} components={components} />
      </article>
    </>
  );
};

export default Page;
