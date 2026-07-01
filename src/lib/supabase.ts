import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export const supabase = createClient(url, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: typeof window !== "undefined" ? window.localStorage : undefined,
  },
});

export type Department =
  | "general"
  | "service"
  | "housekeeping"
  | "kitchen"
  | "maintenance"
  | "security"
  | "events"
  | "jobs";

export const DEPARTMENTS: { value: Department; label: string; emoji: string }[] = [
  { value: "general", label: "General Update", emoji: "📢" },
  { value: "events", label: "Events & Celebrations", emoji: "🎉" },
  { value: "service", label: "Service", emoji: "🤝" },
  { value: "housekeeping", label: "Housekeeping", emoji: "🛏️" },
  { value: "kitchen", label: "Kitchen Production", emoji: "🍳" },
  { value: "maintenance", label: "Maintenance", emoji: "🛠️" },
  { value: "security", label: "Security", emoji: "🛡️" },
  { value: "jobs", label: "Job Advert / Careers", emoji: "💼" },
];

export interface Post {
  id: string;
  title: string;
  description: string;
  department: Department;
  image_url: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

const SIGNED_TTL = 60 * 60 * 24 * 7; // 7 days

/** Given an object key stored in DB, produce a fresh signed URL for display. */
export async function signedUrl(pathOrUrl: string | null): Promise<string | null> {
  if (!pathOrUrl) return null;
  // Already a signed/public URL
  if (pathOrUrl.startsWith("http")) return pathOrUrl;
  const { data, error } = await supabase.storage
    .from("post-media")
    .createSignedUrl(pathOrUrl, SIGNED_TTL);
  if (error) return null;
  return data.signedUrl;
}

export async function uploadToPostMedia(file: File): Promise<string> {
  const ext = file.name.split(".").pop() || "bin";
  const key = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from("post-media")
    .upload(key, file, { cacheControl: "3600", upsert: false });
  if (error) throw error;
  return key;
}
