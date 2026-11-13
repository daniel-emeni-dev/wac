import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AppRole = "member" | "admin" | "leadership";
export type MemberStatus = "pending" | "active" | "warned" | "removed" | "exited";

export type CurrentMember = {
  id: string;
  member_code: string;
  full_name: string;
  email: string;
  role: AppRole;
  status: MemberStatus;
};

/** Returns the signed in member, or null when the auth user is not linked to a member row. */
export async function getCurrentMember(): Promise<CurrentMember | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("members")
    .select("id, member_code, full_name, email, role, status")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  return (data as CurrentMember | null) ?? null;
}

export async function requireMember(): Promise<CurrentMember> {
  const member = await getCurrentMember();
  if (!member) redirect("/login?error=no_member");
  return member;
}

export async function requireStaff(): Promise<CurrentMember> {
  const member = await requireMember();
  if (member.role === "member") redirect("/dashboard");
  return member;
}

export async function requireLeadership(): Promise<CurrentMember> {
  const member = await requireMember();
  if (member.role !== "leadership") redirect("/dashboard");
  return member;
}
