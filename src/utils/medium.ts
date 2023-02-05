const dataResp = await fetch("https://api.frank-mayer.io/medium");

export type ArticleData = {
    slug: string;
    title: string;
    content: string;
    summary: string;
};

export type Data = {
    title: string;
    entries: Array<ArticleData>;
};

export const data: Readonly<Data> = dataResp.ok
    ? await dataResp.json()
    : {
          title: "Frank Mayer Blog",
          entries: [],
      };
