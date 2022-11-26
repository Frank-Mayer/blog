const { Feed } = require("feed");
const { readdir, readFile, writeFile } = require("fs/promises");
const { join } = require("path");
const matter = require("gray-matter");
const { Converter } = require("showdown");

const generateRSS = async () => {
  const converter = new Converter({
    tables: true,
    noHeaderId: true,
    ghCodeBlocks: true,
  });

  const content = (
    await Promise.all(
      (
        await readdir("./content/", "utf-8")
      )
        .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
        .map(async (fileName) => {
          const file = (
            await readFile(join("./content/", fileName), "utf-8")
          ).trim();
          const md = matter(file);

          const date = new Date(md.data.date);
          const slug = fileName.replace(/\.mdx?$/, "");

          return {
            title: String(md.data.title || slug.replace(/[\s._-]+/g, " ")),
            date: date,
            description: String(md.data.description),
            content: md.content,
            slug,
            link: ["https://blog.frank-mayer.io", slug].join("/"),
          };
        })
    )
  ).sort((a, b) => b.date - a.date);

  const feed = new Feed({
    title: "Frank's Blog",
    description: "Wissenschaftlicher Tech-Blog",
    id: "https://blog.frank-mayer.io/",
    link: "https://blog.frank-mayer.io/",
    language: "de", // optional, used only in RSS 2.0, possible values: http://www.w3.org/TR/REC-html40/struct/dirlang.html#langcodes
    image: "https://blog.frank-mayer.io/favicon.svg",
    favicon: "https://blog.frank-mayer.io/favicon.ico",
    copyright: `All rights reserved ${new Date().getFullYear()}, Frank Mayer`,
    updated: content[0].date,
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
    feed.addItem({
      title: item.title,
      id: item.slug,
      link: item.link,
      description: item.description,
      content: converter.makeHtml(item.content),
      date: item.date,
    });
  }

  feed.addCategory("Technologie");

  await Promise.all([
    writeFile("./public/rss.xml", feed.rss2()),
    writeFile("./public/rss.json", feed.json1()),
    writeFile("./public/rss.atom", feed.atom1()),
  ]);
};

generateRSS();
