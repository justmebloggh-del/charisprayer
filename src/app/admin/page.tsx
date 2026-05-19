import { createClient } from "@/utils/supabase/server";
import { AdminDashboard } from "./AdminDashboard";

const IS_CONFIGURED =
  (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").length > 0 &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("placeholder");

export default async function AdminPage() {
  let userObj = { email: "admin", role: "admin" };

  if (IS_CONFIGURED) {
    const { redirect } = await import("next/navigation");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    if (user) {
      userObj = {
        email: user.email ?? "admin",
        role: (user.user_metadata?.role as string) ?? "admin",
      };
    }
  }

  return <AdminDashboard user={userObj} />;
}
