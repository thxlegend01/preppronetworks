/** Hostnames (and their subdomains) that may be opened or embedded by the viewer. */
const ALLOWED_HOSTS = [
  "drive.google.com",
  "docs.google.com",
  "youtube.com",
  "youtu.be",
  "preppronetworks.lovable.app",
  "lovable.app",
  "vercel.app",
  "netlify.app",
  "render.com",
  "graphy.com",
  "novatra.in",
  "theeduverse.xyz",
  "qzz.io",
  "cricbuzz.com",
  "gplinks.co",
  "whatsapp.com",
  "telegram.me",
  "t.me",
  "mega.nz",
];

export function isTrustedUrl(rawUrl: string): boolean {
  if (!rawUrl) return false;
  // Same-origin / relative paths are always fine
  if (rawUrl.startsWith("/")) return true;
  try {
    const parsed = new URL(rawUrl, window.location.origin);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return false;
    if (parsed.origin === window.location.origin) return true;
    const host = parsed.hostname.toLowerCase();
    return ALLOWED_HOSTS.some((allowed) => host === allowed || host.endsWith("." + allowed));
  } catch {
    return false;
  }
}

/** Opens an external URL only when it points at a trusted host. */
export function openTrustedUrl(rawUrl: string): boolean {
  if (!isTrustedUrl(rawUrl)) return false;
  window.open(rawUrl, "_blank", "noopener,noreferrer");
  return true;
}