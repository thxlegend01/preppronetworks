import { supabase } from "@/integrations/supabase/client";

export const CHAT_MEDIA_BUCKET = "chat-media";
/** Long-lived signed URL (1 year) so private chat media renders in message history. */
const SIGNED_URL_TTL = 60 * 60 * 24 * 365;

/**
 * Upload a file to the private chat-media bucket and return a signed URL.
 * The bucket is private: objects are not reachable without a signature.
 */
export async function uploadChatMediaSigned(path: string, file: File, contentType?: string) {
  const { error } = await supabase.storage
    .from(CHAT_MEDIA_BUCKET)
    .upload(path, file, contentType ? { contentType } : undefined);
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage
    .from(CHAT_MEDIA_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL);
  if (signErr || !data?.signedUrl) throw signErr || new Error("Could not sign media URL");
  return data.signedUrl;
}
