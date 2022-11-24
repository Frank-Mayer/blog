// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getContent } from "../../utils/content";
import { Feed } from "feed";
import { getPath } from "../../utils/slug";

const feedPromise = new Promise<Feed>(async (resolve) => {
  const content = await getContent();

  const feed = new Feed({
    title: "Frank's Blog",
    description: "Wissenschaftlicher Tech-Blog",
    id: "https://blog.frank-mayer.io/",
    link: "https://blog.frank-mayer.io/",
    language: "de", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: "https://blog.frank-mayer.io/favicon.svg",
    favicon: "https://blog.frank-mayer.io/favicon.ico",
    copyright: `All rights reserved ${new Date().getFullYear()}, Frank Mayer`,
    updated: new Date(content[0].frontMatter.date),
    generator: "Feed for Node.js", // optional, default = 'Feed for Node.js'
    // feedLinks: {
    //   json: "https://example.com/json",
    //   atom: "https://example.com/atom",
    // },
    author: {
      name: "Frank Mayer",
      // email: "johndoe@example.com",
      link: "https://www.frank-mayer.io",
    },
  });

  for (const item of content) {
    const url = "https://blog.frank-mayer.io" + getPath(item);
    feed.addItem({
      title: item.title,
      id: url,
      link: url,
      description: item.frontMatter.description,
      content: item.content,
      date: new Date(item.frontMatter.date),
    });
  }

  feed.addCategory("Technologie");

  resolve(feed);
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader("Content-Type", "application/rss+xml");
  res.status(200).send((await feedPromise).rss2());
}
