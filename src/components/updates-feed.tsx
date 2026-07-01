import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase, signedUrl, DEPARTMENTS, type Post } from "@/lib/supabase";
import { Paperclip, Calendar, Newspaper } from "lucide-react";

interface Resolved extends Post {
  _image?: string | null;
  _attachment?: string | null;
}

export function UpdatesFeed({ limit = 6 }: { limit?: number }) {
  const [posts, setPosts] = useState<Resolved[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const { data } = await supabase
        .from("posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (!data || cancelled) {
        setLoading(false);
        return;
      }
      const resolved = await Promise.all(
        (data as Post[]).map(async (p) => ({
          ...p,
          _image: await signedUrl(p.image_url),
          _attachment: await signedUrl(p.attachment_url),
        }))
      );
      if (!cancelled) {
        setPosts(resolved);
        setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [limit]);

  if (loading) return null;
  if (posts.length === 0) return null;

  return (
    <section id="updates" className="relative py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="mx-auto max-w-7xl px-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-widest">
            <Newspaper className="h-3.5 w-3.5" /> Live from Tumaini
          </span>
          <h2 className="mt-3 font-display text-4xl md:text-5xl font-bold text-foreground">News, events & careers</h2>
          <p className="mt-2 text-muted-foreground">Fresh updates published by our team — celebrations, menu highlights, notices and job openings.</p>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => {
            const dept = DEPARTMENTS.find((d) => d.value === p.department);
            return (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group rounded-3xl overflow-hidden bg-card border border-border/60 shadow-soft hover:shadow-glow transition-shadow"
              >
                {p._image && (
                  <div className="aspect-[4/3] overflow-hidden">
                    <img src={p._image} alt={p.title}
                         className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 font-medium">
                      {dept?.emoji} {dept?.label}
                    </span>
                    <span className="text-muted-foreground inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(p.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap line-clamp-5">{p.description}</p>
                  {p._attachment && (
                    <a href={p._attachment} target="_blank" rel="noreferrer"
                       className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
                      <Paperclip className="h-3.5 w-3.5" /> {p.attachment_name || "Download attachment"}
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
