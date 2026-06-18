import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response(JSON.stringify({ error: "no key" }), { status: 500 });
          const body = await request.json();
          const messages = body.messages || [];

          // Convert UIMessages -> simple chat messages
          const chat = messages.map((m: any) => ({
            role: m.role,
            content: (m.parts || []).filter((p: any) => p.type === "text").map((p: any) => p.text).join("\n") || m.content || "",
          }));

          const systemPrompt = `You are Tumaini Assistant, the warm AI concierge for Tumaini Gardens Isinya — a serene nature lodge & event venue along the Nairobi-Namanga Highway in Kajiado County, Kenya (just after Merishaw School, ~67km / 1.5hr from Nairobi).

We offer: comfortable garden cottages, swimming pool surrounded by palms, on-site restaurant (local & continental), spacious conference halls, lush event grounds for weddings/team-building/picnics, free parking & Wi-Fi.

Contact: +254 759 473 510 (call or WhatsApp).

Be warm, concise, helpful. Use light markdown. Always invite guests to book via WhatsApp +254 759 473 510. If asked something specific (rates, availability) suggest contacting reception.`;

          const upstream = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Lovable-API-Key": key,
            },
            body: JSON.stringify({
              model: "google/gemini-3-flash-preview",
              stream: true,
              messages: [{ role: "system", content: systemPrompt }, ...chat],
            }),
          });

          if (!upstream.ok || !upstream.body) {
            const text = await upstream.text();
            return new Response(JSON.stringify({ error: "upstream", status: upstream.status, body: text.slice(0, 500) }), { status: 502, headers: { "content-type": "application/json" } });
          }

          // Transform OpenAI-style SSE stream into AI SDK UI message stream protocol
          const encoder = new TextEncoder();
          const messageId = `m_${Date.now()}`;
          let started = false;

          const stream = new ReadableStream({
            async start(controller) {
              const sendEvent = (obj: any) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
              sendEvent({ type: "start" });
              sendEvent({ type: "start-step" });
              sendEvent({ type: "text-start", id: messageId });

              const reader = upstream.body!.getReader();
              const decoder = new TextDecoder();
              let buffer = "";
              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;
                  buffer += decoder.decode(value, { stream: true });
                  const lines = buffer.split("\n");
                  buffer = lines.pop() || "";
                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (!trimmed.startsWith("data:")) continue;
                    const data = trimmed.slice(5).trim();
                    if (data === "[DONE]") continue;
                    try {
                      const json = JSON.parse(data);
                      const delta = json.choices?.[0]?.delta?.content;
                      if (typeof delta === "string" && delta.length) {
                        started = true;
                        sendEvent({ type: "text-delta", id: messageId, delta });
                      }
                    } catch { /* ignore */ }
                  }
                }
              } catch (e) {
                console.error("stream read err", e);
              }
              if (!started) sendEvent({ type: "text-delta", id: messageId, delta: "Sorry, I couldn't respond right now. Please try again or WhatsApp +254 759 473 510." });
              sendEvent({ type: "text-end", id: messageId });
              sendEvent({ type: "finish-step" });
              sendEvent({ type: "finish" });
              controller.enqueue(encoder.encode("data: [DONE]\n\n"));
              controller.close();
            },
          });

          return new Response(stream, {
            headers: {
              "Content-Type": "text/event-stream",
              "Cache-Control": "no-cache, no-transform",
              "x-vercel-ai-ui-message-stream": "v1",
            },
          });
        } catch (err) {
          console.error("chat handler error", err);
          return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { "content-type": "application/json" } });
        }
      },
    },
  },
});
