import { defineConfig } from "astro/config";

// https://astro.build/config
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
    site: "https://blog.frank-mayer.io/",
    integrations: [
        sitemap({
            changefreq: "monthly",
            lastmod: new Date(),
        }),
    ],
});
