import { getServiceSupabase } from "../../lib/supabase";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const profileId = searchParams.get("profileId");
  const plan = searchParams.get("plan");

  if (!profileId) {
    return Response.json({ error: "Missing profileId" }, { status: 400 });
  }

  // Subscription идэвхжүүлэх
  const expiresAt = new Date();
  if (plan === "yearly") {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  } else {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  }

  try {
    const supabase = getServiceSupabase();

    await supabase.from("subscriptions").upsert({
      profile_id: profileId,
      plan: plan,
      status: "active",
      paid_at: new Date().toISOString(),
      expires_at: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Supabase error:", error);
  }

  // Амжилттай хуудас руу redirect
  return Response.redirect(
    `${process.env.NEXT_PUBLIC_BASE_URL}/?payment=success`
  );
}
