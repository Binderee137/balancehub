import { createClient } from "@supabase/supabase-js";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profileId");
  const plan = searchParams.get("plan");

  if (!profileId) {
    return Response.json({ error: "Missing profileId" }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const expiresAt = new Date();
  if (plan === "yearly") {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  }

  await supabase.from("subscriptions").upsert({
    profile_id: profileId,
    plan: plan,
    status: "active",
    paid_at: new Date().toISOString(),
    expires_at: expiresAt.toISOString(),
  });

  return Response.redirect(
    process.env.NEXT_PUBLIC_BASE_URL + "/?payment=success"
  );
}
