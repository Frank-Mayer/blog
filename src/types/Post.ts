import type { ArticleData } from "../utils/medium";

export type Post = {
    params: { slug: string };
    props: { articleData: ArticleData };
};
