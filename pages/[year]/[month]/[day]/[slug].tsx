import type { GetStaticPaths, GetStaticPropsContext } from "next/types";
import { type Content, getContent } from "../../../../utils/content";
import { getPath } from "../../../../utils/slug";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { serialize } from "next-mdx-remote/serialize";
import { SyntaxHighlighting } from "../../../../components/SyntaxHighlighting";
import Head from "next/head";
import { applyBibliography } from "../../../../utils/bibliography";
import { mdSupercharge } from "../../../../utils/mdSupercharge";
import Link from "next/link";

type Props = Content & { source: MDXRemoteSerializeResult };

const components = { SyntaxHighlighting, Link };

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await getContent()).map((item) => getPath(item)),
  fallback: false,
});

export const getStaticProps = async (
  context: GetStaticPropsContext<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>
): Promise<{ props: Props }> => {
  const content = await getContent();

  const item = content.find(
    (item) =>
      item.frontMatter.date ===
        `${context.params?.year}-${context.params?.month}-${context.params?.day}` &&
      item.slug === context.params?.slug
  );

  if (!item) {
    throw new Error("Not found");
  }

  return {
    props: {
      ...item,
      source: await serialize(
        mdSupercharge(applyBibliography(item.content, item.bibliography))
      ),
    },
  };
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
