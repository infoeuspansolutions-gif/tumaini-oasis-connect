import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE = "https://tumainigardensresort.co.ke";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const today = new Date().toISOString().slice(0, 10);
        const paths = [
          { p: "/", pri: "1.0", freq: "weekly" },
          { p: "/organic-farming", pri: "0.8", freq: "monthly" },
        ];
        const urls = paths
          .map(
            (u) =>
              `  <url>\n    <loc>${BASE}${u.p}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.freq}</changefreq>\n    <priority>${u.pri}</priority>\n  </url>`,
          )
          .join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
