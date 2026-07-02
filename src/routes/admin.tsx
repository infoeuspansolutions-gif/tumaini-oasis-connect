import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase, uploadToPostMedia, signedUrl, DEPARTMENTS, type Post, type Department } from "@/lib/supabase";
import { LogOut, Plus, Trash2, Image as ImageIcon, Paperclip, Loader2, ShieldCheck, Eye, EyeOff } from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function check() {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate({ to: "/auth" });
        return;
      }
      if (!mounted) return;
      setUserEmail(data.session.user.email || null);
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", data.session.user.id);
      const admin = (roles || []).some((r: any) => r.role === "admin");
      setIsAdmin(admin);
      setChecking(false);
    }
    check();
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session) navigate({ to: "/auth" });
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth" });
  }

  if (checking) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center bg-background px-4">
        <div className="max-w-md text-center rounded-3xl bg-card border border-border p-8 shadow-soft">
          <ShieldCheck className="h-10 w-10 text-primary mx-auto" />
          <h1 className="mt-4 font-display text-2xl font-bold">Not authorised</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Signed in as <strong>{userEmail}</strong>, but this account does not have admin rights.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button onClick={signOut} className="rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm">Sign out</button>
            <Link to="/" className="rounded-full border border-border px-5 py-2 text-sm">Go home</Link>
          </div>
        </div>
      </div>
    );
  }

  return <AdminDashboard email={userEmail} onSignOut={signOut} />;
}

function AdminDashboard({ email, onSignOut }: { email: string | null; onSignOut: () => void }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setPosts((data || []) as Post[]);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function togglePublished(p: Post) {
    await supabase.from("posts").update({ published: !p.published }).eq("id", p.id);
    load();
  }

  async function remove(p: Post) {
    if (!confirm(`Delete "${p.title}"?`)) return;
    await supabase.from("posts").delete().eq("id", p.id);
    load();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <header className="border-b border-border/60 bg-card/70 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto max-w-6xl px-5 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary font-semibold">Tumaini Gardens</p>
            <h1 className="font-display text-xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="hidden sm:inline text-muted-foreground">{email}</span>
            <Link to="/admin/settings" className="rounded-full border border-primary/40 bg-primary/10 text-primary px-3 py-1.5 font-semibold hover:bg-primary/20">⚙ Settings</Link>
            <Link to="/" className="rounded-full border border-border px-3 py-1.5 hover:bg-accent/20">View site</Link>
            <button onClick={onSignOut} className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-3 py-1.5">
              <LogOut className="h-3.5 w-3.5" /> Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold">Posts, Updates & Job Adverts</h2>
            <p className="text-sm text-muted-foreground">Anything you post here appears live on the website's Updates feed and is available to the AI concierge.</p>
          </div>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" /> {showForm ? "Close" : "New post"}
          </button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <PostForm
                onCreated={() => {
                  setShowForm(false);
                  load();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="py-16 grid place-items-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
        ) : posts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center">
            <p className="text-muted-foreground">No posts yet. Click <strong>New post</strong> to publish your first update.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {posts.map((p) => (
              <PostRow key={p.id} post={p} onToggle={() => togglePublished(p)} onRemove={() => remove(p)} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function PostForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [department, setDepartment] = useState<Department>("general");
  const [image, setImage] = useState<File | null>(null);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    try {
      let image_url: string | null = null;
      let attachment_url: string | null = null;
      let attachment_name: string | null = null;
      if (image) image_url = await uploadToPostMedia(image);
      if (attachment) {
        attachment_url = await uploadToPostMedia(attachment);
        attachment_name = attachment.name;
      }
      const { data: session } = await supabase.auth.getSession();
      const { error } = await supabase.from("posts").insert({
        title,
        description,
        department,
        image_url,
        attachment_url,
        attachment_name,
        published: true,
        created_by: session.session?.user.id,
      });
      if (error) throw error;
      setTitle("");
      setDescription("");
      setDepartment("general");
      setImage(null);
      setAttachment(null);
      onCreated();
    } catch (e: any) {
      setErr(e?.message || "Failed to publish");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-3xl bg-card border border-border/60 p-6 shadow-soft space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground/70">Title</span>
          <input required value={title} onChange={(e) => setTitle(e.target.value)}
                 className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground/70">Department</span>
          <select value={department} onChange={(e) => setDepartment(e.target.value as Department)}
                  className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary">
            {DEPARTMENTS.map((d) => <option key={d.value} value={d.value}>{d.emoji} {d.label}</option>)}
          </select>
        </label>
        <div />
        <label className="block md:col-span-2">
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground/70">Description / Details</span>
          <textarea required rows={6} value={description} onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the update, event, recipe, notice, or job advert. Include dates, requirements, contact info…"
                    className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground/70 inline-flex items-center gap-1">
            <ImageIcon className="h-3.5 w-3.5" /> Photo (optional)
          </span>
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)}
                 className="mt-1 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-primary" />
          {image && <p className="mt-1 text-xs text-muted-foreground">{image.name}</p>}
        </label>
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground/70 inline-flex items-center gap-1">
            <Paperclip className="h-3.5 w-3.5" /> Attachment (PDF, DOC, etc.)
          </span>
          <input type="file" onChange={(e) => setAttachment(e.target.files?.[0] || null)}
                 className="mt-1 block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-1.5 file:text-primary" />
          {attachment && <p className="mt-1 text-xs text-muted-foreground">{attachment.name}</p>}
        </label>
      </div>
      {err && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
      <div className="flex justify-end">
        <button disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-5 py-2 text-sm font-medium hover:bg-primary/90 disabled:opacity-60">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />} Publish
        </button>
      </div>
    </form>
  );
}

function PostRow({ post, onToggle, onRemove }: { post: Post; onToggle: () => void; onRemove: () => void }) {
  const [thumb, setThumb] = useState<string | null>(null);
  useEffect(() => {
    signedUrl(post.image_url).then(setThumb);
  }, [post.image_url]);
  const dept = DEPARTMENTS.find((d) => d.value === post.department);
  return (
    <div className="flex gap-4 rounded-2xl bg-card border border-border/60 p-4">
      <div className="h-24 w-24 shrink-0 rounded-xl bg-muted overflow-hidden grid place-items-center">
        {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : <ImageIcon className="h-6 w-6 text-muted-foreground" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 font-medium">{dept?.emoji} {dept?.label}</span>
          <span className={`rounded-full px-2 py-0.5 ${post.published ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
            {post.published ? "Published" : "Hidden"}
          </span>
          <span className="text-muted-foreground">{new Date(post.created_at).toLocaleString()}</span>
        </div>
        <h3 className="mt-1 font-semibold text-foreground truncate">{post.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{post.description}</p>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={onToggle} title={post.published ? "Hide" : "Publish"}
                className="rounded-lg border border-border p-2 hover:bg-accent/20">
          {post.published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
        <button onClick={onRemove} title="Delete"
                className="rounded-lg border border-border p-2 text-red-600 hover:bg-red-50">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
