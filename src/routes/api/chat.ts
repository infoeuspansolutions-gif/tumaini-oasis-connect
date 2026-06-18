import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are Tumaini Assistant, the friendly AI concierge for Tumaini Gardens Isinya — a serene nature lodge and event venue along the Nairobi-Namanga Highway in Kajiado County, Kenya (just after Merishaw School, ~67km / 1.5hr from Nairobi).

What we offer:
- Comfortable cottages with garden views
- Swimming pool surrounded by palms
- Lush event grounds for weddings, conferences, team-building & picnics
- On-site restaurant with local & continental cuisine
- Spacious conference halls
- Free parking, Wi-Fi, beautifully landscaped gardens

Contact: +254 759 473 510 (call or WhatsApp).

Be warm, concise, helpful. Use markdown. Always invite guests to book via WhatsApp +254 759 473 510. If asked something you don't know, suggest contacting reception.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
          const body = await request.json();
          const messages = body.messages as UIMessage[];
          const gateway = createLovableAiGatewayProvider(key);
          const result = streamText({
            model: gateway("google/gemini-3-flash-preview"),
            system: SYSTEM_PROMPT,
            messages: convertToModelMessages(messages),
          });
          return result.toUIMessageStreamResponse();
        } catch (err) {
          console.error("chat error", err);
          return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
        }
      },
    },
  },
});
