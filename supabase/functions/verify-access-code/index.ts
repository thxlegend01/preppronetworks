const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ACCESS_DURATION_MS = 36 * 60 * 60 * 1000;

const normalize = (code: string) => code.toLowerCase().replace(/\s+/g, "").trim();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json().catch(() => ({}));
    const raw = typeof body?.code === "string" ? body.code : "";
    if (!raw || raw.length > 100) {
      return new Response(JSON.stringify({ valid: false }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const configured = (Deno.env.get("PREPPRO_ACCESS_CODES") || "")
      .split(",")
      .map((c) => normalize(c))
      .filter(Boolean);

    const valid = configured.includes(normalize(raw));

    return new Response(
      JSON.stringify(
        valid ? { valid: true, expiresAt: Date.now() + ACCESS_DURATION_MS } : { valid: false },
      ),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (_e) {
    return new Response(JSON.stringify({ valid: false, error: "Unable to verify code" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});