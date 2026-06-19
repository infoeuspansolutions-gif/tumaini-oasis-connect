import { createFileRoute } from "@tanstack/react-router";
import type { UIMessage } from "ai";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const key = process.env.LOVABLE_API_KEY;
          if (!key) {
            return Response.json({ error: "AI assistant is not configured yet." }, { status: 500 });
          }
          const body = (await request.json()) as { messages?: UIMessage[] };
          const messages = body.messages ?? [];

          const systemPrompt = `You are Tumaini Assistant, the warm AI concierge for Tumaini Gardens Isinya — a serene nature lodge & event venue along the Nairobi-Namanga Highway in Kajiado County, Kenya (just after Merishaw School, ~67km / 1.5hr from Nairobi).

We offer: comfortable garden cottages, swimming pool surrounded by palms, on-site restaurant (local & continental), spacious conference halls, lush event grounds for weddings/team-building/picnics, free parking & Wi-Fi.

Contact: +254 759 473 510 (call or WhatsApp).

Be warm, concise, helpful. Use light markdown. Always invite guests to book via WhatsApp +254 759 473 510. If asked something specific (rates, availability) suggest contacting reception.`;

          const { convertToModelMessages, streamText } = await import("ai");
          const {
            createLovableAiGatewayProvider,
            getLovableAiGatewayResponseHeaders,
            getLovableAiGatewayRunId,
            withLovableAiGatewayRunIdHeader,
          } = await import("@/lib/ai-gateway.server");

          const initialRunId = getLovableAiGatewayRunId(request);
          const gateway = createLovableAiGatewayProvider(key, initialRunId);
          const result = streamText({
            model: gateway("google/gemini-3-flash-preview"),
            system: systemPrompt,
            messages: await convertToModelMessages(messages),
          });

          const response = result.toUIMessageStreamResponse({
            headers: getLovableAiGatewayResponseHeaders(undefined, {
              ...(initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : {}),
            }),
          });

          return withLovableAiGatewayRunIdHeader(response, gateway);
        } catch (err) {
          console.error("chat handler error", err);
          return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
        }
      },
    },
  },
});
