const dataResp = await fetch("https://api.frank-mayer.io/medium");

type Data = {
    title: string;
    entries: Array<{
        slug: string;
        title: string;
        content: string;
        summary: string;
    }>;
};

export const data: Readonly<Data> = dataResp.ok
    ? await dataResp.json()
    : {
          title: "Frank Mayer Blog",
          entries: [],
      };
