import { createFileRoute } from "@tanstack/react-router";

const SOURCE =
  "https://tumainigardensresortisinya.lovable.app/__l5e/assets-v1/f5fddeac-bcde-483a-b22f-f0f16123a161/ACCOMMODATION_BROCHURE_2025.pdf";

export const Route = createFileRoute("/accommodation-brochure")({
  server: {
    handlers: {
      GET: async () => {
        const upstream = await fetch(SOURCE);
        if (!upstream.ok || !upstream.body) {
          return new Response("Brochure temporarily unavailable", { status: 502 });
        }
        return new Response(upstream.body, {
          status: 200,
          headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition":
              'inline; filename="Tumaini-Gardens-Accommodation-Brochure-2025.pdf"',
            "Cache-Control": "public, max-age=86400",
          },
        });
      },
    },
  },
});
