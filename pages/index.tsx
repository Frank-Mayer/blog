import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { mdToHtml } from "../lib/mdToHtml";
import { getContent, type Content } from "../utils/content";
import { getPath } from "../utils/slug";

type Props = {
  content: ReadonlyArray<Content & { html: string }>;
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  return {
    props: {
      content: (await getContent(false)).map((item) => ({
        ...item,
        html: mdToHtml(item.content),
      })),
    },
  };
};

const Page = (props: Props) => (
  <>
    <Head>
      <title>Franks Blog</title>
    </Head>

    <ul className="articles">
      {props.content.map((item, i) => (
        <li key={i}>
          <Link href={getPath(item)}>
            <Image
              className="article-thumbnail"
              src={"/thumbnails/" + item.frontMatter.thumbnail}
              width="320"
              height="180"
              alt={item.title}
              style={{ objectFit: "cover" }}
            />
            <span className="article-title">{item.title}</span>
            <span className="article-description">
              {item.frontMatter.description}
            </span>
            <p
              className="article-preview"
              dangerouslySetInnerHTML={{ __html: item.html }}
            />
          </Link>
          <span>
            Thumbnail von{" "}
            <a
              target="_blank"
              rel="noreferrer noopener"
              href={item.frontMatter.photoBy.url}
            >
              {item.frontMatter.photoBy.name}
            </a>
          </span>
        </li>
      ))}
    </ul>
  </>
);

export default Page;
