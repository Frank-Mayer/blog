import type { GetStaticPaths } from "next/types";
import { type Content, getContent } from "../../utils/content";
import { getPath } from "../../utils/slug";
import { MDXRemote, type MDXRemoteSerializeResult } from "next-mdx-remote";
import { SyntaxHighlighting } from "../../components/SyntaxHighlighting";
import Head from "next/head";
import Link from "next/link";
import { join as joinPosix } from "path/posix";
type Props = Content & { source: MDXRemoteSerializeResult };

const components = { SyntaxHighlighting, Link };

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: (await getContent(true))
    .filter((item) => item.frontMatter.prerelease)
    .map((item) => getPath(item))
    .map((path) => joinPosix("/prerelease", path)),
  fallback: false,
});

export { getStaticProps } from "../[slug]";

const Page = (props: Props) => {
  return (
    <>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.frontMatter.description} />
      </Head>

      <article>
        <h1>{props.frontMatter.title}</h1>
        <p>Prerelease</p>
        <MDXRemote {...props.source} components={components} />
      </article>
    </>
  );
};

export default Page;
