import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import sitemap from "@astrojs/sitemap";

const NOINDEX_PATHS = ["/kontakt", "/polityka-prywatnosci", "/404"];
const BUILD_LASTMOD = new Date().toISOString();

export default defineConfig({
  output: "static",
  site: "https://www.silnikitrojfazowe.pl",
  trailingSlash: "always",
  integrations: [
    react(),
    tailwind(),
    sitemap({
      filter: (page) => {
        const u = page.replace(/\/$/, "");
        return !NOINDEX_PATHS.some((p) => u.endsWith(p));
      },
      serialize(item) {
        return { ...item, lastmod: BUILD_LASTMOD };
      },
    }),
  ],
});
