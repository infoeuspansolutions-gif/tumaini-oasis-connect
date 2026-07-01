import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { Lock, Mail, LogIn, UserPlus, KeyRound } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

type Mode = "signin" | "signup" | "reset";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setLoading(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin" });
      } else if (mode === "signup") {
        const redirectTo = `${window.location.origin}/admin`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo },
        });
        if (error) throw error;
        setMsg("Account created. If email confirmation is enabled, check your inbox. Otherwise you can sign in now.");
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth`,
        });
        if (error) throw error;
        setMsg(`Password reset link sent to ${email}. Check your inbox (and spam).`);
      }
    } catch (e: any) {
      setErr(e?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 grid place-items-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-3xl bg-card shadow-glow border border-border/60 p-8"
      >
        <Link to="/" className="text-xs uppercase tracking-widest text-primary font-semibold">← Tumaini Gardens</Link>
        <h1 className="mt-2 font-display text-3xl font-bold text-foreground">
          {mode === "signin" && "Admin Sign In"}
          {mode === "signup" && "Create Admin Account"}
          {mode === "reset" && "Reset Password"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin" && "Tumaini Gardens content management portal."}
          {mode === "signup" && "First registered account automatically becomes admin."}
          {mode === "reset" && "We'll email you a secure reset link."}
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="text-xs font-semibold uppercase tracking-widest text-foreground/70">Email</span>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="infoeuspansolutions@gmail.com"
                className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>
          </label>
          {mode !== "reset" && (
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-widest text-foreground/70">Password</span>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-background pl-9 pr-3 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>
            </label>
          )}

          {err && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{err}</p>}
          {msg && <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">{msg}</p>}

          <button
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {mode === "signin" && <><LogIn className="h-4 w-4" /> Sign in</>}
            {mode === "signup" && <><UserPlus className="h-4 w-4" /> Create account</>}
            {mode === "reset" && <><KeyRound className="h-4 w-4" /> Send reset link</>}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          {mode !== "signin" && <button onClick={() => setMode("signin")} className="hover:text-primary underline">Back to sign in</button>}
          {mode === "signin" && <button onClick={() => setMode("reset")} className="hover:text-primary underline">Forgot password?</button>}
          {mode === "signin" && <button onClick={() => setMode("signup")} className="hover:text-primary underline">Register first admin</button>}
        </div>

        <div className="mt-8 rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
          <p className="font-semibold text-foreground">Recommended admin credentials</p>
          <p className="mt-1">Email: <code>infoeuspansolutions@gmail.com</code></p>
          <p>Password: <code>Tumaini@1234</code> (change after first sign-in)</p>
          <p className="mt-2 italic">The first account created here is automatically granted admin rights.</p>
        </div>
      </motion.div>
    </div>
  );
}
