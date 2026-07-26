import { supabase } from "@/integrations/supabase/client";

export const PREPCHAT_ADMIN_EMAILS = [
  "thxlegend01era@gmail.com",
  "saurabhsaroj2010@gmail.com",
  "manojadeviaw@gmail.com",
  "saurabh20103060@gmail.com",
];

export const SUBJECT_TAGS = [
  "Physics",
  "Chemistry",
  "Maths",
  "Biology",
  "JEE",
  "NEET",
  "Boards",
  "General",
];

export interface ProfileLite {
  user_id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
}

export const initialsOf = (p?: ProfileLite | null) =>
  (p?.display_name || p?.username || "U").trim()[0]?.toUpperCase() || "U";

export const nameOf = (p?: ProfileLite | null) =>
  p?.display_name || (p?.username ? `@${p.username}` : "User");

export async function fetchProfiles(ids: string[]) {
  const unique = Array.from(new Set(ids)).filter(Boolean);
  if (!unique.length) return {} as Record<string, ProfileLite>;
  const { data } = await supabase
    .from("profiles")
    .select("user_id, username, display_name, avatar_url")
    .in("user_id", unique);
  const map: Record<string, ProfileLite> = {};
  (data || []).forEach((p) => {
    map[p.user_id] = p as ProfileLite;
  });
  return map;
}

/** Find an existing 1-on-1 conversation between two users, or create one. */
export async function getOrCreateDm(meId: string, otherId: string): Promise<string | null> {
  const { data: mine } = await supabase
    .from("chat_members")
    .select("conversation_id, chat_conversations!inner(type)")
    .eq("user_id", meId)
    .eq("chat_conversations.type", "dm");

  const myConvIds = (mine || []).map((m: { conversation_id: string }) => m.conversation_id);
  if (myConvIds.length) {
    const { data: shared } = await supabase
      .from("chat_members")
      .select("conversation_id")
      .eq("user_id", otherId)
      .in("conversation_id", myConvIds)
      .limit(1);
    if (shared?.length) return shared[0].conversation_id;
  }

  const { data: conv, error } = await supabase
    .from("chat_conversations")
    .insert({ type: "dm", created_by: meId, is_public: false })
    .select("id")
    .single();
  if (error || !conv) return null;

  await supabase.from("chat_members").insert([
    { conversation_id: conv.id, user_id: meId, role: "owner" as const },
    { conversation_id: conv.id, user_id: otherId, role: "member" as const },
  ]);
  return conv.id;
}

export async function uploadChatMedia(file: File, userId: string) {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from("chat-media").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("chat-media").getPublicUrl(path);
  return data.publicUrl;
}

export function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  if (s < 604800) return `${Math.floor(s / 86400)}d`;
  return new Date(iso).toLocaleDateString();
}